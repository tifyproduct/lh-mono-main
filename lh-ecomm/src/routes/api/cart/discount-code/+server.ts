import { error, json, type RequestHandler } from '@sveltejs/kit';
import { CART_COOKIES_NAME } from '$lib/constants.util';

const cartDiscountCodeMutation = `mutation CartDiscountCodeUpdateMutation($cartId: ID!, $discountCodes: [String!]!) {
  cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
    cart {
      id
    }
  }
}`;

/**
 * Add discount endpoint
 * @param fetch
 * @param request
 * @constructor
 */
export const POST: RequestHandler = async ({ fetch, request, cookies, locals }) => {
	const userId = locals.userId;

	if (!userId) {
		error(403, {
			message: 'Unauthorized. Please login before add to cart'
		});
	}

	const cartCookie = cookies.get(CART_COOKIES_NAME) || '';

	if (!cartCookie) {
		error(403, {
			message: 'Cart not exists'
		});
	}

	const body = await request.json();
	const { code } = body;

	const cartQuery = cartDiscountCodeMutation;
	const variables: {
		cartId: string,
		discountCodes: Array<string>,
	} = {
		cartId: cartCookie,
		discountCodes: [code],
	};

	const updateDiscountRequest = await fetch('/api/graphql.json', {
		method: 'POST',
		body: JSON.stringify({
			query: cartQuery,
			variables
		})
	});

	const response = await updateDiscountRequest.json();

	console.log({ response: JSON.stringify(response) });

	return json(response);
};