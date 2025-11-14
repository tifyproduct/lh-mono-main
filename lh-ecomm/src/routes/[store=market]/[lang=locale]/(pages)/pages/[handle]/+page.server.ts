import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
	const handle = params.handle;

	const productQuery = `query PageQuery($handle: String) {
		page(handle: $handle) {
			id
			title
			body
			bodySummary
			handle
			seo {
				title
				description
			}
		}
	}
`;

	const request = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: productQuery,
			variables: {
				handle
			}
		})
	});

	const result = await request.json();

	return {
		params,
		page: result.data.page,
		seo: result.data.page.seo
	};
};
