import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {

	const headerReq = await fetch(`/api/menu/header?lang=${params.lang}&store=${params.store}`, {
		method: 'GET',
		headers: {
			'cache-control': 'max-age=3600'
		},
		cache: 'force-cache'
	});

	const resHead = await headerReq.json();

	return {
		params,
		menu: resHead,
		seo: {
			title: 'Luxehouze Indonesia',
			metaDescription: 'Luxury Marketplace'
		}
	};
};
