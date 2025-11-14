import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	const db = getDB();

	const result = await db.collection('Users').findOne({
        email: body.email.toLowerCase().trim(),
    });

	return json(result);
};
