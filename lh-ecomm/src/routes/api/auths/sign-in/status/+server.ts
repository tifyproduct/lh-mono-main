import { json, type RequestHandler } from '@sveltejs/kit';
import { isValidEmail, isValidPhoneNumber } from '$lib/utils/validator';
import { ErrorCodes } from '$lib/constant/errorCode';
import { generateError } from '$lib/utils/error';
import { getUserByEmail } from '$lib/server/collections/user';
import type { User } from '$lib/types/user';
import type { APIResponse } from '$lib/types/response/response';
import type { ValidateEmailResponse } from '$lib/types/auth';
import {
	AUTH_METHOD_SOCIAL_LOGIN_GOOGLE,
	AUTH_METHOD_MANUAL_ACTIVATION
} from '$lib/constants.util';

function checkUserHasSetPassword(user: User): boolean {
	if (![AUTH_METHOD_SOCIAL_LOGIN_GOOGLE, AUTH_METHOD_MANUAL_ACTIVATION].includes(user.method)) {
		return true;
	}

	return user.isSetPassword ?? false;
}

function checkValidPhoneNumber(user: User): boolean {
	let isValid = false;
	if (user.phone) {
		isValid = isValidPhoneNumber(user.phone);
	}

	return isValid;
}

export const POST: RequestHandler = async ({ request }) => {
	const { email }: { email: string } = await request.json();

	try {
		if (!email) {
			throw new Error(ErrorCodes.EMAIL_NOT_EXISTS);
		} else if (!isValidEmail(email)) {
			throw new Error(ErrorCodes.INVALID_EMAIL_FORMAT);
		}
	} catch (e) {
		const errorMessage = e instanceof Error ? e.message : 'Error when validating request';
		const { status, error } = generateError(errorMessage);
		return json({ error: error }, { status: status });
	}

	let user: User | null = null;
	try {
		user = await getUserByEmail(email);
		if (!user) {
			throw new Error(ErrorCodes.USER_EMAIL_NOT_FOUND);
		}

		const hasSetPassword = checkUserHasSetPassword(user);
		const isPhoneNumberValid = checkValidPhoneNumber(user);

		const response: APIResponse<ValidateEmailResponse> = {
			message: 'Ok',
			status: 200,
			data: {
				isSocialAccount: user.method === AUTH_METHOD_SOCIAL_LOGIN_GOOGLE,
				hasSetPassword: hasSetPassword,
				hasPhoneNumber: user.phone ? true : false,
				isValidPhoneNumber: isPhoneNumberValid
			}
		};

		return json(response);
	} catch (e) {
		console.error('check user sign in status error: ', e);
		const { status, error } =
			e instanceof Error ? generateError(e.message) : generateError('Internal Server Error');
		return json({ error: error }, { status: status });
	}
};
