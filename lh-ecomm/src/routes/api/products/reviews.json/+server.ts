import { RequestHandler } from '@sveltejs/kit';
import { createAdminApiClient } from '@shopify/admin-api-client';
import {
	SHOPIFY_STORE_DOMAIN,
	SHOPIFY_API_VERSION,
	SHOPIFY_ADMIN_API_ACCESS_TOKEN
} from '$env/static/private';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const apiVersion = request.headers.get('X-SHOPIFY-API-VERSION');

	const client = createAdminApiClient({
		storeDomain: SHOPIFY_STORE_DOMAIN,
		apiVersion: apiVersion || SHOPIFY_API_VERSION,
		accessToken: SHOPIFY_ADMIN_API_ACCESS_TOKEN
	});

	const body = await request.json();

	console.log({ body });
};
