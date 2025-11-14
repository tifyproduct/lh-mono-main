import { DEFAULT_EMAIL_SENDER, SENDGRID_FORGOT_PASSWORD_TEMPLATE_ID } from '$env/static/private';
import { RESET_PASSWORD_EMAIL_SUBJECT } from '$lib/constants.util';
import  email  from '$lib/server/sendgrid';


export async function sendEmailForgotPassword(recipient: string, name: string, otp: string): Promise<void> {
    if (!recipient || !name || !otp) {
        throw new Error("Recipient, name, and OTP must be provided.");
    }

    try {
        const emailContent = {
            to: recipient,
            from: DEFAULT_EMAIL_SENDER,
            templateId: SENDGRID_FORGOT_PASSWORD_TEMPLATE_ID,
            dynamicTemplateData: {
                subject: RESET_PASSWORD_EMAIL_SUBJECT,
                name: name,
                otpCode: otp
            },
        };
        await email.send(emailContent);
    } catch (err) {
        console.error("sendEmailForgotPassword error: ", err);
        if ((err as any)?.code === 429) {
            throw new Error("Daily sending limit exceeded.")
        }
        throw new Error("Error sending email forgot password")
    }
};


