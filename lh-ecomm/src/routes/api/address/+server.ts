import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	if (!request.body) {
		error(400, {
			message: 'Payload required.'
		});
	}

    const body = await request.json();

	const db = getDB();

	const result = await db.collection('Regions').insertOne({
		createdAt: new Date().toISOString(),
        idLabel: body.idLabel,
        enLabel: body.enLabel,
		value: body.value,
        provinces: body.province,
	});

	return json(result);
};


export const GET: RequestHandler = async () => {
	const db = getDB();

	const result = await db.collection('Regions').find().toArray();;

	return json(result);
};