import { json, type RequestHandler } from '@sveltejs/kit';
import type { LoginInput } from '$lib/types/auth';
import type{  User } from '$lib/types/user';
import { getUserByEmail } from '$lib/server/collections/user';
import { verifyPassword } from '$lib/utils/crypto';
import { ErrorCodes } from '$lib/constant/errorCode';
import { generateError } from '$lib/utils/error';

import { generateJWTToken, setAuthToken, type TokenClaims } from '$lib/utils/auth'
import { 
	isValidEmail, 
	isValidPassword, 
} from '$lib/utils/validator';
import { insertAuthFailure } from '$lib/server/collections/authFailure';
import { 
	handleTokenCreationForExistingShopifyId,
	handleShopifyIdRecovery,
	handleCustomerCreation
} from '$lib/server/services/shopify'


function validateLoginInput(input: LoginInput): void {
	if (!input.email) {
		throw new Error(ErrorCodes.EMAIL_NOT_EXISTS);
	} else if (!isValidEmail(input.email)) {
		throw new Error(ErrorCodes.INVALID_EMAIL_FORMAT);
	}
    if (!input.password) {
		throw new Error(ErrorCodes.PASSWORD_NOT_EXISTS);
	} 
}

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	const ipAddress = locals.requestIPAddress || request.headers.get('x-forwarded-for') || request.headers.get('remote-addr');
	const userAgent = request.headers.get('user-agent');

	const input: LoginInput = await request.json();

	try {
		validateLoginInput(input)
	} catch(e) {
		console.error("[validateLoginInput] error: ", e)
        const errorMessage = e instanceof Error ? e.message : 'Error when validating request';
		const {status, error} = generateError(errorMessage)

		insertAuthFailure({
			shopifyId: null,
			email: input.email,
			eventAction: "login",
			errorMessage: error,
			ipAddress,
			userAgent
		})
		return json({ error: error }, { status: status });
	}

	let user: User | null = null;
	try {
		user = await getUserByEmail(input.email)
		if (!user) {
			throw new Error(ErrorCodes.USER_EMAIL_NOT_FOUND);
		}

		if (!isValidPassword(input.password)) {
			throw new Error(ErrorCodes.INVALID_PASSWORD_FORMAT);
		}

		const isVerified = await verifyPassword(user.password, input.password)
		if (!isVerified) {
			throw new Error(ErrorCodes.PASSWORD_MISMATCH);
		}

		// handle missing shopify data
		if (user.shopifyId && !user.token) {
			await handleTokenCreationForExistingShopifyId(user, user.shopifyId).catch(e => {
				console.error("failed to create access token shopify when login: ", e);
			});
		} else if (user.token && !user.shopifyId) {
			await handleShopifyIdRecovery(user, user.token).catch(e => {
				console.error("failed to create customer shopify id when login: ", e);
			});
		} else if (!user.shopifyId && !user.token) {
			await handleCustomerCreation(user).catch(e => {
				console.error("failed to create customer and access token shopify: ", e);
			});
		}
		
		const claims: TokenClaims = {
			userId: user.id,
			shopifyId: user?.shopifyId || null,
			shopifyToken: user?.token || null
		}
		const accessToken = generateJWTToken(claims)

		setAuthToken(cookies,accessToken)

		return json({
			firstName: user.firstName,
			lastName: user.lastName,
			accessToken: accessToken
		}, {status: 200})
	} catch(e) {
		console.error("sign in user error: ", e)
		const {status, error} = e instanceof Error ? generateError(e.message) : generateError('Internal Server Error');

		insertAuthFailure({
			shopifyId: user?.shopifyId,
			email: input.email,
			eventAction: "login",
			errorMessage: error,
			ipAddress,
			userAgent
		})
		return json({ error: error }, { status: status });
	}
}