import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

interface RequestBody {
	promotionId?: string;
	code?: string;
}

const promotionCollections = 'Promotions';

export const GET: RequestHandler = async ({ fetch }) => {
	const db = getDB();

	const request = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: `query MyQuery($type: String!, $key: String!, $handle: String!) {
								metaobject(handle: {type: $type, handle: $handle}) {
									field(key: $key) {
										key
										type
										value
									}
								}
							}`,
			variables: {
				type: 'headless_promotions',
				key: 'voucher_codes',
				handle: 'headless-promotions-vouchers'
			}
		})
	});

	const result = await request.json();
	const selectedCodes = result.data.metaobject.field.value;
	const promotions = await db
		.collection(promotionCollections)
		.find({
			$and: [
				{
					$or: [
						{
							status: 'ACTIVE'
						},
						{
							status: 'SCHEDULED',
							startsAt: {
								$lte: new Date()
							}
						}
					]
				},
				{
					$or: [{ endsAt: { $eq: null } }, { endsAt: { $gte: new Date() } }]
				},
				{
					code: {
						$in: JSON.parse(selectedCodes)
					}
				}
			]
		})
		.project({ _id: 0 })
		.toArray();

	return json({
		promotions
	});
};
