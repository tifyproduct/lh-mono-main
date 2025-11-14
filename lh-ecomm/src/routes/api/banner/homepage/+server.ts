import { json, type RequestHandler } from '@sveltejs/kit';
import { metaObjectBannerQueryByHandle } from '$lib/graphql.util';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const store = url.searchParams.get('store') || 'id';

	try {
		const resBanner = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: metaObjectBannerQueryByHandle().schema,
				variables: {
					handle: {
						handle: `homepage-banner-${store}`,
						type: 'headless_banner'
					}
				}
			})
		});

		const resultMetaBanner = await resBanner.json();

		const banner = resultMetaBanner.data.metaobject.bannerData.references.nodes.map(
			(banner: any, index: number) => {
				const json = resultMetaBanner.data.metaobject.urlData ? JSON.parse(resultMetaBanner.data.metaobject.urlData?.value) : [];
				return {
					bannerAlt: banner.image.altText,
					urlBanner: banner.image.url,
					urlBannerMobile:
						resultMetaBanner.data.metaobject.bannerMobile.references.nodes[index].image.url,
					urlLink: json.length > 0 ? json[index] !== 'null' ? json[index] : null : null,
				};
			}
		);


		return json(
			{ list: banner },
		);
	} catch (err) {
		return json({ error: 'Internal server error.' }, { status: 500 });
	}
};
