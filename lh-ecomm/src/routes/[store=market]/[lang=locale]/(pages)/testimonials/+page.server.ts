import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
	const googleReview = await fetch('/api/google/review');

	return {
		googleReview: await googleReview.json()
	};
};
