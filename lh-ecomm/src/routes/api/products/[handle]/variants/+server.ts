import { error, json, type RequestHandler } from '@sveltejs/kit';
import { productQuery } from "$lib/graphql.util";
import { productVariantData } from '$lib/utils/createObjectSchema';
import { checkAndGenerateCustomerShopifyData } from '$lib/server/services/shopify';

export const GET: RequestHandler = async ({ fetch, locals, cookies, params }) => {
    const userId = locals.userId
	if (!userId) {
        error(401, {
            message: 'Authorization token required.'
        });
	}
	let token: string
    const userShopifyToken = locals.userShopifyToken
	const userShopifyId = locals.userShopifyId
    try {
		const customerShopifyData = await checkAndGenerateCustomerShopifyData(
            cookies,
			userId,
			userShopifyId,
			userShopifyToken
		)
		token = customerShopifyData.token || ""
		if (!token) {
            error(401, {
                message: 'Authorization token required.'
            });
		}
	} catch(e) {
        error(500, {
            message: (e as Error).message,
        });
	}

    const { handle } = params;
    if (!handle) {
        throw error(422, 'Product handle is required.');
    }


    const metaQuery = productQuery();
    const store = params.store === 'id' ? 'Indonesia' : 'Singapore';
	const productFilters = [{tag: store}];
    try {
        const requestProduct = await fetch('/api/graphql.json', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: metaQuery.schema,
                variables: {
                    handle: handle,
                    filters: productFilters
                }
            })
        });
    
        if (!requestProduct.ok) {
            console.error(`Error fetching product: ${requestProduct.statusText}`);
            throw error(requestProduct.status, 'Failed to fetch product data.');
        }

        const productRes = await requestProduct.json();
        const product = productRes.data.productByHandle;

        if (!product) {
            throw error(404, 'Product not found.');
        }

        const productDetails = productVariantData({
            variants: product.variants.nodes,
            product
        });

        return json(productDetails);

    } catch (err) {
        console.error("Error fetching product by handle:", err);
        throw error(500, 'Internal server error.');
    }
};
