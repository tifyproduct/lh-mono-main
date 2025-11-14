import { json, type RequestHandler } from '@sveltejs/kit';
import { getUserById, updateUserPassword, setNewUserPassword } from '$lib/server/collections/user';
import { deleteUserOTPs } from '$lib/server/collections/otp';
import {generateHashPassword} from '$lib/utils/crypto';
import { 
	OTP_VALID_COOKIES_NAME, 
	AUTH_METHOD_SOCIAL_LOGIN_GOOGLE,
	SHOW_GOOGLE_LOGIN_COOKIES_NAME,
	AUTH_METHOD_MANUAL_ACTIVATION,
} from '$lib/constants.util';
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

export const POST: RequestHandler = async ({ request, locals, cookies }) => {
    if (!locals.isOtpValid) {
        return json({ error: 'Forbidden' }, { status: 403 }); 
    }
	const input: ResetPasswordInput = await request.json();
    try {
		validateResetPasswordInput(input)
	} catch(e) {
		console.error("[validateResetPasswordInput] error: ", e)
        const errorMessage = e instanceof Error ? e.message : 'Error when validating request';
		return json({ error: errorMessage }, { status: 422 });
	}

	try {
        const user = await getUserById(input.userId);
		if (!user) {
			return json({ error: "User is not found" }, { status: 422 });
		}

        const newPassword = await generateHashPassword(input.password)

		if ([AUTH_METHOD_SOCIAL_LOGIN_GOOGLE, AUTH_METHOD_MANUAL_ACTIVATION].includes(user.method) && !user.isSetPassword) {
			const isUpdated = await setNewUserPassword(user.id, newPassword)
			if (!isUpdated) {
				throw new Error("Failed to update the password")
			}

			if (user.method === AUTH_METHOD_SOCIAL_LOGIN_GOOGLE && cookies.get(SHOW_GOOGLE_LOGIN_COOKIES_NAME) == 'true') {
				cookies.delete(SHOW_GOOGLE_LOGIN_COOKIES_NAME, {
					path: '/'
				});
			}
		} else {
			const isUpdated = await updateUserPassword(user.id, newPassword)
			if (!isUpdated) {
				throw new Error("Failed to update the password")
			}
		}

        const isOTPDeleted = await deleteUserOTPs(user.id)
        if (!isOTPDeleted) {
            throw new Error("No OTPs were deleted")
        }

        cookies.delete(OTP_VALID_COOKIES_NAME, { path: '/' })

		return json({
            message: "Successfully reset password",
        }, 
        {
            status: 200
        });
	} catch(e) {
		console.error("reset password error: ", e)
		const errorMessage = e instanceof Error ? e.message : 'Internal Server Error';

		return json({ error: errorMessage }, { status: 500 });
	}
};