import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { json, type RequestHandler } from '@sveltejs/kit';
import {
	SHOPIFY_STORE_DOMAIN,
	SHOPIFY_API_VERSION,
	SHOPIFY_PRIVATE_ACCESS_TOKEN
} from '$env/static/private';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const apiVersion = request.headers.get('X-SHOPIFY-API-VERSION');
	const client = createStorefrontApiClient({
		storeDomain: SHOPIFY_STORE_DOMAIN,
		apiVersion: apiVersion || SHOPIFY_API_VERSION,
		privateAccessToken: SHOPIFY_PRIVATE_ACCESS_TOKEN,
		customFetchApi: fetch
	});
	const { query, variables } = (await request.json()) as {
		query: string;
		variables: Record<string, any>;
	};

	const result = await client.fetch(query, { variables });
	const response = await result.json();

	return json(response);	
};
