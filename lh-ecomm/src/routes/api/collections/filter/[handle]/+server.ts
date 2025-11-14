import { env } from '$env/dynamic/private';
import { APP_MODE } from '$lib/constants.util';
import { getDB } from '$lib/server/db';
import { convertProductMongoToCardProduct } from '$lib/utils/v2/objectSchema';
import { error, json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, fetch, locals, url, params }) => {
	const db = getDB();

	if (!request.body) {
		return json({});
	}

	const body = await request.json();

	const { handle } = params;

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

	if (body.filter?.length > 0) {
		body.filter.forEach((x: any) => {
			if (x.field === 'availability') {
				if (x.value === 'Ready Stock') {
					collection?.rules.push({
						column: 'totalInventory',
						relation: 'greater_than',
						condition: 0
					});
					collection?.rules.push({ column: 'tag', relation: 'not_equals', condition: 'Sold Out' });
					collection?.rules.push({ column: 'tag', relation: 'not_equals', condition: 'Pre-Order' });
					collection?.rules.push({
						column: 'tag',
						relation: 'not_equals',
						condition: 'PO with Price'
					});
				} else if (x.value === 'Pre-Order') {
					collection?.rules.push({ column: 'tag', relation: 'equals', condition: 'Pre-Order' });
				} else if (x.value === 'PO with Price') {
					collection?.rules.push({ column: 'tag', relation: 'equals', condition: 'PO with Price' });
				} else if (x.value === 'Sold Out') {
					collection?.rules.push({ column: 'tag', relation: 'equals', condition: 'Sold Out' });
				}
			} else {
				collection?.rules.push({ column: x.field, relation: x.relation, condition: x.value });
			}
		});
	}

	let query: any = {};
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
				if (columnGroups[column][0]['$eq']) {
					query['brandLowerCase'] = { $eq: columnGroups[column][0]['$eq'].toLowerCase() };
				} else {
					query['brandLowerCase'] = { $ne: columnGroups[column][0]['$ne'].toLowerCase() };
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

	const filter = await db
		.collection('Products')
		.aggregate([
			{
				$addFields: {
					price: { $toDouble: '$price' }, // Convert the price field to double
					discountPrice: { $toDouble: '$discountPrice' }, // Convert the price field to double
					brandLowerCase: { $toLower: '$brand' }, // Create a lowercase version of the `name` field
					case_size: {
						$arrayElemAt: [
							{
								$filter: {
									input: '$specifications',
									as: 'spec',
									cond: { $eq: ['$$spec.key', 'case_size'] }
								}
							},
							0
						]
					},
					hardware: {
						$arrayElemAt: [
							{
								$filter: {
									input: '$specifications',
									as: 'spec',
									cond: { $eq: ['$$spec.key', 'hardware'] }
								}
							},
							0
						]
					}
				}
			},
			{ $match: query },
			{
				$group: {
					_id: null,
					caseSize: { $addToSet: '$case_size.value' },
					hardware: { $addToSet: '$hardware.value' },
					brands: { $addToSet: '$brand' },
					years: { $addToSet: '$year' },
					conditions: { $addToSet: '$condition' },
					types: { $addToSet: '$productTypeRaw' },
					caseMaterial: { $addToSet: '$caseMaterial' },
					leatherMaterial: { $addToSet: '$leatherMaterial' },
					jewelryMaterial: { $addToSet: '$jewelryMaterial' },
					clasp: { $addToSet: '$clasp' },
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' },
					specifications: { $addToSet: '$specifications' },
					gender: { $addToSet: '$gender' }
				}
			}
		])
		.toArray();

	const isLeatherMaterialTypoEnabled = JSON.parse(env.VITE_FEATURE_FLAG).leatherMaterialTypo;

	return json({
		filter: [
			{
				key: 'availability',
				label: 'Availability',
				type: 'checkbox',
				value: ['Ready Stock', 'PO with Price', 'Pre-Order', 'Sold Out']
			},
			{
				key: 'vendor',
				label: 'Brand',
				type: 'checkbox',
				value: filter[0].brands.filter((x) => x !== null).sort()
			},
			{
				key: 'caseMaterial',
				label: 'Case Material',
				type: 'checkbox',
				value: filter[0].caseMaterial.filter((x) => x !== null).sort()
			},
			{
				key: 'condition',
				label: 'Condition',
				type: 'checkbox',
				value: filter[0].conditions.filter((x) => x !== null).sort()
			},
			{
				key: 'clasp',
				label: 'Clasp',
				type: 'checkbox',
				value: filter[0].clasp.filter((x) => x !== null).sort()
			},
			{
				key: 'leatherMaterial',
				label: isLeatherMaterialTypoEnabled ? 'Leather Material' : 'Lether Material',
				type: 'checkbox',
				value: filter[0].leatherMaterial.filter((x) => x !== null).sort()
			},
			{
				key: 'jewelryMaterial',
				label: 'Jewelry Material',
				type: 'checkbox',
				value: filter[0].jewelryMaterial.filter((x) => x !== null).sort()
			},
			{
				key: 'gender',
				label: 'Gender',
				type: 'checkbox',
				value: filter[0].gender.filter((x) => x !== null).sort()
			},
			{
				key: 'caseSize',
				label: 'Diameter Size',
				type: 'checkbox',
				value: filter[0].caseSize.filter((x) => x !== null).sort()
			},
			{
				key: 'type',
				label: 'Product Type',
				type: 'checkbox',
				value: filter[0].types.filter((x) => x !== null).sort()
			},
			{
				key: 'price',
				label: 'Price',
				type: 'range',
				value: [
					{
						minPrice:
							Number(filter[0].minPrice) < Number(filter[0].maxPrice)
								? filter[0].minPrice
								: filter[0].maxPrice
					},
					{
						maxPrice:
							Number(filter[0].minPrice) > Number(filter[0].maxPrice)
								? filter[0].minPrice
								: filter[0].maxPrice
					}
				]
			}
		],
		sort: [
			{
				key: 'price',
				label: 'Price, High to Low',
				value: 'desc'
			},
			{
				key: 'price',
				label: 'Price, Low to High',
				value: 'asc'
			},
			{
				key: 'title',
				label: 'Alphabetical, A - Z',
				value: 'asc'
			},
			{
				key: 'title',
				label: 'Alphabetical, Z - A',
				value: 'desc'
			},
			{
				key: 'publishedAt',
				label: 'Latest',
				value: 'desc'
			}
			// incase need to be restored
			// {
			// 	key: 'publishedAt',
			// 	label: 'Older',
			// 	value: 'asc'
			// }
		]
	});
};
