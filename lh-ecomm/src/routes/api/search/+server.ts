import { json, type RequestHandler } from "@sveltejs/kit";
import type { GetProductsQueryParams } from '$lib/interfaces';
import { getProductsQuery } from '$lib/graphql.util';
import { getProductsPagination } from '$lib';
import { env } from '$env/dynamic/private';

import { productObjectSchema } from "$lib/utils/createObjectSchema";

export const GET: RequestHandler = async ({ fetch, url }) => {
  try {
    const store = url.searchParams.get('store') || 'id';
    const lang = url.searchParams.get('lang') || 'en';
    const keyword = url.searchParams.get('keyword') || '';
  
    const filterParams = url.searchParams.get('filters');
    const sortKey = url.searchParams.get('sortKey') || 'CREATED_AT';
    const reverseParam = url.searchParams.get('reverse');
    const after = url.searchParams.get('after');
    const before = url.searchParams.get('before');
    let reverse: boolean;
    if (sortKey === 'CREATED_AT' && !reverseParam) {
      reverse = true;
    } else {
      reverse = reverseParam === 'true';
    }
    const filters = [];
  
    const productSize = 6 * 3;
  
    if (filterParams && filterParams.length > 0) {
      for (const filterParam of filterParams.split(',')) {
        filters.push(JSON.parse(filterParam));
      }
    }
  
    let wishlistProducts: string[] = [];

    const wishlistCustomer = await fetch(
      `/api/customer/wishlist`,
      {
        method: 'GET'
      }
    );

    const wishlists = await wishlistCustomer.json();

    wishlistProducts = wishlists.list;

    let queryVariables: string = `${keyword} tag:${store === 'id' ? 'Indonesia' : 'Singapore'}`;
    if (env.VITE_APP_ENV === 'production') {
      queryVariables += ` AND tag:Live`;
    }
  
    if (filters.length > 0) {
      const filterStrings = filters.map(filter => `tag:${filter.tag}`).join(' AND ');
      queryVariables += ` AND ${filterStrings}`;
    }

    const variables: GetProductsQueryParams = {
      query: queryVariables,
      reverse: reverse,
      sortKey: sortKey,
      first: productSize
    }
  
    if (after) {
      variables.after = after;
      variables.first = productSize;
    }
  
    if (before) {
      delete variables.first;
      variables.before = before;
      variables.last = productSize;
    }

    const metaQuery = getProductsQuery();

    let paginateInfo: {list: any[]; total: number};
    try {
      paginateInfo = await getProductsPagination(
        {
          variables: JSON.parse(JSON.stringify(variables)),
          fetch,
          url
        },
        productSize,
      ) as {list: any[]; total: number};
    } catch (err) {
      console.error(err)
      throw new Error("Failed to paginate products")
    }

    const getProductsResponse = await fetch('/api/graphql.json', {
      method: 'POST',
      body: JSON.stringify({
        query: metaQuery.schema,
        variables: {
          ...variables
        }
      })
    });
    if (!getProductsResponse.ok) {
      throw new Error(`connecting shopify failed, status: ${getProductsResponse.status}`);
    }
    const resultSearch = await getProductsResponse.json();

    if (resultSearch.errors && resultSearch.errors.length > 0) {
      const errorMessage = resultSearch.errors.map(error => error.message).join(', ');
      console.error('GraphQL Errors:', errorMessage);
      throw new Error(`GraphQL error: ${errorMessage}`);
    }

    const filteredProduct = resultSearch.data.products.edges.filter((x) => x.node.tags.includes(store === 'id' ? 'Indonesia' : 'Singapore'))
  
    const productFormattedAll = filteredProduct.map((data) => {

      const product = productObjectSchema({
        product: data.node,
        store: store,
        lang: lang,
        wishlists: wishlistProducts
      })
      return product
    });

    return json(
      {
        data: productFormattedAll,
        pagination: paginateInfo.list,
        total: paginateInfo.total

      },
    );
  }
  catch (error) {
    return json({ error: error }, { status: 500 });
  }

}