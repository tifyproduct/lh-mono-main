import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION, SHOPIFY_PRIVATE_ACCESS_TOKEN } from '$env/static/private';
import { customerOrderHistory } from '$lib/graphql.util';
import { groupOrdersByStatusSchema } from '$lib/utils/createObjectSchema';
import { findOrderPaymentsByIds } from '$lib/server/collections/orderPayment';
import { type OrderPayment } from '$lib/types/order';
import { parseStorefrontOrderIDtoAdminOrderID } from '$lib/utils/shopifyDataConverter';
import { checkAndGenerateCustomerShopifyData } from '$lib/server/services/shopify';


export const GET: RequestHandler = async ({ fetch, locals, cookies, url }) => {
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

	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const perPage = parseInt(url.searchParams.get('perPage') || '10', 10);

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
		const orderIDs: string[] = orders.map((order: any) => parseStorefrontOrderIDtoAdminOrderID(order.id));
		let orderPaymentMap: Record<string, OrderPayment> = {};

		try {
			const orderPayments = await findOrderPaymentsByIds(orderIDs)

			orderPaymentMap = orderPayments.reduce((acc, payment) => {
				acc[payment.orderId] = payment;
				return acc;
			}, {} as Record<string, OrderPayment>);
		} catch (err) {
			console.error("Error fetching order payments:", err)
			return error(500, {
				message: 'Internal server error.'
			});
		}

		const groupedOrders = groupOrdersByStatusSchema(orders, page, perPage, orderPaymentMap);

		return json(groupedOrders);
	} catch (err) {
		console.error(err);
		return error(500, {
			message: 'Internal server error.'
		});	}
};
