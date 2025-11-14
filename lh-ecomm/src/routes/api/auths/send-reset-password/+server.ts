import { json, type RequestHandler } from '@sveltejs/kit';
import { getUserByEmail } from '$lib/server/collections/user';
import { sendEmailForgotPassword } from '$lib/server/services/email'; 
import { isValidEmail } from '$lib/utils/validator';
import { generateOTP } from '$lib/utils/crypto';
import { insertAuthFailure } from '$lib/server/collections/authFailure';
import { insertUserOTP } from '$lib/server/collections/otp';


export const POST: RequestHandler = async ({ request }) => {

	const { email } = await request.json();
	try {
        if (!email) {
            throw new Error('Email cannot be empty');
        } else if (!isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
	} catch(e) {
        const errorMessage = e instanceof Error ? e.message : 'Error when validating request';
		return json({ error: errorMessage }, { status: 422 });
	}

	try {
		const user = await getUserByEmail(email);
		if (!user) {
			return json({ error: "Email is not registered" }, { status: 422 });
		}

        const otp = generateOTP();
        const fullName = `${user.firstName} ${user.lastName}`;

        await sendEmailForgotPassword(user.email, fullName, otp);

        await insertUserOTP(user.id, otp);

		return json({
            message: "Successfully send reset password",
            data: {userId: user.id}
        }, {status: 201});
	} catch(e) {
		console.error("send reset password error: ", e)
		const errorMessage = e instanceof Error ? e.message : 'Internal Server Error';

		insertAuthFailure({
			shopifyId: null,
			email: email,
			eventAction: "send-reset-password",
			errorMessage: errorMessage,
		})

		return json({ error: errorMessage }, { status: 500 });
	}
};