import { json, type RequestHandler } from '@sveltejs/kit';
import { getUserByEmail, getUserByPhoneNumber, insertUser } from '$lib/server/collections/user';
import { generateJWTToken, setAuthToken, type TokenClaims } from '$lib/utils/auth'
import { AUTH_METHOD_FORM } from '$lib/constants.util';
import type { UserInput } from '$lib/types/user';
import type { RegisterInput } from '$lib/types/auth';
import { createCustomerAndTokenAccess } from '$lib/server/services/shopify'
import {generateHashPassword} from '$lib/utils/crypto';
import { 
	isValidEmail, 
	isValidPhoneNumber, 
	isValidPassword, 
	isCountryCodeMatch 
} from '$lib/utils/validator';
import { insertAuthFailure } from '$lib/server/collections/authFailure';
import { ErrorCodes } from '$lib/constant/errorCode';
import { generateError } from '$lib/utils/error';


function validateRegisterInput(input: RegisterInput): void {
	if (!input.email) {
		throw new Error(ErrorCodes.EMAIL_NOT_EXISTS);
	} else if (!isValidEmail(input.email)) {
		throw new Error(ErrorCodes.INVALID_EMAIL_FORMAT);
	}
	if (!input.firstName) {
		throw new Error(ErrorCodes.FIRST_NAME_NOT_EXISTS);
	}
	if (!input.lastName ) {
		throw new Error(ErrorCodes.LAST_NAME_NOT_EXISTS);
	}
	if (!input.phone) {
		throw new Error(ErrorCodes.PHONE_NUMBER_NOT_EXISTS);
	} else if (!isValidPhoneNumber(input.phone)) {
		throw new Error(ErrorCodes.INVALID_PHONE_NUMBER_FORMAT);
	}
	if (!isCountryCodeMatch(input.phone, input.store)) {
		throw new Error(ErrorCodes.MISMATCH_COUNTRY_CODE);
	}
	if (!input.password) {
		throw new Error(ErrorCodes.PASSWORD_NOT_EXISTS);
	} else if (!isValidPassword(input.password)) {
		throw new Error(ErrorCodes.INVALID_PASSWORD_FORMAT);
	}
	if (!input.confirmPassword) {
		throw new Error(ErrorCodes.CONFIRM_PASSWORD_NOT_EXISTS);
	}
	if (input.password !== input.confirmPassword) {
		throw new Error(ErrorCodes.MISMATCH_CONFIRM_PASSWORD);
	}
}


export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	const ipAddress = locals.requestIPAddress || request.headers.get('x-forwarded-for') || request.headers.get('remote-addr');
	const userAgent = request.headers.get('user-agent');

	const input: RegisterInput = await request.json();
	if (!input.store) {
		input.store = 'id'
	}

	try {
		validateRegisterInput(input)
	} catch(e) {
		console.error("[validateRegisterInput] error: ", e)
		const {status, error} = e instanceof Error ? generateError(e.message) : generateError(ErrorCodes.VALIDATION_ERROR);

		insertAuthFailure({
			shopifyId: null,
			email: input.email,
			eventAction: "signup",
			errorMessage: error,
			ipAddress,
			userAgent
		})

		return json({ error: error }, { status: status });
	}

	try {
		const emailExists = await getUserByEmail(input.email)
		if (emailExists) {
			throw new Error(ErrorCodes.EMAIL_ALREADY_EXISTS);
		}

		const phoneNumberExists = await getUserByPhoneNumber(input.phone)
		if (phoneNumberExists) {
			throw new Error(ErrorCodes.PHONE_NUMBER_ALREADY_EXISTS);
		}

		const hashedPassword = await generateHashPassword(input.password);

		const data: UserInput = {
			firstName: input.firstName,
			lastName: input.lastName,
			phone: input.phone,
			email: input.email.toLowerCase(),
			password: hashedPassword,
			method: AUTH_METHOD_FORM,
			countryCode: input.store === 'id' ? 'ID' : 'SG',
		}

		const shopifyData = await createCustomerAndTokenAccess(data.email, data.firstName, data.lastName).catch(e => {
			console.error("failed to create customer and access token shopify: ", e)
		})
		if (shopifyData?.id) {
			data.shopifyId = shopifyData.id
		}
		if (shopifyData?.token) {
			data.token = shopifyData.token
		}

		const newUser = await insertUser(data);
		
		const claims: TokenClaims = {
			userId: newUser.id,
			shopifyId: null,
			shopifyToken: null
		}
		const accessToken = generateJWTToken(claims)

		setAuthToken(cookies, accessToken)

		return json({
			firstName: newUser.firstName,
			lastName: newUser.lastName,
			accessToken: accessToken
		}, {status: 201})


	} catch(e) {
		console.error("register user error: ", e)
		const {status, error} = e instanceof Error ? generateError(e.message) : generateError('Internal Server Error');

		insertAuthFailure({
			shopifyId: null,
			email: input.email,
			eventAction: "signup",
			errorMessage: error,
			ipAddress,
			userAgent
		})

		return json({ error: error }, { status: status });
	}
}