import { PUBLIC_MIDDLEWARE_URL, PUBLIC_ZOHO_PUBLIC_KEY } from '$env/static/public';
import { json, type RequestHandler } from '@sveltejs/kit';
import axios from 'axios';

export const POST: RequestHandler = async ({ request }) => {
	const publickey = PUBLIC_ZOHO_PUBLIC_KEY;
	const MiddlewareUrl = PUBLIC_MIDDLEWARE_URL;

	const url = `${MiddlewareUrl}/data_website?publickey=${publickey}`;

	const body = await request.json();

	const zohoRequest = await axios.post(url, body, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const response = zohoRequest.data;

	return json({ msg: response });
};
