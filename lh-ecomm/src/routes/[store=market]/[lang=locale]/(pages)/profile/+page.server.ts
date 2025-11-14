import { redirect } from '@sveltejs/kit';

import { AUTH_TOKEN_COOKIES_NAME } from '$lib/constants.util';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch, cookies, params, url }) => {
	const token = cookies.get(AUTH_TOKEN_COOKIES_NAME);

	const { store, lang } = params;
	const pathName = url.pathname;
	const search = url.search;

	if (!token) {
		const redirectPath = pathName.split(`/${store}/${lang}/`).pop();

		const redirectUrl = `/${store}/${lang}?showLogin=true&redirect=${redirectPath}${search}`;
		throw redirect(302, redirectUrl);
	}

	if (token) {
		const address = await fetch('/api/customer/address', {
			method: 'GET'
		});

		const regions = await fetch('/api/address', {
			method: 'GET',
			headers: {
				'cache-control': 'max-age=3600'
			},
			cache: 'force-cache'
		});

		return {
			address: await address.json(),
			regions: await regions.json()
		};
	}
};
