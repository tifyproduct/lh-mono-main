import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { productQuery } from '$lib/graphql.util';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const db = getDB();

    if (!request.body) {
		return json({});
	}

	const body = await request.json();

	console.log('product created webhooks received', JSON.stringify(body, null, 2));

    if (!body.admin_graphql_api_id) {
		return json({});
	}

    if(body.status === 'draft'){
        return json({});
    }

    console.log(body)

    return json({});
};
