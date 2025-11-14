import { json, type RequestHandler } from '@sveltejs/kit';
import { WORDPRESS_DOMAIN } from '$env/static/private';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const { paraphrase } = (await request.json()) as { paraphrase: string };

	const result = await fetch(
		`${WORDPRESS_DOMAIN}/wp-json/wp/v2/posts?search=${paraphrase}&per_page=4`
	);

	const response = await result.json();

	const blogs: any = [];

	for (let i = 0; i < response.length; i++) {
		const image = await fetch(
			`${WORDPRESS_DOMAIN}/wp-json/wp/v2/media/${response[i].featured_media}`
		);

		const res = await image.json();

		blogs.push({
			id: response[i].id,
			title: response[i].title.rendered,
			image: res.source_url,
			date: response[i].date,
			slug: response[i].yoast_head_json.canonical,
			summary: response[i].excerpt.rendered
		});
	}

	return json(blogs);
};
