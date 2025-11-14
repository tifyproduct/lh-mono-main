import type { PageServerLoad } from './$types';
import {
	productQuery,
	productQuerySpecificField,
	productRecommendationQuery
} from '$lib/graphql.util';
import { EXCLUDED_TAGS, RECENTLY_VIEWED_COOKIES_NAME } from '$lib/constants.util';
import { env } from '$env/dynamic/private';
import type { ProductData } from '$lib/types/product';
import {
	productObjectSchema,
	breadcrumbObjectSchema,
	productVariantData
} from '$lib/utils/createObjectSchema';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import { formDataToJson } from '$lib/server/api';
import getCustomerId from '$lib/utils/getCustomerIdShopify';
import { typeValidator } from '$lib/utils/productValidator';

export const load: PageServerLoad = async ({ url, params, fetch, cookies, locals }) => {
	const metaQuery = productQuery();
	const recommendationQuery = productRecommendationQuery();
	const isProduction: boolean = env.VITE_APP_ENV === 'production';

	let wishlistProducts: string[] = [];

	if (locals?.userId) {
		const wishlistCustomer = await fetch(`/api/customer/wishlist`, {
			method: 'GET'
		});

		const wishlists = await wishlistCustomer.json();

		wishlistProducts = wishlists.list;
	}

	const store: string = params.store === 'id' ? 'Indonesia' : 'Singapore';
	const productFilters = [{ tag: store }];
	if (isProduction) {
		productFilters.push({ tag: 'Live' });
	}

	const requestProduct = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				handle: params.handle,
				filters: productFilters
			}
		})
	});

	const productRes = await requestProduct.json();

	// Redirect to home if product not found
	if (!productRes.data?.productByHandle) {
		throw redirect(307, '/');
	}

	// Redirect to 404 if product type is not match
	const productType = typeValidator({
		tags: productRes.data?.productByHandle?.tags,
		productType: productRes.data?.productByHandle?.productType
	}).toLowerCase();

	if (productType !== params.type) {
		throw redirect(307, `/${params.store}/${params.lang}/404`);
	}

	const googleReview = await fetch('/api/google/review');

	const recentlyViewed = JSON.parse(cookies.get(RECENTLY_VIEWED_COOKIES_NAME) || '[]');

	if (!recentlyViewed.find((rv) => rv?.id === productRes?.data?.productByHandle?.id)) {
		recentlyViewed.unshift({
			id: productRes?.data?.productByHandle?.id,
			type: params.type,
			vendor: productRes?.data?.productByHandle?.vendor
		});
	}

	const recommendations: Array<ProductData> = [];
	const pushRecommendation = (product) => {
		recommendations.push(
			productObjectSchema({
				product: product,
				store: params.store,
				lang: params.lang,
				wishlists: wishlistProducts
			})
		);
	};

	// PRODUCT FROM BRAND
	const brandProductsQuery = productQuerySpecificField(productRes.data.productByHandle.vendor);
	let productsFromSpecificBrandQuery: string = brandProductsQuery.query;
	if (isProduction) {
		productsFromSpecificBrandQuery += ` AND tag:Live`;
	}
	const requestBrandProducts = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: brandProductsQuery.schema,
			variables: {
				size: 10,
				query: productsFromSpecificBrandQuery
			}
		})
	});

	const productBrandsRes = await requestBrandProducts.json();

	const productsBrand: Array<ProductData> = [];

	productBrandsRes.data.products.edges.forEach((product: any) => {
		if (product.node.tags.includes(store)) {
			productsBrand.push(
				productObjectSchema({
					product: product.node,
					store: params.store,
					lang: params.lang,
					wishlists: wishlistProducts
				})
			);
		}
	});
	// END PRODUCT FROM BRAND

	// PRODUCT RECOMMENDATION SECTION
	if (productRes.data.productByHandle.recommendationProducts) {
		productRes.data.productByHandle.recommendationProducts.references.nodes.forEach(
			(product: any) => {
				const isStoreIncluded = product?.node?.tags.includes(store);
				const isExcludedTag = isProduction
					? product.node.tags.some((tag: string) => EXCLUDED_TAGS.includes(tag))
					: false;

				if (isStoreIncluded && !isExcludedTag) {
					pushRecommendation(product);
				}
			}
		);
	}

	const productColRecom: Array<ProductData> = [];

	if (productRes.data.productByHandle.recommendationProductsCollection) {
		productRes.data.productByHandle.recommendationProductsCollection.references.nodes.forEach(
			(data: any) => {
				data.products.edges.forEach((product: any) => {
					if (product.node.tags.includes(store)) {
						const productData = productObjectSchema({
							product: product.node,
							store: params.store,
							lang: params.lang,
							wishlists: wishlistProducts
						});

						productColRecom.push(productData);
					}
				});
			}
		);
	}

	const requestProductRecom = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: recommendationQuery.schema,
			variables: {
				handle: params.handle
			}
		})
	});

	const productRecRes = await requestProductRecom.json();

	const productRecom: Array<ProductData> = [];

	const pushProductRecom = (product) => {
		productRecom.push(
			productObjectSchema({
				product: product,
				store: params.store,
				lang: params.lang,
				wishlists: wishlistProducts
			})
		);
	};

	productRecRes.data.productRecommendations.forEach((product) => {
		const isStoreIncluded = product.tags.includes(store);
		const isExcludedTag = isProduction
			? product.tags.some((tag: string) => EXCLUDED_TAGS.includes(tag))
			: false;

		if (isStoreIncluded && !isExcludedTag) {
			pushProductRecom(product);
		}
	});

	const allProductRecommendation = [...recommendations, ...productColRecom, ...productRecom];

	// END PRODUCT RECOMMENDATION SECTION

	// PROMOTIONS
	const promotions = await fetch(`/api/promotions/products/${params?.handle}`);
	// END PROMOTIONS

	const productDetail: ProductData = productObjectSchema({
		product: productRes.data.productByHandle,
		store: params.store,
		lang: params.lang,
		wishlists: wishlistProducts
	});

	const productDetails: Array<any> = productVariantData({
		variants: productRes.data.productByHandle.variants.nodes,
		product: productRes.data.productByHandle
	});

	let productReviews = [];
	try {
		const productReviewsRequest = await fetch(
			`/api/review/products/${getCustomerId(productDetail.id)}` // TODO: could rename or use new func
		);
		if (!productReviewsRequest.ok) {
			throw new Error(`HTTP error! status: ${productReviewsRequest.status}`);
		}
		productReviews = await productReviewsRequest.json();
	} catch (e) {
		console.error('Failed to fetch product reviews:', e);
	}

	// SET WISHLIST
	await fetch('/api/recently-viewed', {
		method: 'PUT',
		body: JSON.stringify({
			productID: productDetail?.id ?? '',
			store: params.store
		})
	});

	// Redirects
	const currentPath = url.pathname;
	const endsWithId = currentPath.endsWith('-id');
	const idProduct = !currentPath.endsWith('-sg');
	const endsWithSg = currentPath.endsWith('-sg');

	if (params.store === 'sg' && endsWithId) {
		const newPath = currentPath.replace(/-id$/, '-sg');
		throw redirect(307, newPath);
	}

	if (params.store === 'sg' && idProduct) {
		throw redirect(307, `${currentPath}-sg`);
	}

	if (params.store === 'id' && endsWithSg) {
		const newPath = currentPath.replace(/-sg$/, '-id');
		throw redirect(307, newPath);
	}

	return {
		productReviews: productReviews,
		type: params.type,
		productHandle: params.handle,
		productDetail,
		productDetails,
		productBrand: {
			handle:
				`${params.type}/${productRes.data.productByHandle.vendor.replace(/ /g, '-')}`.toLowerCase(),
			products: productsBrand
		},
		breadcrumbs: breadcrumbObjectSchema({
			data: productRes.data.productByHandle,
			isProduct: true,
			params: params
		}),
		recommendations: allProductRecommendation,
		googleReview: await googleReview.json(),
		promotions: await promotions.json(),
		product: productRes.data.productByHandle,
		seo: {
			title:
				params.store === 'sg'
					? productRes.data.productByHandle.seoSgTitle
						? productRes.data.productByHandle.seoSgTitle?.value
						: productRes.data.productByHandle.seo.title
					: params.lang === 'en'
						? productRes.data.productByHandle.seoIdTitle
							? productRes.data.productByHandle.seoIdTitle?.value
							: productRes.data.productByHandle.seo.title
						: productRes.data.productByHandle.seo.title,
			metaDescription:
				params.store === 'sg'
					? productRes.data.productByHandle.seoSgDescription
						? productRes.data.productByHandle.seoSgDescription?.value
						: productRes.data.productByHandle.seo.description
					: params.lang === 'en'
						? productRes.data.productByHandle.seoIdDescription
							? productRes.data.productByHandle.seoIdDescription?.value
							: productRes.data.productByHandle.seo.description
						: productRes.data.productByHandle.seo.description
		}
	};
};

export const actions = {
	profile: async ({ request, fetch, params }) => {
		const body = formDataToJson(await request.formData());

		const response = await fetch(`/api/users/${params.id}.json`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-type': 'Application/json',
				Accept: 'Application/json'
			}
		});

		if (!response.ok) {
			const data = await response.json();

			return fail(data.statusCode, { error: data.message, user: body });
		}

		redirect(303, `/settings/users/${params.id}`);
	},
	review: async ({ request, fetch }) => {
		const reqFormData = await request.formData();
		const file = reqFormData.get('review-image') as File;
		const rating = reqFormData.get('rate') as string;
		const description = reqFormData.get('description') as string;
		const name = reqFormData.get('name') as string;
		const productId = reqFormData.get('productId') as string;

		const formData = new FormData();
		formData.append('file', file);
		formData.append('rating', rating);
		formData.append('description', description);
		formData.append('reviewerName', name);
		formData.append('productId', productId);
		formData.append('isAnonymous', 'true'); // TODO: Currently, the value is hardcoded as 'true'. Please replace it with a dynamic value once the requirements are met.

		const uploadResponse = await fetch('/api/review', {
			method: request.method,
			body: formData
		});

		const data = await uploadResponse.json();

		if (!uploadResponse.ok) {
			return fail(data.statusCode, { error: data.message });
		}

		const { url } = data;

		return { url };
	}
} satisfies Actions;
