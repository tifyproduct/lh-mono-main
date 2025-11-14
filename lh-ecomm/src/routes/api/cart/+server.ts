import { error, json, type RequestHandler, type Cookies } from '@sveltejs/kit';
import { CART_COOKIES_NAME } from '$lib/constants.util';
import { getDB } from '$lib/server/db';
import { 
	checkAndGenerateCustomerShopifyData,
	createCustomerAccessTokenShopify
 } from '$lib/server/services/shopify';
import { getUserById, updateUserShopifyData } from '$lib/server/collections/user';
import { generateJWTToken, setAuthToken } from '$lib/utils/auth';
import { getFeatureFlagsServerSide } from '$lib/utils/getFeatureFlagsServerSide';

interface CartLine {
	merchandiseId: string;
	quantity: number;
}

interface UpsertCartVariable {
	customerAccessToken?: string;
	cartId?: string;
	lines?: Array<CartLine>;
}

interface UserError {  
    code: string;  
    field: string[];  
    message: string;  
} 


const addToCartQuery = `mutation AddToCartMutation($customerAccessToken: String!, $lines: [CartLineInput!]!) {
	cartCreate(input: {buyerIdentity: {customerAccessToken: $customerAccessToken}, lines: $lines}) {
		cart {
			id
			cost {
				totalAmount {
					amount
				}
				subtotalAmount {
					amount
				}
			}
			lines(first: 250) {
				nodes {
					... on CartLine {
						id
						quantity
						merchandise {
							... on ProductVariant {
								id
								product {
									collections(first: 50) {
										nodes {
											id
										}
									}
								}
							}
						}
					}
				}
			}
		}
		userErrors {
			code
			field
			message
		}
	}
}`;

const updateCartQuery = `mutation cartLinesAddMutation($cartId: ID!, $lines: [CartLineInput!]!) {
	cartLinesAdd(cartId: $cartId, lines: $lines) {
		cart {
			id
			cost {
				totalAmount {
					amount
				}
				subtotalAmount {
					amount
				}
			}
			lines(first: 250) {
				nodes {
					... on CartLine {
						id
						quantity
						merchandise {
							... on ProductVariant {
								id
								product {
									collections(first: 50) {
										nodes {
											id
										}
									}
								}
							}
						}
					}
				}
			}
		}
		userErrors {
			code
			field
			message
		}
	}
}`;

const cartLinesAddMutation = `mutation CartLinesAddMutation($cartId: ID!, $lines: [CartLineInput!]!) {
		cartLinesAdd(
			cartId: $cartId
			lines: $lines
		) {
			cart {
				id
				cost {
					totalAmount {
						amount
					}
					subtotalAmount {
						amount
					}
				}
				lines(first: 250) {
					nodes {
						... on CartLine {
							id
							quantity
							merchandise {
								... on ProductVariant {
									id
									product {
										collections(first: 50) {
											nodes {
												id
											}
										}
									}
								}
							}
						}
					}
				}
			}
			userErrors {
				code
				field
				message
			}
		}
	}`;

const removeCartLineMutation = `mutation CartLinesRemoveMutation($cartId: ID!, $lineIds: [ID!]!) {
	cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
		cart {
			id
			cost {
				totalAmount {
					amount
				}
				subtotalAmount {
					amount
				}
			}
			lines(first: 250) {
				nodes {
					... on CartLine {
						id
						quantity
						merchandise {
							... on ProductVariant {
								id
								product {
									collections(first: 50) {
										nodes {
											id
										}
									}
								}
							}
						}
					}
				}
			}
		}
		userErrors {
			code
			field
			message
		}
	}
}`;

const updateCartMutation = `mutation CartLinesUpdateMutation($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
	cartLinesUpdate(cartId: $cartId, lines: $lines) {
		cart {
			id
			cost {
				totalAmount {
					amount
				}
				subtotalAmount {
					amount
				}
			}
			lines(first: 250) {
				nodes {
					... on CartLine {
						id
						quantity
						merchandise {
							... on ProductVariant {
								id
								product {
									collections(first: 50) {
										nodes {
											id
										}
									}
								}
							}
						}
					}
				}
			}
		}
		userErrors {
			code
			field
			message
		}
	}
}`;
/**
 * Add to cart endpoint
 * @param fetch
 * @param request
 * @constructor
 */

const transformCart = (cart) => {
	if (cart?.deliveryGroups && cart?.deliveryGroups?.nodes.length > 0) {
		let shippingCost = 0;

		for (const deliveryGroup of cart.deliveryGroups.nodes) {
			if (deliveryGroup.selectedDeliveryOption) {
				shippingCost += parseFloat(deliveryGroup.selectedDeliveryOption.estimatedCost?.amount) || 0;
			}
		}

		cart.shippingCost = shippingCost.toFixed(1);
	}

	return cart;
};
export const POST: RequestHandler = async ({ fetch, request, cookies, locals }) => {
    const userId = locals.userId

	if (!userId) {
		error(403, {
			message: 'Unauthorized. Please login before add to cart'
		});
	}
	let token: string
    const userShopifyToken = locals.userShopifyToken
	const userShopifyId = locals.userShopifyId
	try {
		const customerShopifyData = await checkAndGenerateCustomerShopifyData(
			cookies,
			userId,
			userShopifyId,
			userShopifyToken
		)
		token = customerShopifyData.token || ""
		if (!token) {
            error(401, {
                message: 'Authorization token required.'
            });
		}
	} catch(e) {
        error(500, {
            message: (e as Error).message,
        });
	}
	const body = await request.json();
	const cartLines: CartLine[] = [];

	if (Array.isArray(body)) {
		for (const cartLine of body) {
			if (!cartLine.quantity) {
				throw error(403, 'Quantity is required.');
			}

			if (!cartLine.variantId) {
				throw error(403, 'Variant ID is required');
			}

			cartLines.push({
				merchandiseId: cartLine.variantId,
				quantity: cartLine.quantity
			});
		}
	} else {
		if (!body.quantity) {
			throw error(403, 'Quantity is required.');
		}

		if (!body.variantId) {
			throw error(403, 'Variant ID is required');
		}

		cartLines.push({
			merchandiseId: body.variantId,
			quantity: body.quantity
		});
	}

	const variables: UpsertCartVariable = {
		lines: cartLines,
		customerAccessToken: token
	};

	let cartData;
	const cartCookie = cookies.get(CART_COOKIES_NAME);
	if (cartCookie) {
		// update / add cart lines flow
		delete variables?.customerAccessToken;
		variables.cartId = cartCookie;

		const atcRequest = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: updateCartQuery,
				variables
			})
		});
		const response = await atcRequest.json();
		if (!response.data.cartLinesAdd?.cart && response.data?.cartLinesAdd?.userErrors.length > 0) {
			const errors = response.data?.cartLinesAdd?.userErrors
			console.error("add cart lines shopify error: ", errors);
			error(500, errors.map((error: UserError) => error.message).join(', '));
		}

		cartData = response.data.cartLinesAdd.cart;
	} else {
		// add new cart flows
		const atcRequest = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: addToCartQuery,
				variables
			})
		});
		let response = await atcRequest.json();
		if (!response.data.cartCreate?.cart && response.data?.cartCreate?.userErrors.length > 0) {
			if (response.data.cartCreate.userErrors[0].code === 'INVALID' && response.data.cartCreate.userErrors[0].field.includes('customerAccessToken')) {
				// invalid / expired token flow
				let newToken;
				try {
					newToken = await updateExpiredShopifyToken(userId, cookies)
				} catch(e) {
					console.error("update expired shopify token error: ", e)
					error(500, (e as Error).message)
				}

				variables.customerAccessToken = newToken
				const cartCreateRequest = await fetch('/api/graphql.json', {
					method: 'POST',
					body: JSON.stringify({
						query: addToCartQuery,
						variables
					})
				});
				response = await cartCreateRequest.json();
				if (!response.data.cartCreate?.cart && response.data?.cartCreate?.userErrors.length > 0) {
					const errors = response.data?.cartCreate?.userErrors
					console.error("add cart shopify with updated token error: ", response.data.cartCreate.userErrors);
					error(500, errors.map((error: UserError) => error.message).join(', '));
				}
			} else {
				const errors = response.data?.cartCreate?.userErrors
				console.error("add cart shopify error: ", errors);
				error(500, errors.map((error: UserError) => error.message).join(', '));
			}
		}
		cartData = response.data.cartCreate.cart;
	}

	const featureFlag = getFeatureFlagsServerSide();

	if (featureFlag.isOptimizedCart) {
		await validatePromotionsV2(cartData, fetch);
	} else {
		await validatePromotions(cartData, fetch);
	}

	cookies.set(CART_COOKIES_NAME, cartData.id, {
		path: '/',
		maxAge: 6 * 30 * 24 * 60 * 60 // {months} * {days} * {hours} * {minutes} * {seconds} = 6 months
	});

	return json(cartData);
};

function hasBuyXGetYPrerequisites(cartData: Record<string, any>, promotion: any): boolean {
	const collectionMatched = cartData.lines.nodes.some((cartLine) => {
		return cartLine.merchandise.product?.collections.nodes.some((collection) => {
			return promotion.customerBuysCollections?.includes(collection.id);
		});
	});

	if (collectionMatched && promotion.minimumSpend > 0) {
		return (
			collectionMatched && parseFloat(cartData.cost.totalAmount.amount) > promotion.minimumSpend
		);
	}

	return collectionMatched;
}

async function updateExpiredShopifyToken(userId: string, cookies: Cookies): Promise<string> {
	try {
		const user = await getUserById(userId);
		if (!user) {
            throw new Error("User is not found")
        }

		const newToken = await createCustomerAccessTokenShopify({email: user.email, password: user.email});

		const isTokenUpdated = await updateUserShopifyData(user.id, newToken, null);
        if (!isTokenUpdated) {
            console.error("Failed to update user token");
        }

		const jwtAuth = generateJWTToken(
			{
				userId: user.id,
				shopifyId: user.shopifyId ?? null,
				shopifyToken: newToken
			}
		)
		setAuthToken(cookies, jwtAuth)

		return newToken
	} catch (e){
		const err = e instanceof Error ? e : new Error("Failed to generate new shopify token")
        throw err
	}

}

function hasBuyXGetYItem(cartLines: Array<any>, promotion: any): Array<string> {
	const itemsAlreadyInCart = [];

	for (const cartLine of cartLines) {
		if (
			cartLine.lines?.nodes.some((line) => promotion.customerGets.includes(line.merchandise.id))
		) {
			itemsAlreadyInCart.push(cartLine.id);
		}
	}

	return itemsAlreadyInCart;
}

async function addBuyXGetYItem(
	cartId: string,
	promotionItem: Record<string, any>,
	fetch
): Promise<void | { merchandiseId: string; quantity: number }[]> {
	const featureFlag = getFeatureFlagsServerSide();

	const cartLines: { merchandiseId: string; quantity: number }[] = [];

	for (const customerGet of promotionItem.customerGets) {
		cartLines.push({
			merchandiseId: customerGet,
			// quantity: promotionItem.customerGetsQty
			quantity: 1
		});
	}

	if (featureFlag.isOptimizedCart) {
		return cartLines;
	}

	const atcRequest = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: cartLinesAddMutation,
			variables: {
				cartId,
				lines: cartLines
			}
		})
	});

	return await atcRequest.json();

	// console.log(cartLinesAddMutation, cartId, cartLines);
	// console.log({ atcResponse: JSON.stringify(atcResponse, null, 2) });
}

async function updateBuyXGetYItem(
	cartId: string,
	promotionItem: Record<string, any>,
	fetch
): Promise<void> {
	const cartLines = [];

	for (const customerGet of promotionItem.customerGets) {
		cartLines.push({
			merchandiseId: customerGet,
			quantity: promotionItem.quantity
		});
	}

	const atcRequest = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: cartLinesAddMutation,
			variables: {
				cartId,
				lines: cartLines
			}
		})
	});

	const atcResponse = await atcRequest.json();

	console.log({ atcResponse });
}

async function removeBxGyPromotion(
	cartId: string,
	cartLines: Array<any>,
	promotion: Record<string, any>,
	fetch
) {
	const lineToRemove: Array<string> = [];

	for (const cartLine of cartLines) {
		if (promotion.customerGets?.includes(cartLine.merchandise.id)) {
			lineToRemove.push(cartLine.id);
		}
	}

	const featureFlag = getFeatureFlagsServerSide();

	if (featureFlag.isOptimizedCart) {
		return lineToRemove;
	}

	const request = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: removeCartLineMutation,
			variables: {
				cartId: cartId,
				lineIds: lineToRemove
			}
		})
	});

	return await request.json();
}

async function validatePromotions(cartData, fetch): Promise<void> {
	const db = getDB();

	let alreadyAtHighestTier = false;

	const bxgy = await db
		.collection('PromotionsBuyXGetY')
		.find({ status: 'ACTIVE' })
		.sort({ minimumSpend: -1 })
		.toArray();

	for (const bogoPromotion of bxgy) {
		console.log('removing bxgxpromotions...');

		const cartRemoveResponse = await removeBxGyPromotion(
			cartData.id,
			cartData.lines.nodes,
			bogoPromotion,
			fetch
		);

		console.log('cartRemoveResponse', cartRemoveResponse);

		cartData = cartRemoveResponse.data.cartLinesRemove.cart;

		console.log('removing bxgxpromotions done...', cartData);
	}

	for (const bogoPromotion of bxgy) {
		console.log('adding bxgxpromotions...');
		if (hasBuyXGetYPrerequisites(cartData, bogoPromotion) && !alreadyAtHighestTier) {
			await addBuyXGetYItem(cartData.id, bogoPromotion, fetch);
			alreadyAtHighestTier = true;
		}
		console.log('adding bxgxpromotions done...');
	}
}

async function validatePromotionsV2(cartData, fetch): Promise<void> {
	const db = getDB();

	let alreadyAtHighestTier = false;

	const bxgy = await db
		.collection('PromotionsBuyXGetY')
		.find({ status: 'ACTIVE' })
		.sort({ minimumSpend: -1 })
		.toArray();

	const removeCartLines = [];

	for (const bogoPromotion of bxgy) {
		console.log('removing bxgxpromotions...');

		removeCartLines.push(
			...(await removeBxGyPromotion(cartData.id, cartData.lines.nodes, bogoPromotion, fetch))
		);

		console.log('removing bxgxpromotions done...', cartData);
	}

	await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: removeCartLineMutation,
			variables: {
				cartId: cartData.id,
				lineIds: removeCartLines
			}
		})
	});

	const addBuyCartLines = [];

	for (const bogoPromotion of bxgy) {
		console.log('adding bxgxpromotions...');
		if (hasBuyXGetYPrerequisites(cartData, bogoPromotion) && !alreadyAtHighestTier) {

			addBuyCartLines.push(
				...(await addBuyXGetYItem(cartData.id, bogoPromotion, fetch))
			);
			alreadyAtHighestTier = true;
		}
		console.log('adding bxgxpromotions done...');
	}

	await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: cartLinesAddMutation,
			variables: {
				cartId: cartData.id,
				lines: addBuyCartLines
			}
		})
	});
}

export const PUT: RequestHandler = async ({ fetch, request, cookies }) => {
	const body = await request.json();
	const { lineId, quantity } = body;

	const cartCookie = cookies.get(CART_COOKIES_NAME);

	const featureFlag = getFeatureFlagsServerSide();

	if (!cartCookie) {
		return json({
			message: `cart is empty`
		});
	}

	const updateCartRequest = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: updateCartMutation,
			variables: {
				cartId: cartCookie,
				lines: [
					{
						id: lineId,
						quantity
					}
				]
			}
		})
	});

	const response = await updateCartRequest.json();

	console.log('updateCartResponse: ', JSON.stringify(response));

	const cartData = response.data.cartLinesUpdate.cart;

	if (featureFlag.isOptimizedCart) {
		await validatePromotionsV2(cartData, fetch);
	} else {
		await validatePromotions(cartData, fetch);
	}

	return json(cartData);
};

export const DELETE: RequestHandler = async ({ fetch, cookies, request }) => {
	const body = await request.json();

	const { lineId } = body;

	const cartCookie = cookies.get(CART_COOKIES_NAME);

	if (!cartCookie) {
		return json({
			message: `cart is empty`
		});
	}

	const featureFlag = getFeatureFlagsServerSide();

	const deleteCartRequest = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: removeCartLineMutation,
			variables: {
				cartId: cartCookie,
				lineIds: [lineId]
			}
		})
	});

	const response = await deleteCartRequest.json();

	console.log('deleteCartResponse: ', JSON.stringify(response.data, null, 2));

	const cartData = response.data.cartLinesRemove.cart;

	if (featureFlag.isOptimizedCart) {
		await validatePromotionsV2(cartData, fetch);
	} else {
		await validatePromotions(cartData, fetch);
	}

	return json(response.data.cartLinesRemove);
};

export const GET: RequestHandler = async ({ fetch, cookies }) => {
	const cartId = cookies.get(CART_COOKIES_NAME);

	if (!cartId) {
		return json({});
	}

	const cartRequest = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: `query GetCartQuery($id: ID!) {
								cart(id: $id) {
									deliveryGroups(first: 25) {
										nodes {
											selectedDeliveryOption {
												code
												deliveryMethodType
												description
												handle
												title
												estimatedCost {
													amount
													currencyCode
												}
											}
										}
									}
									discountAllocations {
										discountedAmount {
											amount
											currencyCode
										}
										targetType
										... on CartAutomaticDiscountAllocation {
											__typename
											discountedAmount {
												amount
												currencyCode
											}
											targetType
											title
										}
										... on CartCodeDiscountAllocation {
											__typename
											code
											discountedAmount {
												amount
												currencyCode
											}
											targetType
										}
										... on CartCustomDiscountAllocation {
											__typename
											targetType
											title
											discountedAmount {
												amount
												currencyCode
											}
										}
									}
									buyerIdentity {
										customer {
											id
											firstName
											lastName
										}
									}
									discountCodes {
										applicable
										code
									}
									totalQuantity
									id
									lines(first: 250) {
										nodes {
											quantity
											... on CartLine {
												id
												quantity
												cost {
													amountPerQuantity {
														amount
														currencyCode
													}
													compareAtAmountPerQuantity {
														amount
														currencyCode
													}
													subtotalAmount {
														amount
														currencyCode
													}
													totalAmount {
														amount
														currencyCode
													}
												}
												discountAllocations {
													discountedAmount {
														amount
														currencyCode
													}
													... on CartAutomaticDiscountAllocation {
														__typename
														title
														targetType
														discountedAmount {
															amount
															currencyCode
														}
													}
													... on CartCodeDiscountAllocation {
														__typename
														code
														discountedAmount {
															amount
															currencyCode
														}
														targetType
													}
													... on CartCustomDiscountAllocation {
														__typename
														targetType
														title
														discountedAmount {
															amount
															currencyCode
														}
													}
													targetType
												}
												merchandise {
													... on ProductVariant {
														id
														image {
															url(transform: {crop: CENTER, maxHeight: 180, maxWidth: 180, scale: 2})
														}
														title
														product {
															title
															vendor
														}
														price {
															amount
														}
													}
												}
											}
											id
										}
									}
									createdAt
									checkoutUrl
									cost {
										subtotalAmount {
											amount
											currencyCode
										}
										totalAmount {
											amount
											currencyCode
										}
										totalTaxAmount {
											amount
											currencyCode
										}
									}
								}
							}`,
			variables: {
				id: cartId
			}
		})
	});

	const response = await cartRequest.json();

	return json(transformCart(response.data.cart));
};
