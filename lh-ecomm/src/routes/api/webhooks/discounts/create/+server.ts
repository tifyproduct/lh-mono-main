import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

export const POST: RequestHandler = async ({ request, fetch }) => {
	if (!request.body) {
		return json({});
	}

	const body = await request.json();

	console.log({ body });

	if (!body.admin_graphql_api_id) {
		return json({});
	}

	const discountID = body.admin_graphql_api_id;

	const response = await fetch(`/api/admin/graphql.json`, {
		method: 'POST',
		body: JSON.stringify({
			query: `query DiscountNodeQuery($id: ID!, $limit: Int = 50) {
								discountNode(id: $id) {
									id
									discount {
										__typename
										... on DiscountAutomaticBxgy {
											id
											title
											status
											summary
											discountClass
											customerGets {
												value {
													... on DiscountOnQuantity {
														__typename
														effect
														quantity {
															quantity
														}
													}
												}
												items {
													... on DiscountCollections {
														__typename
														collections(first: $limit) {
															nodes {
																products(first: $limit) {
																	nodes {
																		variants(first: $limit) {
																			nodes {
																				id
																				title
																			}
																		}
																	}
																}
															}
														}
													}
													... on DiscountProducts {
														__typename
														products(first: $limit) {
															nodes {
																id
																variants(first: $limit) {
																	nodes {
																		id
																	}
																}
															}
														}
														productVariants(first: $limit) {
															nodes {
																id
																title
															}
														}
													}
												}
											}
											customerBuys {
												items {
													... on DiscountProducts {
														__typename
														products(first: $limit) {
															nodes {
																id
																variants(first: $limit) {
																	nodes {
																		id
																	}
																}
															}
														}
													}
													... on AllDiscountItems {
														__typename
														allItems
													}
													... on DiscountCollections {
														__typename
														collections(first: $limit) {
															nodes {
																id
																handle
															}
														}
													}
												}
												value {
													... on DiscountPurchaseAmount {
														__typename
														amount
													}
													... on DiscountQuantity {
														__typename
														quantity
													}
												}
											}
										}
										... on DiscountAutomaticBasic {
											endsAt
											title
										}
										... on DiscountCodeBasic {
											codes(first: $limit) {
												edges {
													node {
														id
														code
													}
												}
											}
											title
											summary
											status
											startsAt
											discountClass
											shortSummary
											endsAt
											customerGets {
												items {
													... on DiscountCollections {
														__typename
														collections(first: $limit) {
															nodes {
																handle
																products(first: $limit) {
																	nodes {
																		handle
																	}
																}
															}
														}
													}
												}
											}
										}
										... on DiscountAutomaticApp {
											endsAt
											title
										}
										... on DiscountCodeFreeShipping {
											endsAt
											recurringCycleLimit
											codes(first: $limit) {
												nodes {
													code
													id
												}
											}
											title
											shortSummary
											summary
											status
											startsAt
											discountClass
											maximumShippingPrice {
												amount
												currencyCode
											}
											minimumRequirement {
												... on DiscountMinimumQuantity {
													__typename
													greaterThanOrEqualToQuantity
												}
												... on DiscountMinimumSubtotal {
													__typename
													greaterThanOrEqualToSubtotal {
														amount
														currencyCode
													}
												}
											}
										}
									}
								}
							}`,
			variables: {
				id: discountID
			}
		})
	});

	const discountResponse = await response.json();

	console.log(JSON.stringify(discountResponse.data, null, 2));

	if (discountResponse.data.discountNode === null) {
		return json({
			message: 'Discount not found. skipping...'
		});
	}

	const discount = discountResponse.data.discountNode.discount;
	const discountType = discount.__typename;

	const db = getDB();

	switch (discountType) {
		case 'DiscountAutomaticBxgy': {
			const customerBuysProducts: Array<string> = [];
			const customerBuysCollections: Array<string> = [];

			let minimumQty: number = 0;
			let minimumSpend: number = 0;

			switch (discount.customerBuys.items.__typename) {
				case 'DiscountProducts':
					discount.customerBuys.items.products.nodes.forEach((product) => {
						product.variants.nodes.forEach((variant) => {
							customerBuysProducts.push(variant.id);
						});
					});

					break;

				case 'DiscountCollections':
					discount.customerBuys.items.collections.nodes.forEach((collection) => {
						customerBuysCollections.push(collection.id);
					});

					break;
			}

			if (discount.customerBuys.value) {
				const discountCustomerBuysValue = discount.customerBuys.value;

				switch (discountCustomerBuysValue.__typename) {
					case 'DiscountPurchaseAmount':
						minimumSpend = parseFloat(discountCustomerBuysValue.amount);
						break;

					case 'DiscountQuantity':
						minimumQty = parseFloat(discountCustomerBuysValue.quantity);
						break;
				}
			}

			// const customerGet = discount.customerGets.items.products.nodes[0].variants.nodes[0].id;
			const status = discount.status;
			const customerGets: Array<string> = [];
			let customerGetsQty = 1;

			switch (discount.customerGets.items.__typename) {
				case 'DiscountCollections':
					discount.customerGets.items.collections?.nodes.forEach((collection) => {
						collection.products.nodes.forEach((product) => {
							product.variants.nodes.forEach((variant) => {
								customerGets.push(variant.id);
							});
						});
					});
					break;

				case 'DiscountProducts':
					discount.customerGets.items.products?.nodes.forEach((product) => {
						product.variants.nodes.forEach((variant) => {
							customerGets.push(variant.id);
						});
					});
					break;
			}

			if (discount.customerGets.value?.quantity?.quantity) {
				customerGetsQty = parseInt(discount.customerGets.value?.quantity?.quantity);
			}

			const result = await db.collection('PromotionsBuyXGetY').updateOne(
				{
					discountID
				},
				{
					$set: {
						discountID,
						title: discount.title,
						status,
						customerBuysCollections,
						customerBuysProducts,
						minimumQty,
						minimumSpend,
						customerGets,
						customerGetsQty
					}
				},
				{
					upsert: true
				}
			);

			return json({ result, status, customerBuysCollections, customerBuysProducts, customerGets });
		}

		case 'DiscountCodeBasic': {
			const customerBuys: Array<string> = [];

			discount.customerGets?.items?.collections?.nodes.forEach((collection) => {
				collection.products.nodes.forEach((product) => {
					customerBuys.push(product.handle);
				});
			});

			const resultDiscount = await db.collection('Promotions').updateOne(
				{
					id: discountID
				},
				{
					$set: {
						id: discountID,
						title: discount.shortSummary,
						description: discount.summary,
						code: discount.title,
						status: discount.status,
						startsAt: discount.endsAt ? new Date(discount.startsAt) : null,
						endsAt: discount.endsAt ? new Date(discount.endsAt) : null,
						customerBuys
					}
				},
				{
					upsert: true
				}
			);

			return json(resultDiscount);
		}

		case 'DiscountCodeFreeShipping': {
			const shippingDiscount = await db.collection('Promotions').updateOne(
				{
					id: discountID
				},
				{
					$set: {
						id: discountID,
						title: discount.shortSummary,
						description: discount.summary,
						code: discount.title,
						status: discount.status,
						startsAt: discount.startsAt,
						endsAt: discount.endsAt
					}
				},
				{
					upsert: true
				}
			);

			return json(shippingDiscount);
		}
	}
};
