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
import { getUserById } from '$lib/server/collections/user';
import { error } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ params, fetch, locals, cookies }) => {
	const lhShowGoogleLogin = cookies.get('lh_show_google_login');
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
				isLoggedIn: true
			} as CustomerProfile;
		} catch (err) {
			error(500, err instanceof Error ? err.message : 'Internal Server Error');
		}
	}

	const request = await fetch('/api/cart');

	const response = await request.json();

	const cart = response;

	return {
		isProduction: env.VITE_APP_ENV === 'production',
		cart,
		params,
		customer,
		credentialSoc,
		seo: {
			title: `Luxehouze ${params.store === 'id' ? 'Indonesia' : 'Singapore'}`,
			metaDescription: 'Luxury Marketplace'
		},
		lhShowGoogleLogin
	};
};
