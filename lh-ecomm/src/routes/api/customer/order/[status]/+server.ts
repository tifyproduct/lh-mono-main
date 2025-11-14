import { error, json, type RequestHandler } from '@sveltejs/kit';
import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION, SHOPIFY_PRIVATE_ACCESS_TOKEN } from '$env/static/private';
import { findOrderPaymentsByIds } from '$lib/server/collections/orderPayment';
import { type OrderPayment } from '$lib/types/order';
import { customerOrderHistory } from '$lib/graphql.util';
import { filterOrdersByStatusSchema } from '$lib/utils/createObjectSchema';
import { isOrderHistoryStatus, OrderHistoryStatus } from '$lib/enum.utils';
import { checkAndGenerateCustomerShopifyData } from '$lib/server/services/shopify';



export const GET: RequestHandler = async ({ fetch, locals, url, cookies, params }) => {
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


    const { status } = params;
    if (!isOrderHistoryStatus(status)) {
        error(422, {
            message: 'Invalid status'
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
        const filteredData = filterOrdersByStatusSchema(orders, page, perPage, status as OrderHistoryStatus)

        let orderPaymentMap: Record<string, OrderPayment> = {};
        if (filteredData.orderIDs.length > 0) {
            try {
                const orderPayments = await findOrderPaymentsByIds(filteredData.orderIDs)

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
        }

        filteredData.data.forEach(orderData => {
            const orderID = orderData.adminAPIID;
            const paymentDueAt = orderPaymentMap[orderID]?.order?.paymentTerms?.paymentSchedules?.nodes[0]?.dueAt || ''
            orderData.paymentDetails = {
                ...orderData.paymentDetails,
                paymentDueDate: paymentDueAt instanceof Date ? paymentDueAt.toISOString() : paymentDueAt || ''
            };
        });

        return json(
            {
                data: filteredData.data,
                pagination: filteredData.pagination
            }
        )
  
    } catch (err) {
        console.error("Error fetching order history:", err)
        return error(500, {
            message: 'Internal server error.'
        });
    }
}