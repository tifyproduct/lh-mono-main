import type { PageServerLoad } from './$types';
import { metaObjectQueryByHandle } from '$lib/graphql.util';
import { productObjectSchema } from '$lib/utils/createObjectSchema';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const metaQuery = metaObjectQueryByHandle();
	const requestMetaSale = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'headless-related-perfect-companions',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaSale = await requestMetaSale.json();

	const saleId = resultMetaSale.data.metaobject.idData.references.nodes.map((collection, index) => {
		const jsonId = resultMetaSale.data.metaobject.idNames
			? JSON.parse(resultMetaSale.data.metaobject.idNames.value)
			: [];

		const urlCollection = `${collection?.parentMenu?.value}/${collection.handle}`;

		return {
			title: jsonId[index] ? jsonId[index] : collection.title,
			handle: `${urlCollection}`.toLowerCase(),
			expiredSale: collection.saleDate,
			products: collection.products.edges.map((product) =>
				productObjectSchema({
					product: product.node,
					store: params.store,
					lang: params.lang
				})
			)
		};
	});

	const saleSg = resultMetaSale.data.metaobject.sgData.references.nodes.map((collection, index) => {
		const jsonSg = resultMetaSale.data.metaobject.sgNames
			? JSON.parse(resultMetaSale.data.metaobject.sgNames.value)
			: [];

		const urlCollection = `${collection?.parentMenu?.value}/${collection.handle}`;

		return {
			title: jsonSg[index] ? jsonSg[index] : collection.title,
			handle: `${urlCollection}`.toLowerCase(),
			expiredSale: collection.saleDate,
			products: collection.products.edges.map((product) =>
				productObjectSchema({
					product: product.node,
					store: params.store,
					lang: params.lang
				})
			)
		};
	});

	return {
		store: params.store,
		lang: params.lang,
		happeningNow: params.store === 'id' ? saleId : saleSg
	};
};
