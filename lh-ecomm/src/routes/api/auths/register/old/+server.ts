import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { uuid } from 'uuidv4';


// TODO: Please remove this file after the new auth feature flag is enabled.
export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	const db = getDB();

	const data = {
		shopifyId: body.shopifyId,
		firstName: body.firstName,
		lastName: body.lastName,
		email: body.email.toLowerCase().trim(),
		password: body.password,
		method: body.method,
		acceptMarketing: true,
		token: '',
		createdAt: new Date().toISOString(),
        id: uuid(),
	}

	if (body.phone) {
		data.phone = body.phone
	}

	const result = await db.collection('Users').insertOne(data);

	return json(result);
};