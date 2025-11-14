import { json, type RequestHandler } from '@sveltejs/kit';
// import { ZOHO_SWU_URL, ZOHO_SWU_KEY } from '$env/static/private';
import axios from 'axios';

export const POST: RequestHandler = async ({ request }) => {
	// const url = `${ZOHO_SWU_URL}${ZOHO_SWU_KEY}`;
	const url =
		'https://www.zohoapis.com/creator/custom/luxehouze/swu_website?publickey=awVwvvwznAsztEmBf6AGbfAQY';
	const body = await request.json();

	const zohoRequest = await axios.post(url, body, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

	const response = zohoRequest.data;

	return json({ msg: response });
};
