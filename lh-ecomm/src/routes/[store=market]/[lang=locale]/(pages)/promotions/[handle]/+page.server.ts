import type { PageServerLoad } from './$types';
import {
	metaObjectPromotionQueryByHandle,
	metaObjectCollectionQueryByHandle
} from '$lib/graphql.util';
import { productObjectSchema } from '$lib/utils/createObjectSchema';

function parseToHTML(node) {
	if (!node || !node.type) return '';
	switch (node.type) {
		case 'root':
			return node.children.map(parseToHTML).join('');
		case 'heading':
			const level = node.level || 1;
			return `<h${level}>${node.children.map(parseToHTML).join('')}</h${level}>`;
		case 'list':
			const listTag = node.listType === 'ordered' ? 'ol' : 'ul';
			return `<${listTag}>${node.children.map(parseToHTML).join('')}</${listTag}>`;
		case 'list-item':
			return `<li>${node.children.map(parseToHTML).join('')}</li>`;
		case 'paragraph':
			return `<p>${node.children.map(parseToHTML).join('')}</p>`;
		case 'text':
			return node.bold ? `<b>${node.value}</b>` : node.value;
		default:
			return node.children ? node.children.map(parseToHTML).join('') : '';
	}
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	try {
		const promoQuery = metaObjectPromotionQueryByHandle();
		const requestPromotion = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: promoQuery.schema,
				variables: {
					handle: {
						handle: params.handle,
						type: 'headless_promotions_page'
					}
				}
			})
		});

		const resultPromotion = await requestPromotion.json();
		let promo = null;

		if (resultPromotion?.data?.metaobject) {
			promo = resultPromotion.data.metaobject;

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

			if (promo.freetext && promo.freetext.value) {
				const freetextObject = JSON.parse(promo.freetext.value);
				promo.freetext.htmlContent = parseToHTML(freetextObject);
			}
			if (promo.additionalText && promo.additionalText.value) {
				const additionalTextObject = JSON.parse(promo.additionalText.value);
				promo.additionalText.htmlContent = parseToHTML(additionalTextObject);
			}
		}

		const metaQuery = metaObjectCollectionQueryByHandle();
		const requestMetaSale = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: metaQuery.schema,
				variables: {
					handle: {
						handle: params.handle,
						type: 'headless_promotions_page'
					}
				}
			})
		});

		const resultMetaSale = await requestMetaSale.json();
		const collectionIdData = resultMetaSale?.data?.metaobject?.idData?.value;

		let products = [];
		if (collectionIdData) {
			const collectionId = collectionIdData.split('/').pop();
			const productsQuery = `
				query getCollectionProducts($id: ID!) {
					collection(id: $id) {
						title
						products(first: 100) {
							edges {
								node {
									id
                                    availableForSale
                                    handle
                                    isGiftCard
                                    onlineStoreUrl
                                    title
                                    trackingParameters
                                    vendor
                                    productType
                                    availableForSale
                                    createdAt
                                    description
                                    descriptionHtml
                                    tags
                                    totalInventory
                                    publishedAt
                                    updatedAt
									compareAtPriceRange {
                                        maxVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                        minVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                    }
                                    priceRange {
                                        maxVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                        minVariantPrice {
                                            amount
                                            currencyCode
                                        }
                                    }
									featuredImage {
										altText
                                        id
                                        height
                                        url
                                        width
                                        src
									}
								}
							}
						}
					}
				}
			`;
			const productsRequest = await fetch('/api/graphql.json', {
				method: 'POST',
				body: JSON.stringify({
					query: productsQuery,
					variables: { id: `gid://shopify/Collection/${collectionId}` }
				})
			});
			const productsResult = await productsRequest.json();

			if (productsResult?.data?.collection?.products?.edges) {
				const rawProducts = productsResult.data.collection.products.edges.map((edge) => edge.node);
				products = rawProducts.map((product) =>
					productObjectSchema({
						product,
						store: params.store,
						lang: params.lang,
						wishlists: []
					})
				);
			} else {
				console.warn('No products data found for collection.');
			}
		} else {
			console.warn('Collection ID data not found.');
		}

		return {
			store: params.store,
			lang: params.lang,
			promotionData: promo,
			products: products
		};
	} catch (error) {
		console.error('Error fetching promotion data:', error);
		return { store: params.store, lang: params.lang, promotionData: null, products: [] };
	}
};
