import { json, type RequestHandler } from '@sveltejs/kit';
import type { APIResponse } from '$lib/types/response/response';
import type {  CheckUserValidPhoneInput, User } from '$lib/types/user';
import { getUserById } from '$lib/server/collections/user';
import { 
	isValidPhoneNumber, 
} from '$lib/utils/validator';


function validateInput(input: CheckUserValidPhoneInput): void {
	if (!input.id) {
		throw new Error('id cannot be empty');
	} else if  (!input.phone) {
		throw new Error('Phone number cannot be empty');
	} else if (!isValidPhoneNumber(input.phone)) {
		throw new Error('Invalid phone number format');
	}
}

const createSuccessResponse = (userId: string, isValidPhoneNumber: boolean, message?: string): APIResponse<{ id: string; isValidPhoneNumber: boolean }> => ({
    message: message ? message : 'Ok',
    status: 200,
    data: {
        id: userId,
        isValidPhoneNumber,
    }
});

export const POST: RequestHandler = async ({ request }) =>  {
	const input: CheckUserValidPhoneInput = await request.json();
    const failedMessage = "The phone number inserted does not match. Please try again."

	try {
		validateInput(input)
	} catch(e) {
		console.error("[validateInput Check valid phone number] error: ", e)
        const errorMessage = e instanceof Error ? e.message : 'Error when validating request';
        
		return json({ message: failedMessage, error: errorMessage }, { status: 422 });
	}

	let user: User | null = null;
	try {
		user = await getUserById(input.id)
		if (!user) {
			return json({ message: failedMessage, error: "User is not found" }, { status: 400 });
		}

        if (user.phone !== input.phone) {
            const response = createSuccessResponse(user.id, false, failedMessage)
			return json(response);
        }

        const response = createSuccessResponse(user.id, true)
        return json(response)

	} catch(e) {
		console.error("check customer valid phone number error: ", e)
		const errorMessage = e instanceof Error ? e.message : 'Internal Server Error';

		return json({ message: failedMessage, error: errorMessage }, { status: 500 });
	}
}