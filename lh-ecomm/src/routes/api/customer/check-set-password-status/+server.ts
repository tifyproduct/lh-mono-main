import { json, type RequestHandler } from '@sveltejs/kit';
import type { CheckUserSetPasswordResponse } from '$lib/types/response/user';
import type {  CheckUserSetPasswordInput, User } from '$lib/types/user';
import { getUserByEmail } from '$lib/server/collections/user';
import { AUTH_METHOD_SOCIAL_LOGIN_GOOGLE, AUTH_METHOD_MANUAL_ACTIVATION } from '$lib/constants.util';
import { 
	isValidEmail, 
} from '$lib/utils/validator';


function validateInput(input: CheckUserSetPasswordInput): void {
	if (!input.email) {
		throw new Error('Email cannot be empty');
	} else if (!isValidEmail(input.email)) {
		throw new Error('Invalid email format');
	}
}

const createResponse = (userId: string, hasSetPassword: boolean): CheckUserSetPasswordResponse => ({
    message: 'Ok',
    status: 200,
    data: {
        id: userId,
        hasSetPassword,
    }
});

export const POST: RequestHandler = async ({ request }) =>  {
	const input: CheckUserSetPasswordInput = await request.json();
    const failedMessage = "Failed to check user set password status"

	try {
		validateInput(input)
	} catch(e) {
		console.error("[validateInput] error: ", e)
        const errorMessage = e instanceof Error ? e.message : 'Error when validating request';
        
		return json({ message: failedMessage, error: errorMessage }, { status: 422 });
	}

	let user: User | null = null;
	try {
		user = await getUserByEmail(input.email)
		if (!user) {
			return json({ message: failedMessage, error: "Email not found" }, { status: 400 });
		}
    
		if (![AUTH_METHOD_SOCIAL_LOGIN_GOOGLE, AUTH_METHOD_MANUAL_ACTIVATION].includes(user.method)) {
    
            const response = createResponse(user.id, true)
            return json(response)
		}

        const response = createResponse(user.id, user.isSetPassword ? user.isSetPassword : false)

        return json(response)

	} catch(e) {
		console.error("check customer set password status by email error: ", e)
		const errorMessage = e instanceof Error ? e.message : 'Internal Server Error';

		return json({ message: failedMessage, error: errorMessage }, { status: 500 });
	}
}