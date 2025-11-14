import { json, type RequestHandler } from '@sveltejs/kit';
import { getUserById, setNewUserPassword } from '$lib/server/collections/user';
import {generateHashPassword} from '$lib/utils/crypto';
import { SHOW_GOOGLE_LOGIN_COOKIES_NAME, AUTH_METHOD_MANUAL_ACTIVATION, AUTH_METHOD_SOCIAL_LOGIN_GOOGLE } from '$lib/constants.util';
import type { ResetPasswordInput } from '$lib/types/auth';
import { isValidPassword } from '$lib/utils/validator';


function validateResetPasswordInput(input: ResetPasswordInput): void {
    if (!input.userId) {
        throw new Error('User ID cannot be empty');
    }
	if (!input.password) {
		throw new Error('Password cannot be empty');
	} else if (!isValidPassword(input.password)) {
		throw new Error('Invalid password format');
	}
	if (!input.confirmPassword) {
		throw new Error('Confirm password cannot be empty');
	}
	if (input.password !== input.confirmPassword) {
		throw new Error(`Password does not match`);
	}
}

// This endpoint is to force update password for social login and manual activation users
export const POST: RequestHandler = async ({ request, cookies }) => {
	const input: ResetPasswordInput = await request.json();
    const failedMessage = "Failed to update new password"
    try {
		validateResetPasswordInput(input)
	} catch(e) {
		console.error("[validateResetPasswordInput] error: ", e)
        const errorMessage = e instanceof Error ? e.message : 'Error when validating request';
		return json({ message: failedMessage, error: errorMessage }, { status: 422 });
	}

	try {
        const user = await getUserById(input.userId);
		if (!user) {
			return json({ message: failedMessage, error: "User is not found" }, { status: 422 });
		}
		if (![AUTH_METHOD_SOCIAL_LOGIN_GOOGLE, AUTH_METHOD_MANUAL_ACTIVATION].includes(user.method)) {
            return json({ message: failedMessage, error: "Invalid user method" }, { status: 403 });
		}

        if (user.isSetPassword) {
            return json({ message: failedMessage, error: "User has already set the new password" }, { status: 400 });
        }

        const newPassword = await generateHashPassword(input.password)

        const isUpdated = await setNewUserPassword(user.id, newPassword)
        if (!isUpdated) {
            throw new Error("Failed to update the password")
        }

        if (user.method === AUTH_METHOD_SOCIAL_LOGIN_GOOGLE && cookies.get(SHOW_GOOGLE_LOGIN_COOKIES_NAME) === 'true') {
            cookies.delete(SHOW_GOOGLE_LOGIN_COOKIES_NAME, {
                path: '/'
            });
        }

		return json({
            message: "Successfully to set new password",
        }, 
        {
            status: 200
        });
	} catch(e) {
		console.error("set new password error: ", e)
		const errorMessage = e instanceof Error ? e.message : 'Internal Server Error';

		return json({ message: failedMessage, error: errorMessage }, { status: 500 });
	}
};