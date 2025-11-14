import { env } from '$env/dynamic/private';
import { APP_MODE } from '$lib/constants.util';
import { getDB } from '$lib/server/db';
import { convertProductMongoToCardProduct } from '$lib/utils/v2/objectSchema';
import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch, locals, url, params }) => {
	const db = getDB();

	if (!request.body) {
		return json({});
	}

	const body = await request.json();

	const { handle } = params;

	let wishlistProducts: string[] = [];

	if (locals?.userId) {
		const wishlistCustomer = await fetch(`/api/customer/wishlist`, {
			method: 'GET'
		});

		const wishlists = await wishlistCustomer.json();

		wishlistProducts = wishlists.list;
	}

	const collection = await db.collection('Collections').findOne({
		handle
	});

	if (collection && !collection?.rules) {
		collection['rules'] = [{ column: 'collections', relation: 'equals', condition: handle }];
	}

	collection?.rules.push({
		column: 'country',
		relation: 'equals',
		condition: body.store === 'id' ? 'indonesia' : 'singapore'
	});

	collection?.rules.push({ column: 'title', relation: 'not_contains', condition: 'FREEBIE' });

	body.filter.forEach((x: any) => {
		if (x.field === 'availability') {
			if (x.value === 'Ready Stock') {
				collection?.rules.push({ column: 'isDiscount', relation: 'equals', condition: true });
				collection?.rules.push({ column: 'isNewArrival', relation: 'equals', condition: true });
				collection?.rules.push({ column: 'isReadyStock', relation: 'equals', condition: true });
			} else if (x.value === 'Pre-Order') {
				collection?.rules.push({ column: 'isPreOrder', relation: 'equals', condition: true });
			} else if (x.value === 'PO with Price') {
				collection?.rules.push({
					column: 'isPreOrderWithPrice',
					relation: 'equals',
					condition: true
				});
			} else if (x.value === 'Sold Out') {
				collection?.rules.push({ column: 'isSoldOut', relation: 'equals', condition: true });
			}
		} else {
			collection?.rules.push({ column: x.field, relation: x.relation, condition: x.value });
		}
	});

	let query: any = {};
	let sort: any = {};
	let sortDefault: any = {
		isSoldOut: 1,
		isNewArrival: -1,
		isReadyStock: -1,
		isDiscount: 1,
		isPreOrder: 1,
		isPreOrderWithPrice: 1
	};

	const isFeatureFlagged = JSON.parse(env.VITE_FEATURE_FLAG).sortCollection;
	if (body.sort && body.sort.length) {
		body.sort.forEach((x: any) => {
			if (x.field === 'price') {
				sort = {
					isSoldOut: 1,
					[isFeatureFlagged ? 'isCountedAsPreOrder' : 'isPreOrder']: 1,
					['finalPrice']: x.value === 'asc' ? 1 : -1
				};
			} else {
				sort = {
					// this will sort the po, po with price first, sold out product
					// in last row before [x.field] key run
					isSoldOut: 1,
					[x.field]: x.value === 'asc' ? 1 : -1
				};
			}
		});
	} else {
		sort = {
			...sortDefault
		};
	}

	const columnGroups: Record<string, any[]> = {}; // Group rules by column

	// Group rules by column
	collection?.rules.forEach((rule: { column: string; relation: string; condition: string }) => {
		if (!columnGroups[rule.column]) {
			columnGroups[rule.column] = [];
		}

		const condition: any = {};

		if (rule.relation === 'not_equals') {
			condition.$ne = rule.condition;
		} else if (rule.relation === 'not_contains') {
			condition.$not = rule.condition;
		} else if (rule.relation === 'contains') {
			condition.$regex = rule.condition;
			condition.$options = 'i';
		} else if (rule.relation === 'equals') {
			condition.$eq = rule.condition;
		} else if (rule.relation === 'greater_than') {
			condition.$gte = parseFloat(rule.condition);
		} else if (rule.relation === 'less_than') {
			condition.$lte = parseFloat(rule.condition);
		}

		columnGroups[rule.column].push(condition);
	});

	const priceIdx = collection?.rules.find((x: any) => x.column === 'price');
	const variantPriceIdx = collection?.rules.find((x: any) => x.column === 'variant_price');

	if (priceIdx && priceIdx !== -1) {
		delete columnGroups.variant_price;
	} else if (variantPriceIdx && variantPriceIdx !== -1) {
		columnGroups['price'] = columnGroups.variant_price;
		delete columnGroups.variant_price;
	}

	Object.keys(columnGroups).forEach((column) => {
		const conditions = columnGroups[column];
		const eqConditions = conditions
			.filter((cond) => cond.$eq !== undefined)
			.map((cond) => ({ $eq: cond.$eq }));
		const neConditions = conditions
			.filter((cond) => cond.$ne !== undefined)
			.map((cond) => cond.$ne);

		if (columnGroups[column].length === 1) {
			if (column === 'vendor') {
				if(columnGroups[column][0]['$eq']) {
					query['brandLowerCase'] = { '$eq': columnGroups[column][0]['$eq'].toLowerCase()};
				} else {
					query['brandLowerCase'] = { '$ne': columnGroups[column][0]['$ne'].toLowerCase()};
				}
			} else if (column === 'type') {
				query['productTypeRaw'] = columnGroups[column][0];
			} else if (column === 'caseSize') {
				query['specifications'] = {
					$elemMatch: { key: 'case_size', value: columnGroups[column][0].$eq }
				};
			} else if (column === 'collections') {
				query['collections'] = { $elemMatch: { handle: columnGroups[column][0].$eq } };
			} else if (column === 'title') {
				if (columnGroups[column][0].$not) {
					query['title'] = {
						$not: {
							$regex: columnGroups[column][0].$not,
							$options: 'i'
						}
					};
				} else {
					query['title'] = columnGroups[column][0];
				}
			} else if (column === 'tag') {
				const values = eqConditions.map((condition) => condition['$eq']);

				query['tag'] = { $in: values };
			} else if (column === 'isPreOrder') {
				query['$or'] = query['$or']
					? [...query['$or'], { isPreOrder: columnGroups[column][0] }]
					: [{ isPreOrder: columnGroups[column][0] }];
			} else if (column === 'isSoldOut') {
				query['$or'] = query['$or']
					? [...query['$or'], { isSoldOut: columnGroups[column][0] }]
					: [{ isSoldOut: columnGroups[column][0] }];
			} else if (column === 'isDiscount') {
				query['$or'] = query['$or']
					? [...query['$or'], { isDiscount: columnGroups[column][0] }]
					: [{ isDiscount: columnGroups[column][0] }];
			} else if (column === 'isNewArrival') {
				query['$or'] = query['$or']
					? [...query['$or'], { isNewArrival: columnGroups[column][0] }]
					: [{ isNewArrival: columnGroups[column][0] }];
			} else if (column === 'isReadyStock') {
				query['$or'] = query['$or']
					? [...query['$or'], { isReadyStock: columnGroups[column][0] }]
					: [{ isReadyStock: columnGroups[column][0] }];
			} else if (column === 'isPreOrderWithPrice') {
				query['$or'] = query['$or']
					? [...query['$or'], { isPreOrderWithPrice: columnGroups[column][0] }]
					: [{ isPreOrderWithPrice: columnGroups[column][0] }];
			} else {
				query[column] = columnGroups[column][0];
			}
		} else {
			if (column === 'price') {
				columnGroups[column].forEach((data, index) => {
					query[column] = { ...query[column], ...columnGroups[column][index] };
				});
			} else if (column === 'type') {
				if (eqConditions.length > 0 && neConditions.length > 0) {
					const values = eqConditions.map((condition) => condition['$eq']);

					// Combine $eq and $nin using $and
					query['productTypeRaw'] = {
						$in: values,
						$nin: neConditions
					};
				} else if (eqConditions.length > 0) {
					// Only $eq conditions
					query['productTypeRaw'] =
						eqConditions.length === 1 ? eqConditions[0] : { $or: eqConditions };
				} else if (neConditions.length > 0) {
					// Only $ne conditions
					query['productTypeRaw'] = { $nin: neConditions };
				}
			} else if (column === 'vendor') {
				if (eqConditions.length > 0 && neConditions.length > 0) {
					const values = eqConditions.map((condition) => condition['$eq'].toLowerCase());
					const neConditionsValues = neConditions.map((condition) => condition.toLowerCase());

					// Combine $eq and $nin using $and
					query['brandLowerCase'] = {
						$in: values,
						$nin: neConditionsValues
					};
				} else if (eqConditions.length > 0) {
					const values = eqConditions.map((condition) => condition['$eq'].toLowerCase());
					// Only $eq conditions
					query['brandLowerCase'] = eqConditions.length === 1 ? eqConditions[0] : { $in: values };
				} else if (neConditions.length > 0) {
					const neConditionsValues = neConditions.map((condition) => condition.toLowerCase());
					// Only $ne conditions
					query['brandLowerCase'] = { $nin: neConditionsValues };
				}
			} else if (column === 'title') {
				const eqRegex = conditions
					.map((condition) => {
						if (condition['$regex']) {
							return {
								title: {
									$regex: condition['$regex'],
									$options: 'i'
								}
							};
						}
					})
					.filter((x) => x);

				const neqRegex = conditions
					.map((condition) => {
						if (condition['$not']) {
							return {
								title: {
									$not: {
										$regex: condition['$not'],
										$options: 'i'
									}
								}
							};
						}
					})
					.filter((x) => x);

				if (eqRegex.length && neqRegex.length) {
					query['$and'] = [
						{
							$or: [...eqRegex]
						}
					];

					neqRegex.forEach((x) => query['$and'].push(x));
				} else if (neqRegex.length) {
					query['$and'] = [];

					neqRegex.forEach((x) => query['$and'].push(x));
				} else if (eqRegex.length) {
					query['$and'] = [...eqRegex];
				}
			} else {
				if (eqConditions.length > 0 && neConditions.length > 0) {
					const values = eqConditions.map((condition) => condition['$eq']);

					// Combine $eq and $nin using $and
					query[column] = {
						$in: values,
						$nin: neConditions
					};
				} else if (eqConditions.length > 0) {
					const values = eqConditions.map((condition) => condition['$eq']);
					// Only $eq conditions
					query[column] = eqConditions.length === 1 ? eqConditions[0] : { $in: values };
				} else if (neConditions.length > 0) {
					// Only $ne conditions
					query[column] = { $nin: neConditions };
				}
			}
		}
	});

	if (env.MODE === APP_MODE.PROD) {
		query['isLive'] = { $eq: true };
	}

	const sizeReq = body.pageSize || 20;
	const skipItemReq = body.page ? (body.page - 1) * sizeReq : 0;

	const products = await db
		.collection('Products')
		.aggregate([
			{
				$addFields: {
					price: { $toDouble: '$price' }, // Convert the price field to double
					discountPrice: { $toDouble: '$discountPrice' }, // Convert the price field to double
					// will use the discountPrice if isDiscount, used to sort
					// by the price
					finalPrice: {
						$toDouble: {
							$cond: [{ $eq: ['$isDiscount', true] }, '$discountPrice', '$price']
						}
					},
					brandLowerCase: { $toLower: "$brand" }, // Create a lowercase version of the `name` field
					// will use the isCountedAsPreOrder to sort
					// the product which have isPreOrder flag
					// but price > 0 (counted as normal but still have
					// pre order tag )
					isCountedAsPreOrder: {
						$cond: [
							{
								$and: [{ $eq: ['$isPreOrder', true] }, { $eq: ['$price', '0.0'] }]
							},
							true,
							false
						]
					}
					// category: {
					// 	$switch: {
					// 		branches: [
					// 			{
					// 				case: {
					// 					$and: [
					// 						{ $eq: ['$discount', true] },
					// 						{ $gte: ['$totalInventory', 0] },
					// 						{ $eq: ['$availableForSale', true] }
					// 					]
					// 				},
					// 				then: 'Special Price'
					// 			},
					// 			{
					// 				case: {
					// 					$and: [
					// 						{ $gt: ['$totalInventory', 0] },
					// 						{ $eq: ['$availableForSale', true] },
					// 						{ $not: { $in: ['Pre-Order', '$tag'] } },
					// 						{ $not: { $in: ['PO with Price', '$tag'] } },
					// 						{ $not: { $in: ['Sold Out', '$tag'] } }
					// 					]
					// 				},
					// 				then: 'New Arrival'
					// 			},
					// 			{
					// 				case: {
					// 					$and: [
					// 						{ $eq: ['$availableForSale', true] },
					// 						{ $not: { $in: ['Pre-Order', '$tag'] } },
					// 						{ $not: { $in: ['PO with Price', '$tag'] } },
					// 						{ $not: { $in: ['Sold Out', '$tag'] } }
					// 					]
					// 				},
					// 				then: 'Stock Product'
					// 			},
					// 			{
					// 				case: { $in: ['PO with Price', '$tag'] },
					// 				then: 'Pre-Order With Price'
					// 			},
					// 			{
					// 				case: { $in: ['Pre-Order', '$tag'] },
					// 				then: 'Pre-Order'
					// 			},
					// 			{
					// 				case: {
					// 					$and: [{ $eq: ['$availableForSale', false] }, { $in: ['Sold Out', '$tag'] }]
					// 				},
					// 				then: 'Sold Out'
					// 			}
					// 		],
					// 		default: 'Uncategorized'
					// 	}
					// }
				}
			},
			{ $match: query },
			{ $sort: sort },
			{ $skip: skipItemReq },
			{ $limit: sizeReq }
		])
		.toArray();

	const totalProduct = await db
		.collection('Products')
		.aggregate([
			{
				$addFields: {
					price: { $toDouble: '$price' }, // Convert the price field to double
					brandLowerCase: { $toLower: "$brand" }, // Create a lowercase version of the `name` field
				}
			},
			{ $match: query },
			{ $count: 'countProducts' }
		])
		.next();

	const items = products.map((product: any) =>
		convertProductMongoToCardProduct({
			product,
			store: body.store,
			lang: body.lang,
			wishlists: wishlistProducts
		})
	);

	return json({
		count: totalProduct?.countProducts || 0,
		currentPage: body.page || 1,
		totalPage: Math.ceil(totalProduct?.countProducts / sizeReq) || 0,
		items: items
	});
};
