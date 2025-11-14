import type { LayoutServerLoad } from './$types';
import type { CustomerProfile } from '$lib/types/customer';
import {
	FIREBASE_API_KEY,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_APP_ID,
	FIREBASE_MESSAGING_SENDER_ID,
} from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getUserById } from '$lib/server/collections/user';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, fetch, locals, url }) => {
	const credentialSoc = {
		API_KEY: FIREBASE_API_KEY,
		AUTH_DOMAIN: FIREBASE_AUTH_DOMAIN,
		PROJECT_ID: FIREBASE_PROJECT_ID,
		STORAGE_BUCKET: FIREBASE_STORAGE_BUCKET,
		MESSAGING_SENDER_ID: FIREBASE_APP_ID,
		APP_ID: FIREBASE_MESSAGING_SENDER_ID,
	};

	let customer: CustomerProfile | undefined = undefined;

	const userId = locals?.userId
	if (userId) {
		try {
			const user = await getUserById(userId)

			customer = {
				id: user?.shopifyId,
				firstName: user?.firstName,
				lastName: user?.lastName,
				email: user?.email,
				phone: user?.phone,
				isLoggedIn: true
			} as CustomerProfile
		} catch (err) {
			error(500, err instanceof Error ? err.message : "Internal Server Error");
		}
	}

	const { store, lang, type } = params;

	if (!['all', 'beauty', 'watch', 'fashion'].includes(type)) {
		redirect(307, `/${store}/${lang}/404`);
	}

	const headerReq = await fetch(`/api/menu/header?lang=${params.lang}&store=${params.store}`, {
		method: 'GET',
	});

	const resHead = await headerReq.json();

	const footerReq = await fetch(`/api/menu/footer?lang=${params.lang}&store=${params.store}`, {
		method: 'GET',
	});

	const resFooter = await footerReq.json();

	const cartRequest = await fetch('/api/cart');

	const cartResponse = await cartRequest.json();

	return {
		cart: cartResponse,
		params,
		menu: resHead.list,
		customer,
		credentialSoc,
		footer: resFooter.list,
		seo: {
			title: 'Luxehouze Indonesia',
			metaDescription: 'Luxury Marketplace'
		},
		isProduction: env.VITE_APP_ENV === 'production'
	};
};
