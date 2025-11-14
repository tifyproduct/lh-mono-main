// place files you want to import through the `$lib` alias in this folder.
import { getTotalProducts, recentlyViewedProducts, getProductsQuery } from './graphql.util';
import {
	RECENTLY_VIEWED_COOKIES_NAME,
	MAX_RECENTLY_VIEWED_PRODUCT_COUNT,
} from './constants.util';
import type { ProductsQueryParams } from './interfaces';
import { productObjectSchema } from './utils/createObjectSchema';
import type { ProductData } from '$lib/types/product';


export const getRecentlyViewedFromMongoDB = async ({ params, fetch, locals }) => {
	const userId = locals?.userId
	if (userId) {
		try {
			const url = `/api/recently-viewed?store=${params.store}&lang=${params.lang}&perPage=${MAX_RECENTLY_VIEWED_PRODUCT_COUNT.toString()}`;

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const recentlyViewed = await response.json();
			return recentlyViewed.data as ProductData[];
		} catch (error) {
			console.error('Error fetching recently viewed products:', error);
			return [];
		}
	}

	return [];
};

export const getRecentlyViewed = async ({ params, fetch, cookies }) => {
	const metaQuery = recentlyViewedProducts();

	let recentlyViewed = [];
	const recentlyViewedCookies = cookies.get(RECENTLY_VIEWED_COOKIES_NAME);
	const productIds = [];

	const products = JSON.parse(recentlyViewedCookies || '[]');

	if (recentlyViewedCookies && recentlyViewedCookies.length > 0) {
		for (const product of products) {
			// if (product.type === params.type) {
			productIds.push(product.id);
			// }
		}
	} else {
		for (const product of products) {
			// if (product.type === params.type) {
			productIds.push(product.id);
			// }
		}
	}

	const request = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				ids: productIds
			}
		})
	});

	const response = await request.json();

	recentlyViewed = response.data.nodes
		.filter((product) => product)
		.map((product) => {
			return productObjectSchema({ product, store: params.store, lang: params.lang });
		});

	return recentlyViewed;
};

export const setupCollectionVariables = ({ url, params, productSize }) => {
	const filters = [];
	const baseFilter = {
		tag: params.store === 'id' ? 'Indonesia' : 'Singapore'
	};

	filters.push(baseFilter);

	const filterParams = url.searchParams.get('filters');

	const sortKey = url.searchParams.get('sortKey') || 'PRICE';
	const reverse = url.searchParams.get('reverse');
	const after = url.searchParams.get('after');
	const before = url.searchParams.get('before');

	if (filterParams && filterParams.length > 0) {
		for (const filterParam of filterParams.split(',')) {
			filters.push(JSON.parse(filterParam));
		}
	}

	const variables: ProductsQueryParams = {
		handle: params.brand,
		filters,
		sortKey,
		reverse: reverse === 'true',
		first: productSize
	};

	if (after) {
		variables.after = after;
		variables.first = productSize;
	}

	if (before) {
		delete variables.first;
		variables.before = before;
		variables.last = productSize;
	}

	return variables;
};

export const getCollectionProductsPagination = async (
	{ variables, fetch, url },
	pageSize: number
): Promise<any> => {
	console.time('add');
	let products = [];

	let hasNextPage = true;
	const metaQuery = getTotalProducts();

	delete variables.first;
	delete variables.after;
	delete variables.last;
	delete variables.before;

	variables.first = 250;

	while (hasNextPage) {
		try {
			const request = await fetch('/api/graphql.json', {
				method: 'POST',
				body: JSON.stringify({
					query: metaQuery.schema,
					variables
				})
			});

			const response = await request.json();

			if (!response.data || !response.data.collection) {
				console.error('Invalid response structure:', response);
				break;
			}

			const productResults = response.data.collection.products;

			if (productResults && productResults.edges) {
				products = products.concat(productResults.edges);
			} else {
				console.warn('No products found in the response:', productResults);
				break;
			}

			const pageInfo = productResults.pageInfo;

			if (pageInfo.hasNextPage) {
				variables.after = pageInfo.endCursor;
			}

			hasNextPage = pageInfo.hasNextPage;
		} catch (error) {
			console.error('Error fetching products:', error);
			break;
		}
	}

	const paginations = [];
	const totalPages = Math.ceil(products.length / pageSize);

	let pageNumber = 1;

	for (let i = 0; i < products.length; i += pageSize) {
		const newURL = new URL(url.toString());
		const cursor = products[i - 1]?.cursor || null;

		const isCurrentPage = cursor === newURL.searchParams.get('after');

		if (pageNumber > 1) {
			newURL.searchParams.set('after', cursor);
		} else {
			newURL.searchParams.delete('after');
		}

		paginations.push({
			isFirstPage: pageNumber === 1,
			isLastPage: pageNumber === totalPages,
			isCurrentPage,
			pageNumber,
			cursor,
			url: newURL.toString()
		});

		pageNumber++;
	}

	console.timeEnd('add');
	return paginations;
};

export const getGlobalPromotions = async (fetch) => {
	const request = await fetch('/api/promotions');

	return await request.json();
};

export const getProductsPagination = async (
	{ variables, fetch, url },
	pageSize: number,
  ): Promise<{list: any[]; total: number}> => {
	console.time('add');
	let products: any[] = [];
	let hasNextPage = true;
  
	variables = {
	  ...variables,
	  first: 250,
	  after: undefined,
	  last: undefined,
	  before: undefined,
	};

	const metaQuery = getProductsQuery()
  
	while (hasNextPage) {
	  const response = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
		  query: metaQuery.totalSchema,
		  variables,
		}),
	  });
  
	  const result = await response.json();
	  const productResults = result.data.products;
  
	  if (!productResults?.edges?.length) {
		break;
	  }
  
	  products.push(...productResults.edges);
  
	  hasNextPage = productResults.pageInfo.hasNextPage;
	  if (hasNextPage) {
		variables.after = productResults.pageInfo.endCursor;
	  }
	}
  
	const paginations = [];
	const totalPages = Math.ceil(products.length / pageSize);
  
	for (let i = 0, pageNumber = 1; i < products.length; i += pageSize, pageNumber++) {
	  const newURL = new URL(url.toString());
	  const cursor = products[i - 1]?.cursor || null;
  
	  const isCurrentPage = cursor === newURL.searchParams.get('after');
	  if (pageNumber > 1) {
		newURL.searchParams.set('after', cursor);
	  } else {
		newURL.searchParams.delete('after');
	  }
  
	  paginations.push({
		isFirstPage: pageNumber === 1,
		isLastPage: pageNumber === totalPages,
		isCurrentPage,
		pageNumber,
		cursor,
		url: newURL.toString(),
	  });
	}
  
	console.timeEnd('add');
	return {
		list: paginations,
		total: products.length
	};
};
