import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { json, type RequestHandler } from '@sveltejs/kit';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION, SHOPIFY_PRIVATE_ACCESS_TOKEN } from '$env/static/private';
import { checkAndGenerateCustomerShopifyData } from '$lib/server/services/shopify';

// TODO: will be deprecated if address has completely migrated from Shopify
export const POST: RequestHandler = async ({ fetch, request, cookies, locals }) => {
    const client = createStorefrontApiClient({
        storeDomain: SHOPIFY_STORE_DOMAIN,
        apiVersion: SHOPIFY_API_VERSION,
        privateAccessToken: SHOPIFY_PRIVATE_ACCESS_TOKEN,
        customFetchApi: fetch
    });

	const userId = locals.userId
	if (!userId) {
		return json({
			success: false,
			message: "Unauthorized",
			data: []
		})
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
			return json({
				success: false,
				message: "Unauthorized",
				data: []
			})
		}
	} catch(e) {
		return json({
			success: false,
			message: (e as Error).message,
			data: []
		})
	}

    const { query, variables } = await request.json() as { query: string, variables: Record<string, any> };

    const variable = {
        ...variables,
        "token": token
    }

    const result = await client.fetch(query, { variables: variable });

    const response = await result.json();

    let res = {
		success: false,
		message: '',
	}

	if (response.data?.customerDefaultAddressUpdate?.customer) {
		res = {
			success: true,
			message: 'Success set new default address',
		}
	} else {
		if (response?.data?.errors?.length > 0) {
			res = {
				success: false,
				message: response?.data?.errors[0].message,
				// message: 'Internal Server Error, Try again later.',
			}
		} else {
			res = {
				success: false,
				message: response.data?.customerDefaultAddressUpdate?.customerUserErrors[0].message,
			}
		}
	}

	return json(res);
};
