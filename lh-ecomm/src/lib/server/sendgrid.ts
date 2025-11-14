import email from "@sendgrid/mail";
import { SENDGRID_API_KEY } from '$env/static/private';

email.setApiKey(SENDGRID_API_KEY);

export default email