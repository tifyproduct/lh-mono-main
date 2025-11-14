import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	// will be developed later
	console.log(request.body)

	return json({ msg: "OK" });
};
