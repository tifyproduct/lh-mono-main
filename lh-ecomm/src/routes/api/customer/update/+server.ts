import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { checkAndGenerateCustomerShopifyData } from '$lib/server/services/shopify';
import { MongoError } from 'mongodb';
import { isValidPhoneNumber } from '$lib/utils/validator';

// TODO: will be deprecated later
export const POST: RequestHandler = async ({ request, locals, cookies }) => {
	const db = getDB();

	const { variables } = await request.json() as { variables: Record<string, any> };

	const userId = locals.userId
	if (!userId) {
		return json({
			success: false,
			message: "Unauthorized",
			data: []
		})
	}

	if (variables?.customer?.phone) {
		if (!isValidPhoneNumber(variables?.customer?.phone)) {
			return json({
				success: false,
				message: "Phone number is invalid",
				data: []
			})
		}
	} else {
		return json({
			success: false,
			message: "Phone number is required",
			data: []
		})
	}

	if (!variables?.customer?.email) {
		return json({
			success: false,
			message: "Email is required",
			data: []
		})
	}


	let token: string
	const userShopifyToken = locals.userShopifyToken
	let userShopifyId = locals.userShopifyId
	try {
		const customerShopifyData = await checkAndGenerateCustomerShopifyData(
			cookies,
			userId,
			userShopifyId,
			userShopifyToken
		)
		token = customerShopifyData.token || ""
		if (!token) {
			return json({
				success: false,
				message: "Unauthorized",
				data: []
			})
		}
		if (customerShopifyData.shopifyId) {
			userShopifyId = customerShopifyData.shopifyId
		}
	} catch(e) {
		return json({
			success: false,
			message: (e as Error).message,
			data: []
		})
	}

    let res = {
		success: false,
		message: '',
	}

	try {
		await db.collection('Users').updateOne({ 
			email: variables.customer.email.toLowerCase() }, { // TODO: change to id later
			$set: {
				...variables.customer,
			}
		})

		res = {
			success: true,
			message: 'Success Update',
		}
	
	} catch(e) {
		console.error("Error Update Customer Profile: ", e)
		let errorMessage = "Failed update customer profile"
		if (e instanceof MongoError) {
			const errCode = e.code;
			if (errCode === 11000) {
				const fields = Object.keys(e.keyPattern || {})
				if (fields.includes('phone')) {
					errorMessage = "This phone number is already in use. Please enter a different number."
				}
			}		
		} else {
			errorMessage = e instanceof Error ? e.message : errorMessage
		}

		res.message = errorMessage
	}


	// const client = createStorefrontApiClient({
    //     storeDomain: SHOPIFY_STORE_DOMAIN,
    //     apiVersion: SHOPIFY_API_VERSION,
    //     privateAccessToken: SHOPIFY_PRIVATE_ACCESS_TOKEN,
    //     customFetchApi: fetch
    // });

	// const variable = {
    //     ...variables,
    //     "customerAccessToken": token
    // }


    // const result = await client.fetch(query, { variables: variable });

    // const response = await result.json();
	// console.log(JSON.stringify(response))

    // let res = {
	// 	success: false,
	// 	message: '',
	// }

	// if (response.data?.customerUpdate?.customerAccessToken) {
	// 	// This case will happen if we change the Shopify user password, which will never happen, but just in case.
	// 	res = {
	// 		success: true,
	// 		message: '',
	// 	}

	// 	await db.collection('Users').updateOne({ token: token }, {
	// 		$set: {
	// 			...variables.customer,
	// 			email: variables.customer.email.toLowerCase(),
	// 			token: response.data?.customerUpdate?.customerAccessToken?.accessToken
	// 		}
	// 	});

	// 	const claims: TokenClaims = {
	// 		userId: userId,
	// 		shopifyId: userShopifyId,
	// 		shopifyToken: response.data?.customerUpdate?.customerAccessToken?.accessToken
	// 	}
	// 	const accessToken = generateJWTToken(claims)
	// 	setAuthToken(cookies, accessToken)
	// } else {
	// 	if (response?.data?.errors?.length > 0) {
	// 		res = {
	// 			success: false,
	// 			message: response?.data?.errors[0].message,
	// 			// message: 'Internal Server Error, Try again later.',
	// 		}
	// 	} else if(response.data?.customerUpdate?.customerUserErrors.length < 1) {
	// 		await db.collection('Users').updateOne({ 
	// 			email: variables.customer.email.toLowerCase() }, { // TODO: change to id later
	// 			$set: {
	// 				...variables.customer,
	// 			}
	// 		})

	// 		res = {
	// 			success: true,
	// 			message: 'Success Update',
	// 		}
	// 	} else {
	// 		res = {
	// 			success: false,
	// 			message: response.data?.customerUpdate?.customerUserErrors[0].message,
	// 		}
	// 	}
	// }

	return json(res);
};
