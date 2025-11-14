import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION, SHOPIFY_PRIVATE_ACCESS_TOKEN } from '$env/static/private';
import { customerOrderHistory } from '$lib/graphql.util';
import { orderHistoryStatusCounts } from '$lib/utils/createObjectSchema';
import { checkAndGenerateCustomerShopifyData } from '$lib/server/services/shopify';


export const GET: RequestHandler = async ({ fetch, locals, cookies }) => {
    const userId = locals.userId
	if (!userId) {
        error(401, {
            message: 'Authorization token required.'
        });
	}
	let token: string
    const userShopifyToken = locals.userShopifyToken
	const userShopifyId = locals.userShopifyId
	try {
		const customerShopifyData = await checkAndGenerateCustomerShopifyData(
			cookies,
			userId,
			userShopifyId,
			userShopifyToken
		)
		token = customerShopifyData.token || ""
		if (!token) {
            error(401, {
                message: 'Authorization token required.'
            });
		}
	} catch(e) {
        error(500, {
            message: (e as Error).message,
        });
	}

    const client = createStorefrontApiClient({
        storeDomain: SHOPIFY_STORE_DOMAIN,
        apiVersion: SHOPIFY_API_VERSION,
        privateAccessToken: SHOPIFY_PRIVATE_ACCESS_TOKEN,
        customFetchApi: fetch
    });


    const variable = {token};
	try {
		const result = await client.fetch(
			customerOrderHistory().schema,
			{ variables: variable }
		);
	
		const response = await result.json();
        const orders = response.data.customer.orders.nodes;

		return json({data: orderHistoryStatusCounts(orders)});
	} catch (err) {
		console.error(err);
		return error(500, {
			message: 'Internal server error.'
		});	}
};