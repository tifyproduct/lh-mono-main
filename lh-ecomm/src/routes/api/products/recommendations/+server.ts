import { error, json, type RequestHandler } from '@sveltejs/kit';
import {
	productRecommendationQuery,
    searchProductHandleQuery,
    metaObjectSearchQueryStatic
} from '$lib/graphql.util';
import {
	productObjectSchema
} from '$lib/utils/createObjectSchema';
import type { ProductData } from '$lib/types/product';


export const GET: RequestHandler = async ({ fetch, url }) => {
    const params = new URLSearchParams(url.search);
    const keyword = params.get('keyword') || '';
    const store = params.get('store') || 'id';
    const lang = params.get('lang') || 'en';
    const customerId = params.get('customerId') || '';

    const searchHandleQuery = searchProductHandleQuery();
    const getRecommendationQuery = productRecommendationQuery();

    try {
        const requestProductHandle = await fetch('/api/graphql.json', {
            method: 'POST',
            body: JSON.stringify({
                query: searchHandleQuery.schema,
                variables: { query: keyword }
            })
        });

        if (!requestProductHandle.ok) {
            throw error(requestProductHandle.status, 'Failed to fetch products from Shopify.');
        }

        const searchRes = await requestProductHandle.json();
        const products = searchRes.data.predictiveSearch.products;

        const wishlistProducts: string[] = await fetchWishlistProducts(fetch, customerId);

        const result: ProductData[] = [];
        
        for (const product of products) {
            if (result.length >= 10) break;

            const recommendations = await fetchProductRecommendations(fetch, getRecommendationQuery, product.handle);
            if (!recommendations) continue;

            const recommendationProducts = recommendations.map((recProduct: any) => 
                productObjectSchema({
                    product: recProduct,
                    store,
                    lang,
                    wishlists: wishlistProducts
                })
            );

            result.push(...recommendationProducts);
        }

        if (result.length < 10) {
            const topPicks = await fetchTopPicks(fetch, store, wishlistProducts);
            result.push(...topPicks);
        }

        return json({ data: result.slice(0, 10) });
    } catch (err) {
        console.error("error get product recommendations api:", err);
        throw error(500, 'Internal server error.');
    }
};

async function fetchWishlistProducts(fetch): Promise<string[]> {
    try {
        const response = await fetch(`/api/customer/wishlist`, {
            method: 'GET'
        });
        const data = await response.json();
        return data.list || [];
    } catch (err) {
        console.error("Error fetching wishlist:", err);
        return [];
    }
}

async function fetchProductRecommendations(fetch, query: { schema: string }, handle: string): Promise<any[]> {
    try {
        const response = await fetch('/api/graphql.json', {
            method: 'POST',
            body: JSON.stringify({
                query: query.schema,
                variables: { handle }
            })
        });

        if (!response.ok) {
            console.error('Failed to fetch product recommendations');
            return [];
        }

        const data = await response.json();
        return data.data.productRecommendations || [];
    } catch (err) {
        console.error("Error fetching recommendations:", err);
        return [];
    }
}

async function fetchTopPicks(fetch, store: string, wishlistProducts: string[]): Promise<ProductData[]> {
    try {
        const response = await fetch('/api/graphql.json', {
            method: 'POST',
            body: JSON.stringify({
                query: metaObjectSearchQueryStatic().schema,
                variables: {
                    handle: {
                        handle: 'top-picks',
                        type: 'headless_search_section'
                    }
                }
            })
        });

        const data = await response.json();
        const productsKey = store === 'id' ? 'productsId' : 'productsSg';
        const topPicksData = data.data.metaobject[productsKey].references.nodes || [];

        return topPicksData.map((product: any) => 
            productObjectSchema({
                product,
                store,
                lang: store === 'id' ? 'en' : 'en',
                wishlists: wishlistProducts
            })
        );
    } catch (err) {
        console.error("Error fetching top picks:", err);
        return [];
    }
}