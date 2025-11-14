import { json, type RequestHandler } from '@sveltejs/kit';
import { getLatestUserOTP } from '$lib/server/collections/otp';
import { OTP_VALID_COOKIES_NAME } from '$lib/constants.util';


export const POST: RequestHandler = async ({ request, cookies }) => {

	const { userId, otp } = await request.json();
	try {
        if (!userId) {
            throw new Error('User ID cannot be empty'); 
        }
        if (!otp) {
            throw new Error('OTP cannot be empty');
        }
	} catch(e) {
        const errorMessage = e instanceof Error ? e.message : 'Error when validating request';
		return json({ error: errorMessage }, { status: 422 });
	}

	try {
		const otpRecord = await getLatestUserOTP(userId)
        if (!otpRecord) {
            return json({ error: "OTP is not found"}, { status: 400})
        }

        if (otpRecord.otp !== otp) {
            return json({ error: "Invalid OTP"}, { status: 400})
        }

        const now = new Date()
        if (now > otpRecord.expiresAt) {
            return json({ error: "The OTP has expired"}, { status: 400})
        }

        cookies.set(OTP_VALID_COOKIES_NAME, "true", {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 300 // 5 minutes
        })
        
		return json({
            message: "Success",
            data: {userId: userId}
        },
        {
            status: 200
        });
	} catch(e) {
		console.error("verify otp error: ", e)
		const errorMessage = e instanceof Error ? e.message : 'Internal Server Error';

		return json({ error: errorMessage }, { status: 500 });
	}
};