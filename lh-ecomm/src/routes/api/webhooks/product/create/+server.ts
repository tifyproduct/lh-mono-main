import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { productQuery } from '$lib/graphql.util';
import { convertWebhookProductData } from '$lib/utils/createObjectSchema';

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

    const response = await fetch(`/api/graphql.json`, {
		method: 'POST',
		body: JSON.stringify({
            query: productQuery().schema,
			variables: {
				handle: body.handle,
			}
        })
    });

    if (!response.ok) {
        console.error(`Error fetching product: ${response.statusText}`);
        throw error(response.status, 'Failed to fetch product data.');
    }

    const productRes = await response.json();
    const product = convertWebhookProductData(productRes.data.productByHandle);

    await db.collection('Products').insertOne(product);

    return json({});
};
