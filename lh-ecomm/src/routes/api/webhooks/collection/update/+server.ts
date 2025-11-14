import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { webhookCollectionQueryByHandle } from '$lib/graphql.util';

export const POST: RequestHandler = async ({ request, fetch }) => {
    const db = getDB();

    if (!request.body) {
        return json({});
    }

    const body = await request.json();

    console.log('collection updated webhooks received', JSON.stringify(body, null, 2));

    if (!body.admin_graphql_api_id) {
        return json({});
    }

    const response = await fetch(`/api/graphql.json`, {
        method: 'POST',
        body: JSON.stringify({
            query: webhookCollectionQueryByHandle().schema,
            variables: {
                handle: body.handle,
            }
        })
    });

    if (!response.ok) {
        console.error(`Error fetching product: ${response.statusText}`);
        throw error(response.status, 'Failed to fetch product data.');
    }

    const collection = await response.json();

    const exist = await db.collection('Collections').findOne({
        handle: body.handle,
    });

    if (exist) {
        await db.collection('Collections').updateOne(
            {
                handle: body.handle,
            },
            {
                $set: {
                    ...collection.data.collection,
                    rules: body?.rules
                }
            }
        );
    } else {
        await db.collection('Collections').insertOne({
            ...collection.data.collection,
            rules: body?.rules
        });
    }

    return json({});
};
