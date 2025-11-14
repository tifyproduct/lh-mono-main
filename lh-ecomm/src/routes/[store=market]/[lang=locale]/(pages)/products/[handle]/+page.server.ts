import type {
	PageServerLoad
} from './$types';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
	const handle = params.handle;
	const locale = url.searchParams.get('lang') || 'en';

	const productQuery = `query ProductQuery($handle: String) @inContext(language: ${locale.toUpperCase()}) {
			product(handle: $handle) {
				id
				title
				handle
				descriptionHtml
				description
				vendor
				totalInventory
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
					height
					id
					url
					width
				}
				onlineStoreUrl
				seo {
					title
					description	
				}
				variants(first:5) {
					edges{
						node{
							price{
								amount
								currencyCode
							}
						}
					}
				}
			}
		}
	`;

	const request = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: productQuery,
			variables: {
				handle
			}
		}),
	});

	const result = await request.json();

	const { product } = result.data
	const { errors } = result.data

	if (errors) {
		error(500, 'Something wrong with the servers');
	}

	if (product === null) {
		error(404, 'Product not found');
	}

	return {
		params,
		product,
		seo: {
			title: product.seo.title,
			metaDescription: product.seo.description,
		},
	};
}