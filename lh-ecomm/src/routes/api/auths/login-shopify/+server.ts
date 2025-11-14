import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { json, type RequestHandler } from '@sveltejs/kit';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION, SHOPIFY_PRIVATE_ACCESS_TOKEN } from '$env/static/private';
import { DateTime } from 'luxon';
import { SHOPIFY_TOKEN_COOKIES_NAME, CACHE_COOKIES_NAME } from '$lib/constants.util';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ fetch, request, cookies }) => {
	const client = createStorefrontApiClient({
		storeDomain: SHOPIFY_STORE_DOMAIN,
		apiVersion: SHOPIFY_API_VERSION,
		privateAccessToken: SHOPIFY_PRIVATE_ACCESS_TOKEN,
		customFetchApi: fetch
	});

	const db = getDB();

	const { query, variables } = await request.json() as { query: string, variables: Record<string, any> };

	const result = await client.fetch(query, { variables });

	const response = await result.json();

	let res = {
		success: false,
		message: '',
	}

	if (response.data?.customerAccessTokenCreate?.customerAccessToken) {
		cookies.set(SHOPIFY_TOKEN_COOKIES_NAME, response.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken, {
			path: '/',
			expires: DateTime.now().plus({ months: 6 }).toJSDate()
		});

		db.collection('Users').updateOne({
			email: variables.email,
		}, {
			$set: {
				token: response.data?.customerAccessTokenCreate?.customerAccessToken?.accessToken,
			}
		});

		cookies.set(CACHE_COOKIES_NAME, variables.email, {
			path: '/',
			expires: DateTime.now().plus({ months: 12 }).toJSDate()
		});

		res = {
			success: true,
			message: 'Success login',
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
				message: response.data?.customerAccessTokenCreate?.customerUserErrors[0].message,
				// message: 'Internal Server Error, Try again later.',
			}
		}
	}

	return json(res);
};
