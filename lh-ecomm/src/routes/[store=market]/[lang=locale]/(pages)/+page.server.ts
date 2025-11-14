import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// Google Review
	const googleReview = await fetch(`/api/google/review?location=${params.store}`, {
		headers: {
			'cache-control': 'max-age=3600'
		},
		cache: 'force-cache'
	});

	// Inital Product Search
	const searchStaticTop = await fetch(
		`/api/collections/top-picks/search?store=${params.store}`,
		{
			method: 'GET',
			headers: {
				'cache-control': 'max-age=3600'
			},
			cache: 'force-cache'
		}
	);

	const resTopPickSearch = await searchStaticTop.json();

	return {
		store: params.store,
		lang: params.lang,
		topPicksSearch: resTopPickSearch.list,
		googleReview: await googleReview.json()
	};
};
