import { json, type RequestHandler } from '@sveltejs/kit';
import { metaObjectBannerQueryByHandle } from '$lib/graphql.util';


export const GET: RequestHandler = async ({ fetch }) => {
    try {
        const resBanner = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: metaObjectBannerQueryByHandle().schema,
				variables: {
					handle: {
						handle: 'default-banner-promoted',
						type: 'headless_banner'
					}
				}
			})
		});

		const resultMetaBanner = await resBanner.json();

		const link = resultMetaBanner?.data?.metaobject?.urlData ? JSON.parse(resultMetaBanner?.data?.metaobject?.urlData?.value) : null;

        return json({ data: {
			banner: resultMetaBanner?.data?.metaobject?.bannerData?.references?.nodes[0]?.image?.url,
			link: link[0],
		} });
    } catch (error) {
        return json({ error: 'Internal server error.' }, { status: 500 });
    }
};