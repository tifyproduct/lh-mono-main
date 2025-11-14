import { json, type RequestHandler } from '@sveltejs/kit';
import { getUserById } from '$lib/server/collections/user';
import { getLast8Digits } from '$lib/utils/formatter';
import { OTP_VALID_COOKIES_NAME } from '$lib/constants.util';
import type { CheckUserLastNamePhoneNumberInput } from '$lib/types/auth';


function validateUserLastNameAndPhoneInput(input: CheckUserLastNamePhoneNumberInput): void {
    if (!input.userId) {
        throw new Error('User ID cannot be empty');
    }
	if (!input.lastName) {
		throw new Error('Last name cannot be empty');
	} 
	if (!input.phoneNumber) {
		throw new Error('Phone number cannot be empty');
	}
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const input: CheckUserLastNamePhoneNumberInput = await request.json();
    try {
		validateUserLastNameAndPhoneInput(input)
	} catch(e) {
		console.error("[validateUserLastNameAndPhoneInput] error: ", e)
        const errorMessage = e instanceof Error ? e.message : 'Error when validating request';
		return json({ error: errorMessage }, { status: 422 });
	}

	try {
        const user = await getUserById(input.userId);
		if (!user) {
			return json({ error: "User is not found" }, { status: 422 });
		}

		if (!user.phone) {
			return json({ error: "You have not saved your phone number. Please save your phone number first." }, { status: 400 });
		}

        const last8DigitPhoneNumber = getLast8Digits(user.phone);

        if (last8DigitPhoneNumber === input.phoneNumber && user.lastName === input.lastName) {

            cookies.set(OTP_VALID_COOKIES_NAME, "true", {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                maxAge: 300 // 5 minutes
            })

            return json({message: "Data is matched"}, {status: 200});
        } else {
            return json({error: "Data does not match"}, {status: 400});
        }
	
	} catch(e) {
		console.error("check user last name and phone number error: ", e)
		const errorMessage = e instanceof Error ? e.message : 'Internal Server Error';

		return json({ error: errorMessage }, { status: 500 });
	}
};