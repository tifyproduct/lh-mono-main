import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();

	const db = getDB();

	const result = await db.collection('StockReminder').insertOne({
		createdAt: new Date().toISOString(),
		name: body.payload.name,
		phone: body.payload.phone,
		productId: body.payload.productId
	});

	return json(result);
};
