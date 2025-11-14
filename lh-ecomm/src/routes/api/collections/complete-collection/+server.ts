import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import getCustomerId from '$lib/utils/getCustomerIdShopify';
import { convertProductMongoToCardProduct } from '$lib/utils/v2/objectSchema';
import { APP_MODE, COUNTRY, LANG, STORE } from '$lib/constants.util';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ fetch, url }) => {
	const db = getDB();

	// const { handle } = params;
	const query = new URLSearchParams(url.search);
	const store = query.get('store') || STORE.id;
	const lang = query.get('lang') || LANG.en;
	const customerId = query.get('customerId') || '';
	// Watches | Beauty | Jewelry
	const categoryParam = query.get('category') || 'Watches';

	const limit = parseInt(query.get('limit') || '10');

	let wishlistProducts: string[] = [];

	if (customerId) {
		const wishlistCustomer = await fetch(
			`/api/customer/wishlist?customerId=${getCustomerId(customerId)}`,
			{
				method: 'GET'
			}
		);

		const wishlists = await wishlistCustomer.json();

		wishlistProducts = wishlists.list;
	}

	let sort: any = {
		isSoldOut: 1,
		isNewArrival: -1,
		isReadyStock: -1,
		isDiscount: 1,
		isPreOrder: 1,
		isPreOrderWithPrice: 1
	};

	const filter: any = {
		tag: {
			$in: [categoryParam]
		},
		country: {
			$eq: store === STORE.id ? COUNTRY.ID : COUNTRY.SG
		},
		title: {
			$not: {
				$regex: /(FREEBIE|GIFT)/i
			}
		}
		// isSoldOut: {
		// 	$eq: false
		// },
		// isPreOrder: {
		// 	$eq: false
		// }
	};

	if (env.MODE === APP_MODE.PROD) {
		filter['isLive'] = { $eq: true };
	}

	const products = await db
		.collection('Products')
		.aggregate([
			{
				$addFields: {
					price: { $toDouble: '$price' }, // Convert the price field to double
					discountPrice: { $toDouble: '$discountPrice' } // Convert the price field to double
				}
			},
			{
				$match: filter
			},
			{ $sort: sort },
			{ $skip: 0 },
			{ $limit: limit }
		])
		.toArray();

	const convertedProduct: any[] = products.map((product) =>
		convertProductMongoToCardProduct({ product, store, lang, wishlists: wishlistProducts })
	);

	return json(convertedProduct);
};
