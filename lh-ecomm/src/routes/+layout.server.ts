import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { building } from '$app/environment';
import { connect } from '$lib/server/db';
import { geolocation } from '@vercel/functions';
import {
	AUTH_METHOD_SOCIAL_LOGIN_GOOGLE,
	SHOW_GOOGLE_LOGIN_COOKIES_NAME,
} from '$lib/constants.util';
import { getUserById } from '$lib/server/collections/user';
import { getFeatureFlagsServerSide } from '$lib/utils/getFeatureFlagsServerSide';
import { googleIpChecker } from '../lib/server/ipChecker';

const ABCookiesName = 'LH_AB_VARIANTS'
let lastABVariants: number | null = null;

if (!building) {
	connect().then(() => {
		console.log('MongoDB Connected');
	});
}

export const load: LayoutServerLoad = async ({ url, params, request, cookies, locals }) => {
	const featureFlag = getFeatureFlagsServerSide();
	if (locals.userId && cookies.get(SHOW_GOOGLE_LOGIN_COOKIES_NAME) !== 'true') {
		try {
			const user = await getUserById(locals.userId)
			if (user && user.method === AUTH_METHOD_SOCIAL_LOGIN_GOOGLE && !user.isSetPassword) {
				cookies.set(SHOW_GOOGLE_LOGIN_COOKIES_NAME, "true", {
					path: '/',
					httpOnly: true,
					sameSite: 'lax',
					maxAge: 15552000 // 6 months in seconds
				})
			}
		} catch (e) {
			console.error('Error fetching user: ', e);
		}
	}

	const isGoogleIpSpotted = await googleIpChecker(request);

	if (!url.origin.includes('localhost') && !url.origin.includes('staging')) {
		// Result from Google IP Checker
		if(!isGoogleIpSpotted){
			// Get User Location IP Address
			const location = geolocation(request);
			const currentStore = url.pathname.split('/')[1];
	
	
			// Check for redirect
			if (location?.country?.toLowerCase() === 'id' && params.store && currentStore !== 'id') {
				redirect(
					302,
					`${url.pathname.replace(/^\/[^\/]+/, '/id')}${url.search ? `${url.search}` : ''}`
				);
			} else if (location?.country?.toLowerCase() !== 'id' && params.store && currentStore !== 'sg') {
				redirect(
					302,
					`${url.pathname.replace(/^\/[^\/]+/, '/sg')}${url.search ? `${url.search}` : ''}`
				);
			}
		}
	}

	if (!params.store) {
		redirect(302, '/id/en');
	}

	/**
	 * AB Setup Start
	 */
	if (featureFlag.isAbTestEnabled) {
		const ABVariants = ['control', 'variant_a', 'variant_b']; // Change accordingly
		const ABCookies = cookies.get(ABCookiesName);

		if (ABCookies) {
			return {
				ABVariants: ABCookies
			}
		}

		if (!lastABVariants) {
			lastABVariants = 0;
		}

		const currentAB = ABVariants[lastABVariants];

		lastABVariants++;

		if (lastABVariants >= ABVariants.length) {
			lastABVariants = 0;
		}

		cookies.set(ABCookiesName, currentAB, {
			path: '/',
			maxAge: 2 * 7 * 24 * 60 * 60 // 2 weeks,
		})

		return {
			ABVariants: currentAB
		}
	} else {
		lastABVariants = null;
		cookies.delete(ABCookiesName, { path: "/" });
		return {
			ABVariants: 'control'
		}
	}
};
