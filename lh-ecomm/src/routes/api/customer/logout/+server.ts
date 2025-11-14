import { json, type RequestHandler } from '@sveltejs/kit';
import { SHOPIFY_TOKEN_COOKIES_NAME, AUTH_TOKEN_COOKIES_NAME } from '$lib/constants.util';

export const POST: RequestHandler = async ({ cookies }) => {
    // TODO: old token will be removed later
    if (cookies.get(SHOPIFY_TOKEN_COOKIES_NAME)) {
        cookies.delete(SHOPIFY_TOKEN_COOKIES_NAME, {
            path: '/'
        });
    }

    if (cookies.get(AUTH_TOKEN_COOKIES_NAME)) {
        cookies.delete(AUTH_TOKEN_COOKIES_NAME, {
            path: '/'
        });
    }

	return json(null);
};
