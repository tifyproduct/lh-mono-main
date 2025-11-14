import type { PageServerLoad } from './$types';

import {
	metaObjectQueryByHandle,
} from '$lib/graphql.util';
import { productObjectSchema } from '$lib/utils/createObjectSchema';

export const load: PageServerLoad = async ({ params, fetch }) => {

	let wishlistProducts: string[] = [];

	const wishlistCustomer = await fetch(
		`/api/customer/wishlist`,
		{
			method: 'GET'
		}
	);

	const wishlists = await wishlistCustomer.json();

	wishlistProducts = wishlists.list;

	const metaQuery = metaObjectQueryByHandle();

	// Surabaya Collection
	const requestMetaSale = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'headless-surabaya-deal',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaSale = await requestMetaSale.json();

	const surabayaCollectionId = resultMetaSale.data.metaobject.idData.references.nodes.map(
		(collection, index) => {
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
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	const surabayaCollectionSg = resultMetaSale.data.metaobject.sgData.references.nodes.map(
		(collection, index) => {
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
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	// Pre Order
	const requestMetaPreOrder = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'headless-homepage-concierge',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaPreOrder = await requestMetaPreOrder.json();

	const preOrderId = resultMetaPreOrder.data.metaobject.idData.references.nodes.map(
		(collection, index) => {
			const jsonId = resultMetaPreOrder.data.metaobject.idNames
				? JSON.parse(resultMetaPreOrder.data.metaobject.idNames.value)
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
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	const preOrderSg = resultMetaPreOrder.data.metaobject.sgData.references.nodes.map(
		(collection, index) => {
			const jsonSg = resultMetaPreOrder.data.metaobject.sgNames
				? JSON.parse(resultMetaPreOrder.data.metaobject.sgNames.value)
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
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	// Limited Offer
	const requestMetaPromotion = await fetch('/api/graphql.json', {
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

	const resultMetaPromotion = await requestMetaPromotion.json();

	const limitedOfferId = resultMetaPromotion.data.metaobject.idData.references.nodes.map(
		(collection, index) => {
			const jsonId = resultMetaPromotion.data.metaobject.idNames
				? JSON.parse(resultMetaPromotion.data.metaobject.idNames.value)
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
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	const limitedOfferSg = resultMetaPromotion.data.metaobject.sgData.references.nodes.map(
		(collection, index) => {
			const jsonSg = resultMetaPromotion.data.metaobject.sgNames
				? JSON.parse(resultMetaPromotion.data.metaobject.sgNames.value)
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
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	// WATCHES TABS
	const requestMetaWatches = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'headless-surabaya-watches',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaWatches = await requestMetaWatches.json();

	const watchesId = resultMetaWatches.data.metaobject.idData.references.nodes.map(
		(collection, index) => {
			const jsonId = resultMetaWatches.data.metaobject.idNames
				? JSON.parse(resultMetaWatches.data.metaobject.idNames.value)
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
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	const watchesSg = resultMetaWatches.data.metaobject.sgData.references.nodes.map(
		(collection, index) => {
			const jsonSg = resultMetaWatches.data.metaobject.sgNames
				? JSON.parse(resultMetaWatches.data.metaobject.sgNames.value)
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
						lang: params.lang,
						wishlists: wishlistProducts
					})
				)
			};
		}
	);

	const googleReview = await fetch('/api/google/review');

	return {
		store: params.store,
		lang: params.lang,
		surabayaCollection: params.store === 'id' ? surabayaCollectionId : surabayaCollectionSg,
		limitedOffer: params.store === 'id' ? limitedOfferId : limitedOfferSg,
		preOrder: params.store === 'id' ? preOrderId : preOrderSg,
		watches: params.store === 'id' ? watchesId : watchesSg,
		googleReview: await googleReview.json()
	};
};
