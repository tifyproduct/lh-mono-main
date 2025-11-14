import { json, type RequestHandler } from '@sveltejs/kit';
import { collectionQueryByHandle } from '$lib/graphql.util';
import { productObjectSchema } from '$lib/utils/createObjectSchema';
import { decodeFilterParams } from '$lib/utils/modifyUrlString';

export const GET: RequestHandler = async ({ fetch, url, locals }) => {
	const store = url.searchParams.get('store') || 'id';
	const lang = url.searchParams.get('lang') || 'en';
	const variableParams = url.searchParams.get('variables') || '';

	const decodedVariables = variableParams ? decodeFilterParams(variableParams) : '';
	const variables = JSON.parse(decodedVariables);

	try {
		let wishlistProducts: string[] = [];

		if (locals?.userId) {
			const wishlistCustomer = await fetch(`/api/customer/wishlist`, {
				method: 'GET'
			});

			const wishlists = await wishlistCustomer.json();

			wishlistProducts = wishlists.list;
		}

		const request = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: collectionQueryByHandle().schema,
				variables
			})
		});

		const result = await request.json();

		const { collection } = result.data;

		const products = collection?.products?.edges?.map((product) =>
			productObjectSchema({
				product: product.node,
				store: store,
				lang: lang,
				wishlists: wishlistProducts
			})
		);

		return json(
			{
				products
			},
			{
				headers: {
					'Cache-Control': 'public, max-age=3600'
				}
			}
		);
	} catch (err) {
		console.error(err);
		return json({ error: 'Internal server error.' }, { status: 500 });
	}
};
