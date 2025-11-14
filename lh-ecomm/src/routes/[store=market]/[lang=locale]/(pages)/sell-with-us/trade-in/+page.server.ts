import type { PageServerLoad } from './$types';

import { metaObjectQueryByHandle } from '$lib/graphql.util';
import { productObjectSchema } from '$lib/utils/createObjectSchema';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const metaQuery = metaObjectQueryByHandle();

	let wishlistProducts: string[] = [];

	const wishlistCustomer = await fetch(
		`/api/customer/wishlist`,
		{
			method: 'GET'
		}
	);

	const wishlists = await wishlistCustomer.json();

	wishlistProducts = wishlists.list;

	// TopPicks TABS
	const requestMetaTopPicks = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'headless-high-demand',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaTopPicks = await requestMetaTopPicks.json();

	const topPicksId = resultMetaTopPicks.data.metaobject.idData.references.nodes.map(
		(collection, index) => {
			const jsonId = resultMetaTopPicks.data.metaobject.idNames
				? JSON.parse(resultMetaTopPicks.data.metaobject.idNames.value)
				: [];

			const urlCollection =
				collection?.category?.value === 'brand'
					? `${collection?.parentMenu?.value}/${collection.handle}`
					: `${collection?.parentMenu?.value}/${collection.handle}`;

			return {
				title: jsonId[index] ? jsonId[index] : collection.title,
				handle: `${urlCollection}`.toLowerCase(),
				expiredSale: collection.saleDate,
				products: collection.products.edges.map((product) =>
					productObjectSchema({
						product: product.node,
						store: params.store,
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	const topPicksSg = resultMetaTopPicks.data.metaobject.sgData.references.nodes.map(
		(collection, index) => {
			const jsonSg = resultMetaTopPicks.data.metaobject.sgNames
				? JSON.parse(resultMetaTopPicks.data.metaobject.sgNames.value)
				: [];

			const urlCollection =
				collection?.category?.value === 'brand'
					? `${collection?.parentMenu?.value}/${collection.handle}`
					: `${collection?.parentMenu?.value}/${collection.handle}`;

			return {
				title: jsonSg[index] ? jsonSg[index] : collection.title,
				handle: `${urlCollection}`.toLowerCase(),
				expiredSale: collection.saleDate,
				products: collection.products.edges.map((product) =>
					productObjectSchema({
						product: product.node,
						store: params.store,
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	return {
		store: params.store,
		lang: params.lang,
		topPicks: params.store === 'id' ? topPicksId : topPicksSg,
		seo: {
			title: 'Sell With Us'
		}
	};
};
