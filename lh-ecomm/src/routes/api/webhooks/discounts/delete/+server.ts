import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const body = await request.json();

	console.log('webhooks received', JSON.stringify(body, null, 2));
	const discountID = body.admin_graphql_api_id;

	const db = getDB();

	const result = await db.collection('PromotionsBuyXGetY').deleteOne({
		discountID
	});

	return json({ result });
};
