import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, fetch }) => {
	const body = await request.json();

	console.log('order created webhooks received', JSON.stringify(body, null, 2));

	const orderId = body.admin_graphql_api_id;

	const response = await fetch(`/api/admin/graphql.json`, {
		method: 'POST',
		body: JSON.stringify({
			query: `query GetOrderPaymentDue($orderId: ID!) {
								order(id: $orderId) {
									id
									name
									paymentTerms {
										dueInDays
										overdue
										paymentSchedules(first: 1) {
											nodes {
												dueAt
												issuedAt
											}
										}
									}
								}
							}`,
			variables: {
				orderId
			}
		})
	});

	const orderPaymentResponse = await response.json();

	console.log('orderPaymentResponse:', JSON.stringify(orderPaymentResponse, null, 2));

	const orderPayment = orderPaymentResponse.data.order;
	const db = getDB();

	const result = await db.collection('OrderPayments').updateOne(
		{
			orderId
		},
		{
			$set: {
				orderId,
				order: orderPayment
			}
		},
		{
			upsert: true
		}
	);

	console.log({ result });

	return json(result);
};
