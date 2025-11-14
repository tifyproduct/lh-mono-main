import type { PageServerLoad } from './$types';
import { metaObjectPromotionQueryByHandle, metaObjectPromotionQueryAll } from '$lib/graphql.util';

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const allPromosQuery = metaObjectPromotionQueryAll();
		const requestAllPromotions = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({ query: allPromosQuery.schema })
		});
		const resultAllPromotions = await requestAllPromotions.json();

		if (!resultAllPromotions?.data?.metaobjects?.edges) {
			return { store: params.store, lang: params.lang, promotionDataID: [], promotionDataSG: [] };
		}

		const handles = resultAllPromotions.data.metaobjects.edges.map((edge) => edge.node.handle);

		const promotionDataID = [];
		const promotionDataSG = [];

		for (const handle of handles) {
			const promoQuery = metaObjectPromotionQueryByHandle();
			const requestPromotion = await fetch('/api/graphql.json', {
				method: 'POST',
				body: JSON.stringify({
					query: promoQuery.schema,
					variables: {
						handle: {
							handle,
							type: 'headless_promotions_page'
						}
					}
				})
			});
			const resultPromotion = await requestPromotion.json();

			if (resultPromotion?.data?.metaobject) {
				const promo = resultPromotion.data.metaobject;

				const imageRequest = await fetch('/api/graphql.json', {
					method: 'POST',
					body: JSON.stringify({
						query: `
							query getImage($id: ID!) {
								node(id: $id) {
									... on MediaImage {
										image {
											url
										}
									}
								}
							}
						`,
						variables: { id: promo.image.value }
					})
				});
				const imageResult = await imageRequest.json();
				if (imageResult?.data?.node?.image?.url) {
					promo.image.url = imageResult.data.node.image.url;
				}

				if (handle.includes('-id')) {
					promotionDataID.push(promo);
				} else if (handle.includes('-sg')) {
					promotionDataSG.push(promo);
				}
			}
		}

		return {
			store: params.store,
			lang: params.lang,
			promotionDataID,
			promotionDataSG
		};
	} catch (error) {
		console.error('Error fetching promotion data:', error);
		return { store: params.store, lang: params.lang, promotionDataID: [], promotionDataSG: [] };
	}
};
