import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import getCustomerId from '$lib/utils/getCustomerIdShopify';
import { convertProductMongoToCardProduct } from '$lib/utils/v2/objectSchema';
import { ymalPriceRange } from '$lib/utils/businessLogic';
import { productType } from '$lib/constants.util';
import { APP_MODE } from '$lib/constants.util';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ fetch, params, url }) => {
	const db = getDB();

	const { handle } = params;
	const query = new URLSearchParams(url.search);
	const store = query.get('store') || 'id';
	const lang = query.get('lang') || 'en';
	const customerId = query.get('customerId') || '';

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

	const productReq = await db
		.collection('Products')
		.find({
			handle
		})
		.toArray();

	const productRes = productReq[0];

	let sort: any = {
		isDiscount: -1,
		isNewArrival: -1,
		isReadyStock: -1,
		isPreOrderWithPrice: -1,
		isPreOrder: -1,
		isSoldOut: -1 // Sort by priority
	};

	const selectedPrice = Number(productRes.price);

	const { minPrice, maxPrice } = ymalPriceRange({ productPrice: selectedPrice });

	const filter: any = {
		productType: {
			$eq: productRes.productType
		},
		country: {
			$eq: productRes.country
		},
		title: {
			$not: {
				$regex: /(FREEBIE|GIFT)/i
			}
		},
		handle: {
			$not: {
				$eq: productRes.handle
			}
		},
		brand: {
			$not: {
				$eq: productRes.brand
			}
		}
	};

	const priceFilter: any = {
		$gte: minPrice,
		$lte: maxPrice
	};

	if (maxPrice) {
		priceFilter['$lte'] = maxPrice;
	} else {
		delete priceFilter.$lte;
	}

	if (productRes.productType.toLowerCase() === productType.BEAUTY) {
		const type = ['makeup', 'skincare', 'hair care', 'bath & body', 'fragrance', 'gift set'];

		const makeupExist = productRes.collections.findIndex((x: any) => {
			return type.includes(x.title.toLowerCase());
		});

		filter['collections'] = {
			$elemMatch: {
				$or: [{ title: productRes.collections[makeupExist].title }]
			}
		};
	}

	filter['price'] = priceFilter;
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
					// category: {
					// 	$switch: {
					// 		branches: [
					// 			{
					// 				case: {
					// 					$and: [
					// 						{ $eq: ["$discount", true] },
					// 						{ $gte: ["$totalInventory", 0] },
					// 						{ $eq: ["$availableForSale", true] }
					// 					]
					// 				},
					// 				then: "Special Price"
					// 			},
					// 			{
					// 				case: {
					// 					$and: [
					// 						{ $gt: ["$totalInventory", 0] },
					// 						{ $eq: ["$availableForSale", true] },
					// 						{ $not: { $in: ["Pre-Order", "$tag"] } },
					// 						{ $not: { $in: ["PO with Price", "$tag"] } },
					// 						{ $not: { $in: ["Sold Out", "$tag"] } }
					// 					]
					// 				},
					// 				then: "New Arrival"
					// 			},
					// 			{
					// 				case: {
					// 					$and: [
					// 						{ $eq: ["$availableForSale", true] },
					// 						{ $not: { $in: ["Pre-Order", "$tag"] } },
					// 						{ $not: { $in: ["PO with Price", "$tag"] } },
					// 						{ $not: { $in: ["Sold Out", "$tag"] } }
					// 					]
					// 				},
					// 				then: "Stock Product"
					// 			},
					// 			{
					// 				case: { $in: ["PO with Price", "$tag"] },
					// 				then: "Pre-Order With Price"
					// 			},
					// 			{
					// 				case: { $in: ["Pre-Order", "$tag"] },
					// 				then: "Pre-Order"
					// 			},
					// 			{
					// 				case: { $and: [{ $eq: ["$availableForSale", false] }, { $in: ["Sold Out", "$tag"] }] },
					// 				then: "Sold Out"
					// 			}
					// 		],
					// 		default: "Uncategorized"
					// 	}
					// }
				}
			},
			// {
			// 	$addFields: {
			// 		categorySortOrder: {
			// 			$switch: {
			// 				branches: [
			// 					{ case: { $eq: ["$category", "Special Price"] }, then: 1 },
			// 					{ case: { $eq: ["$category", "New Arrival"] }, then: 2 },
			// 					{ case: { $eq: ["$category", "Stock Product"] }, then: 3 },
			// 					{ case: { $eq: ["$category", "Pre-Order With Price"] }, then: 4 },
			// 					{ case: { $eq: ["$category", "Pre-Order"] }, then: 5 },
			// 					{ case: { $eq: ["$category", "Sold Out"] }, then: 6 }
			// 				],
			// 				default: 7
			// 			}
			// 		}
			// 	}
			// },
			// DO NOT DELETE (CANNOT BE USE DUE TO ATLAST TIER LEVEL)
			// {
			// 	$addFields: {
			// 		label: {
			// 			$function: {
			// 				body: function (tag: string[], totalInventory: number, updatedAt: string, productType: string, availableForSale: boolean, discountPrice: any) {
			// 					const sale = discountPrice && !tag.includes('Sold Out');
			// 					console.log(discountPrice);

			// 					return showLabelProduct({
			// 						tag: tag,
			// 						totalInventory: totalInventory,
			// 						sale,
			// 						updateTime: updatedAt,
			// 						type: productType,
			// 						openForSale: availableForSale
			// 					})
			// 				},
			// 				args: ["$tag", "$totalInventory", "updatedAt", "productType", "availableForSale", "discountPrice"], // Pass fields to the function
			// 				lang: "js"
			// 			}
			// 		}
			// 	}
			// },
			{
				$match: filter
			},
			{ $sort: sort },
			{ $skip: 0 },
			{ $limit: 30 }
		])
		.toArray();

	const convertedProduct: any[] = products.map((product) =>
		convertProductMongoToCardProduct({ product, store, lang, wishlists: wishlistProducts })
	);

	return json(convertedProduct);
};
