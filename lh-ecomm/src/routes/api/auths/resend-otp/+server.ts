import { json, type RequestHandler } from '@sveltejs/kit';
import { insertUserOTP } from '$lib/server/collections/otp';
import { getUserById } from '$lib/server/collections/user';
import { generateOTP } from '$lib/utils/crypto';
import { sendEmailForgotPassword } from '$lib/server/services/email'; 


export const POST: RequestHandler = async ({ request }) => {

	const { userId } = await request.json();
    if (!userId) {
        return json({ error: 'User ID cannot be empty' }, { status: 422 });
    }

	try {
        const user = await getUserById(userId);
		if (!user) {
			return json({ error: "User is not found" }, { status: 422 });
		}

        const otp = generateOTP();
        const fullName = `${user.firstName} ${user.lastName}`;

        await sendEmailForgotPassword(user.email, fullName, otp);

        await insertUserOTP(user.id, otp);
        
		return json({
            message: "Success resend OTP",
            data: {userId: user.id}
        }, 
        {
            status: 200
        });
	} catch(e) {
		console.error("resend otp error: ", e)
		const errorMessage = e instanceof Error ? e.message : 'Internal Server Error';

		return json({ error: errorMessage }, { status: 500 });
	}
};