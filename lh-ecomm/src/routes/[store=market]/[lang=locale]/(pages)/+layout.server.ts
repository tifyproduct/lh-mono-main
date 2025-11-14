import type { LayoutServerLoad } from './$types';
import {
	FIREBASE_API_KEY,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_APP_ID,
	FIREBASE_MESSAGING_SENDER_ID
} from '$env/static/private';
import type { CustomerProfile } from '$lib/types/customer';
import { env } from '$env/dynamic/private';
import { seoDefaultGenerate } from '$lib/utils/formatter';
import { getUserById } from '$lib/server/collections/user';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, fetch, locals }) => {
	const credentialSoc = {
		API_KEY: FIREBASE_API_KEY,
		AUTH_DOMAIN: FIREBASE_AUTH_DOMAIN,
		PROJECT_ID: FIREBASE_PROJECT_ID,
		STORAGE_BUCKET: FIREBASE_STORAGE_BUCKET,
		MESSAGING_SENDER_ID: FIREBASE_APP_ID,
		APP_ID: FIREBASE_MESSAGING_SENDER_ID
	};

	let customer: CustomerProfile | undefined = undefined;

	const userId = locals?.userId;
	if (userId) {
		try {
			const user = await getUserById(userId);

			customer = {
				id: user?.shopifyId,
				firstName: user?.firstName,
				lastName: user?.lastName,
				email: user?.email,
				phone: user?.phone,
				isLoggedIn: true,
				userId: userId
			} as CustomerProfile;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Internal Server Error');
		}
	}

	const headerReq = await fetch(`/api/menu/header?lang=${params.lang}&store=${params.store}`, {
		method: 'GET',
		headers: {
			'cache-control': 'max-age=3600'
		},
		cache: 'force-cache'
	});

	const resHead = await headerReq.json();

	const footerReq = await fetch(`/api/menu/footer?lang=${params.lang}&store=${params.store}`, {
		method: 'GET',
		headers: {
			'cache-control': 'max-age=3600'
		},
		cache: 'force-cache'
	});

	const resFooter = await footerReq.json();

	const request = await fetch('/api/cart');

	const response = await request.json();

	const cart = response;

	return {
		cart,
		params,
		menu: resHead.list,
		footer: resFooter.list,
		customer,
		credentialSoc,
		seo: {
			title: seoDefaultGenerate('title', params.store),
			metaDescription: seoDefaultGenerate('description', params.store)
		},
		isProduction: env.VITE_APP_ENV === 'production'
	};
};
