import { error, json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { productObjectSchema } from '$lib/utils/createObjectSchema';
import { recentlyViewedProducts } from '$lib/graphql.util';
import type { Document, PullOperator, PushOperator } from 'mongodb';
import type { ProductData } from '$lib/types/product';
import { paginate } from '$lib/utils/pagination';
import { MAX_RECENTLY_VIEWED_PRODUCT_COUNT } from '$lib/constants.util';

interface RecentlyViewedDocument extends Document {
	userId: string;
	shopifyCustomerID?: string; // deprecated field
	productIDs: ProductRecentlyView[];
}

interface ProductRecentlyView {
	productId: string;
	store: string;
}

interface RequestBody {
	productID: string;
	store: string;
}

const recentlyViewedCollection = 'RecentlyViewed';

export const GET: RequestHandler = async ({ fetch, url, locals }) => {
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

	try {
		const db = getDB();

		const recentlyViewed = (await db
			.collection(recentlyViewedCollection)
			.findOne({
				userId: userId
			})) as RecentlyViewedDocument | null;

		const productsRecents = recentlyViewed ? recentlyViewed.productIDs.filter(product => product.store === store) : [];

		const productIDs = productsRecents.map((product) => product.productId);

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

		let wishlistProducts: string[] = [];

		const wishlistCustomer = await fetch(
			`/api/customer/wishlist`,
			{
				method: 'GET'
			}
		);

		const wishlists = await wishlistCustomer.json();

		wishlistProducts = wishlists.list;

		const response = await request.json();

		const viewedProducts: Array<ProductData>  = [];

		response.data.nodes
			.filter((product: any) => product)
			.forEach((product: any) => {
				if(product.tags.includes(store === 'id' ? 'Indonesia' : 'Singapore')) viewedProducts.push(productObjectSchema({ product, store, lang, wishlists: wishlistProducts }));
			});

		const paginatedResponse = paginate(viewedProducts, page, perPage);
		return json({ ...paginatedResponse });
	} catch (error) {
		console.error(error);
		return json({ error: 'Internal server error.' }, { status: 500 });
	}
};

export const PUT: RequestHandler = async ({ request, locals }) => {
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

	const req: RequestBody = (await request.json()) || {};
	if (!req.productID) {
		error(400, {
			message: 'Product ID is required.'
		});
	}

	const db = getDB();
	try {
		// delete product from recently viewed if it exists
		await db
			.collection(recentlyViewedCollection)
			.updateOne({ userId: userId }, {
				$pull: { productIDs: {
					productId: req.productID
				}}
			}) as unknown as PullOperator<Document>;
			
		// add product to recently viewed
		await db.collection(recentlyViewedCollection).updateOne(
			{ userId: userId },
			{
				$push: {
					productIDs: {
						$each: [{
							productId: req.productID,
							store: req.store,
						}],
						$position: 0,
						$slice: MAX_RECENTLY_VIEWED_PRODUCT_COUNT
					}
				} as unknown as PushOperator<Document>
			},
			{ upsert: true }
		);

		return json({ success: true }, { status: 200 });
	} catch (error) {
		console.error(error.errorResponse.errInfo.details.schemaRulesNotSatisfied[0], '===');
		return json({ error: 'Internal server error.' }, { status: 500 });
	}
};
