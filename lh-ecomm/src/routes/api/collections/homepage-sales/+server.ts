import { json, type RequestHandler } from '@sveltejs/kit';
import { metaObjectQueryByHandle } from '$lib/graphql.util';
import { productObjectSchema } from '$lib/utils/createObjectSchema';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const store = url.searchParams.get('store') || 'id';
	const lang = url.searchParams.get('lang') || 'en';
	const customerId = url.searchParams.get('customerId') || '';

	try {
		const wishlistCustomer = await fetch(`/api/customer/wishlist?customerId=${customerId}`, {
			method: 'GET'
		});

		const wishlists = await wishlistCustomer.json();

		const requestMetaSale = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: metaObjectQueryByHandle().schema,
				variables: {
					handle: {
						handle: 'headless-homepage-sales',
						type: 'headless_homepage'
					}
				}
			}),
			headers: {
				'cache-control': 'max-age=3600'
			},
			cache: 'force-cache'
		});

		const resultMetaSale = await requestMetaSale.json();

		const saleId = resultMetaSale.data.metaobject.idData.references.nodes.map(
			(collection: any, index: number) => {
				const jsonId = resultMetaSale.data.metaobject.idNames
					? JSON.parse(resultMetaSale.data.metaobject.idNames.value)
					: [];

				const urlCollection =
					collection?.category?.value === 'brand'
						? `${collection?.parentMenu?.value}/${collection.handle}`
						: `${collection?.parentMenu?.value}/${collection.handle}`;

				return {
					title: jsonId[index] ? jsonId[index] : collection.title,
					handle: `${urlCollection}`.toLowerCase(),
					expiredSale: collection.saleDate,
					products: collection.products.edges.map((product: any) =>
						productObjectSchema({
							product: product.node,
							store: store,
							lang: lang,
							wishlists: wishlists.list
						})
					)
				};
			}
		);

		const saleSg = resultMetaSale.data.metaobject.sgData.references.nodes.map(
			(collection: any, index: number) => {
				const jsonSg = resultMetaSale.data.metaobject.sgNames
					? JSON.parse(resultMetaSale.data.metaobject.sgNames.value)
					: [];

				const urlCollection =
					collection?.category?.value === 'brand'
						? `${collection?.parentMenu?.value}/${collection.handle}`
						: `${collection?.parentMenu?.value}/${collection.handle}`;

				return {
					title: jsonSg[index] ? jsonSg[index] : collection.title,
					handle: `${urlCollection}`.toLowerCase(),
					expiredSale: collection.saleDate,
					products: collection.products.edges.map((product: any) =>
						productObjectSchema({
							product: product.node,
							store: store,
							lang: lang,
							wishlists: wishlists.list
						})
					)
				};
			}
		);

		return json({ list: store === 'id' ? saleId : saleSg });
	} catch (error) {
		return json({ error: 'Internal server error.' }, { status: 500 });
	}
};
