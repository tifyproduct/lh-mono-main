import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { productObjectSchema } from '$lib/utils/createObjectSchema';
import { recentlyViewedProducts } from '$lib/graphql.util';
import { paginate } from '$lib/utils/pagination';

interface RequestBody {
	productID?: string;
	store?: string;
	userId?: string;
}

const productWishlistCollection = 'ProductWishlist';

export const POST: RequestHandler = async ({ request, locals }) => {
	const userId = locals.userId
	if (!userId) {
		error(401, {
			message: 'Authorization error.'
		});
	}
	if (!request.body) {
		error(400, {
			message: 'Payload required.'
		});
	}

	const body: RequestBody = (await request.json()) || {};

	if (!body.productID) {
		error(400, {
			message: 'Product ID is required'
		});
	}

	const db = getDB();

	const result = await db.collection(productWishlistCollection).insertOne({
		createdAt: new Date().toISOString(),
		productID: body.productID,
		store: body.store,
		userId: body.userId
	});

	return json(result);
};

export const GET: RequestHandler = async ({ fetch, locals, url }) => {
	const userId = locals.userId
	if (!userId) {
		error(401, {
			message: 'Authorization error.'
		});
	}

	const store = url.searchParams.get('store') || 'id';
	const lang = url.searchParams.get('lang') || 'en';
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const perPage = parseInt(url.searchParams.get('perPage') || '10', 10);

	const db = getDB();

	const productWishlists = await db
		.collection(productWishlistCollection)
		.find({ userId: userId })
		.toArray();

	const productIDs: string[] = [];

	for (const wishlist of productWishlists) {
		if(wishlist?.store === store) productIDs.push(wishlist.productID);
	}

	const metaQuery = recentlyViewedProducts();

	const request = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: metaQuery.schema,
			variables: {
				ids: productIDs
			}
		})
	});

	const response = await request.json();

	const wishlist = response.data.nodes
		.filter((product) => product)
		.map((product) => {
			return productObjectSchema({ 
				product, 
				store, 
				lang,
			});
		});

	const paginatedResponse = paginate(wishlist, page, perPage);
	return json({ ...paginatedResponse });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
	const userId = locals.userId
	if (!userId) {
		error(401, {
			message: 'Authorization error.'
		});
	}
	if (!request.body) {
		error(400, {
			message: 'Payload required.'
		});
	}

	const body: RequestBody = (await request.json()) || {};

	if (!body.productID) {
		error(400, {
			message: 'Product ID is required'
		});
	}

	const db = getDB();

	const deleteResult = await db.collection(productWishlistCollection).deleteOne({
		userId: userId,
		productID: body.productID
	});

	return json(deleteResult);
};
