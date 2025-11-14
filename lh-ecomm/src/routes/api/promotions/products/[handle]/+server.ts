import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { getGlobalPromotions } from '$lib';

const promotionCollections = 'Promotions';

export const GET: RequestHandler = async ({ fetch, params }) => {
	const db = getDB();
	const handle = params.handle;

	const request = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: `query ProductMetafieldQuery($handle: String!) {
								product(handle: $handle) {
									metafield(key: "promotion_codes", namespace: "product") {
										key
										value
									}
								}
							}`,
			variables: {
				handle
			}
		})
	});

	const result = await request.json();

	if (!result.data.product) {
		return json([]);
	}

	const selectedCodes = result.data.product?.metafield?.value || '[]';
	let promotions = await db
		.collection(promotionCollections)
		.find({
			$and: [
				{
					status: 'ACTIVE'
				},
				{
					$or: [
						{
							code: {
								$in: JSON.parse(selectedCodes)
							}
						}
					]
				}
			]
		})
		.project({ _id: 0 })
		.toArray();

	const globalPromotions = await getGlobalPromotions(fetch);

	if (globalPromotions.promotions) {
		promotions.push(
			...globalPromotions.promotions.filter((p) => {
				return !promotions.some((promotion) => promotion.id === p.id);
			})
		);
	}

	return json({
		promotions
	});
};
