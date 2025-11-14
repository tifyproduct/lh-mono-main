import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, fetch }) => {
    const db = getDB();

    if (!request.body) {
        return json({});
    }

    const body = await request.json();

    console.log('product deleted webhooks received', JSON.stringify(body, null, 2));

    if (!body.admin_graphql_api_id) {
        return json({});
    }

    await db.collection('Products').findOneAndDelete({
        shopifyId: body.admin_graphql_api_id,
    });

    return json({});
};
