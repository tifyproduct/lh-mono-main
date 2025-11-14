import type { PageServerLoad } from './$types';

import { metaObjectQueryByHandle } from '$lib/graphql.util';
import { productObjectSchema } from '$lib/utils/createObjectSchema';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const metaQuery = metaObjectQueryByHandle();
	// SALE TABS
	const requestMetaSale = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'collection-connoisseur',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaSale = await requestMetaSale.json();

	let wishlistProducts: string[] = [];

	const wishlistCustomer = await fetch(`/api/customer/wishlist`, {
		method: 'GET'
	});

	const wishlists = await wishlistCustomer.json();

	wishlistProducts = wishlists.list;

	const saleId = resultMetaSale.data.metaobject.idData.references.nodes.map((collection, index) => {
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
			products: collection.products.edges.map((product) =>
				productObjectSchema({
					product: product.node,
					store: params.store,
					lang: params.lang,
					wishlists: wishlistProducts
				})
			)
		};
	});

	const saleSg = resultMetaSale.data.metaobject.sgData.references.nodes.map((collection, index) => {
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
			products: collection.products.edges.map((product) =>
				productObjectSchema({
					product: product.node,
					store: params.store,
					lang: params.lang,
					wishlists: wishlistProducts
				})
			)
		};
	});

	// Connoisseur
	const requestMetaTopPicks = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'collection-connoisseur',
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

	// Muse
	const requestMetaMuse = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'collection-muse',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaMuse = await requestMetaMuse.json();

	const museId = resultMetaMuse.data.metaobject.idData.references.nodes.map((collection, index) => {
		const jsonId = resultMetaMuse.data.metaobject.idNames
			? JSON.parse(resultMetaMuse.data.metaobject.idNames.value)
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
	});

	const museSg = resultMetaMuse.data.metaobject.sgData.references.nodes.map((collection, index) => {
		const jsonSg = resultMetaMuse.data.metaobject.sgNames
			? JSON.parse(resultMetaMuse.data.metaobject.sgNames.value)
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
	});

	// Achiever
	const requestMetaAchiever = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'collection-achiever',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaAchiever = await requestMetaAchiever.json();

	const achieverId = resultMetaAchiever.data.metaobject.idData.references.nodes.map(
		(collection, index) => {
			const jsonId = resultMetaAchiever.data.metaobject.idNames
				? JSON.parse(resultMetaAchiever.data.metaobject.idNames.value)
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

	const achieverSg = resultMetaAchiever.data.metaobject.sgData.references.nodes.map(
		(collection, index) => {
			const jsonSg = resultMetaAchiever.data.metaobject.sgNames
				? JSON.parse(resultMetaAchiever.data.metaobject.sgNames.value)
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

	// Trend
	const requestMetaTrend = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'collection-trendsetter',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaTrend = await requestMetaTrend.json();

	const trendId = resultMetaTrend.data.metaobject.idData.references.nodes.map(
		(collection, index) => {
			const jsonId = resultMetaTrend.data.metaobject.idNames
				? JSON.parse(resultMetaTrend.data.metaobject.idNames.value)
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

	const trendSg = resultMetaTrend.data.metaobject.sgData.references.nodes.map(
		(collection, index) => {
			const jsonSg = resultMetaTrend.data.metaobject.sgNames
				? JSON.parse(resultMetaTrend.data.metaobject.sgNames.value)
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

	// Rising
	const requestMetaRising = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'collection-rising-star',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaRising = await requestMetaRising.json();

	const risingId = resultMetaRising.data.metaobject.idData.references.nodes.map(
		(collection, index) => {
			const jsonId = resultMetaRising.data.metaobject.idNames
				? JSON.parse(resultMetaRising.data.metaobject.idNames.value)
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

	const risingSg = resultMetaRising.data.metaobject.sgData.references.nodes.map(
		(collection, index) => {
			const jsonSg = resultMetaRising.data.metaobject.sgNames
				? JSON.parse(resultMetaRising.data.metaobject.sgNames.value)
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

	// Anniv
	const requestMetaAnniv = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'celebrate-new-beginnings',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaAnniv = await requestMetaAnniv.json();

	const annivId = resultMetaAnniv.data.metaobject.idData.references.nodes.map(
		(collection, index) => {
			const jsonId = resultMetaAnniv.data.metaobject.idNames
				? JSON.parse(resultMetaAnniv.data.metaobject.idNames.value)
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

	const annivSg = resultMetaAnniv.data.metaobject.sgData.references.nodes.map(
		(collection, index) => {
			const jsonSg = resultMetaAnniv.data.metaobject.sgNames
				? JSON.parse(resultMetaAnniv.data.metaobject.sgNames.value)
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

	// Acc
	const requestMetaAcc = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'collection-accessories',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaAcc = await requestMetaAcc.json();

	const accId = resultMetaAcc.data.metaobject.idData.references.nodes.map((collection, index) => {
		const jsonId = resultMetaAcc.data.metaobject.idNames
			? JSON.parse(resultMetaAcc.data.metaobject.idNames.value)
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
	});

	const accSg = resultMetaAcc.data.metaobject.sgData.references.nodes.map((collection, index) => {
		const jsonSg = resultMetaAcc.data.metaobject.sgNames
			? JSON.parse(resultMetaAcc.data.metaobject.sgNames.value)
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
	});

	// Gift
	const requestMetaGift = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: {
					handle: 'delugs',
					type: 'headless_homepage'
				}
			}
		})
	});

	const resultMetaGift = await requestMetaGift.json();

	const giftId = resultMetaGift.data.metaobject.idData.references.nodes.map((collection, index) => {
		const jsonId = resultMetaGift.data.metaobject.idNames
			? JSON.parse(resultMetaGift.data.metaobject.idNames.value)
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
	});

	const giftSg = resultMetaGift.data.metaobject.sgData.references.nodes.map((collection, index) => {
		const jsonSg = resultMetaGift.data.metaobject.sgNames
			? JSON.parse(resultMetaGift.data.metaobject.sgNames.value)
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
	});

	return {
		store: params.store,
		lang: params.lang,
		happeningNow: params.store === 'id' ? saleId : saleSg,
		topPicks: params.store === 'id' ? topPicksId : topPicksSg,
		muse: params.store === 'id' ? museId : museSg,
		achiever: params.store === 'id' ? achieverId : achieverSg,
		trend: params.store === 'id' ? trendId : trendSg,
		rising: params.store === 'id' ? risingId : risingSg,
		anniv: params.store === 'id' ? annivId : annivSg,
		acc: params.store === 'id' ? accId : accSg,
		gift: params.store === 'id' ? giftId : giftSg
	};
};
