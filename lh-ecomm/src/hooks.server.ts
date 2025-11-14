import { connect, disconnect } from '$lib/server/db';
import { type Handle, type HandleServerError } from '@sveltejs/kit';
import { SHOPIFY_TOKEN_COOKIES_NAME, AUTH_TOKEN_COOKIES_NAME, OTP_VALID_COOKIES_NAME } from '$lib/constants.util';
import { 
	verifyJWTToken, 
	generateJWTToken,
	setAuthToken,
	clearShopifyToken, 
} from '$lib/utils/auth'
import { getUserByShopifyToken } from '$lib/server/collections/user'


const environment = import.meta.env.VITE_APP_ENV;
console.log(`Application is running in ${environment} mode.`);

// Connect to MongoDB before starting the server
await connect()
	.then((): void => {
		console.log('MongoDB started');
	})
	.catch((e) => {
		console.log('MongoDB failed to start');
		console.log(e);
	});

process.on('sveltekit:shutdown', async () => {
	await disconnect()
		.then((): void => {
			console.log('MongoDB Closed');
		})
		.catch((e) => {
			console.log('MongoDB failed to Close');
			console.log(e);
		});
});

export const handle: Handle = async ({ event, resolve }) => {
	const { cookies, locals } = event;
	const requestIp = event.getClientAddress();
	locals.requestIPAddress = requestIp;

	const shopifyCustomerToken = cookies.get(SHOPIFY_TOKEN_COOKIES_NAME);
	const authJWTToken = cookies.get(AUTH_TOKEN_COOKIES_NAME)

	if (cookies.get(OTP_VALID_COOKIES_NAME) === 'true') {
		locals.isOtpValid = true;
	}

	// TODO: Will be removed later until all users implement the new authentication.
	if (shopifyCustomerToken && !authJWTToken) {

		// case when user still has old token in their cookies
		try {
			const user = await getUserByShopifyToken(shopifyCustomerToken)
			if (!user) {
				throw new Error("Invalid user")
			}
			const authToken = generateJWTToken(
				{
					userId: user.id,
					shopifyId: user.shopifyId || null,
					shopifyToken: user.token || shopifyCustomerToken 
				}
			)
			setAuthToken(cookies, authToken)
			clearShopifyToken(cookies)

			Object.assign(locals, {
				userId: user.id,
				userShopifyId: user.shopifyId || null,
				userShopifyToken: user.token || shopifyCustomerToken
			});

			return resolve(event);
		} catch (err) {
			console.error(err)
			clearShopifyToken(cookies)
			return resolve(event);
		}
	}

	if (shopifyCustomerToken) {
		locals.userShopifyToken = shopifyCustomerToken;
	}

	if (authJWTToken) {
		try {
			const decodedToken = verifyJWTToken(authJWTToken)
			Object.assign(locals, {
				userId: decodedToken.userId,
				userShopifyToken: decodedToken.shopifyToken,
				userShopifyId: decodedToken.shopifyId
			});

		} catch (err) {
			console.error('Get user info failed: ', err)
			return await resolve(event)
			// return new Response('Unauthorized', { status: 401 })
		}
	}
		
	return resolve(event);
};


export const handleError: HandleServerError = async ({ error, event, status, message }) => {
	console.error(`${event.request.method} ${event.url.href} error with status: ${status} and message: ${message}`)
	console.error(`${event.route.id} error : `, error)
}
