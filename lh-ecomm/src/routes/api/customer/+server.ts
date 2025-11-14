import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { json, type RequestHandler } from '@sveltejs/kit';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION, SHOPIFY_PRIVATE_ACCESS_TOKEN } from '$env/static/private';
import type { CustomerProfile } from '$lib/types/customer';

export const POST: RequestHandler = async ({ fetch, request }) => {
    const client = createStorefrontApiClient({
        storeDomain: SHOPIFY_STORE_DOMAIN,
        apiVersion: SHOPIFY_API_VERSION,
        privateAccessToken: SHOPIFY_PRIVATE_ACCESS_TOKEN,
        customFetchApi: fetch
    });

    const { query, variables } = await request.json() as { query: string, variables: Record<string, any> };

    const result = await client.fetch(query, { variables });

    const response = await result.json();

    let customer : CustomerProfile = {
        isLoggedIn: false,
        firstName: '',
        lastName: '',
        id: '',
        email: '',
        phone: '',
    }

    if (response.data.customer) {
        customer = {
            isLoggedIn: true,
            firstName: response.data.customer?.firstName,
            lastName: response.data.customer?.lastName,
            id: response.data.customer?.id,
            email: response.data.customer?.email,
            phone: response.data.customer?.phone,
        }
    }

    return json(customer);
};
