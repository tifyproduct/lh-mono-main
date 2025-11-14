import { json, type RequestHandler } from '@sveltejs/kit';
import { DateTime } from 'luxon';
import { SHOPIFY_TOKEN_COOKIES_NAME } from '$lib/constants.util';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ fetch, request, cookies }) => {
	const db = getDB();

	const body = await request.json();

	let res = {
		success: false,
		token: false,
		message: '',
	}

	const userExist = await db.collection('Users').findOne({
		email: body.email.toLowerCase()
	});

	if(userExist) {
		if(userExist.password === body.password) {
			if(userExist.token) {
				cookies.set(SHOPIFY_TOKEN_COOKIES_NAME, userExist.token, {
					path: '/',
					expires: DateTime.now().plus({ months: 6 }).toJSDate()
				});

				res = {
					success: true,
					token: true,
					message: 'Success Login',
				}
			} else {
				res = {
					success: true,
					token: false,
					message: 'No token!',
				}
			}
		} else {
			res = {
				success: false,
				token: false,
				message: 'Credential incorrect!',
			}
		}
	}

	return json(res);
};
