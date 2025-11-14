import { createStorefrontApiClient } from '@shopify/storefront-api-client';
import { json, type RequestHandler, type Cookies } from '@sveltejs/kit';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION, SHOPIFY_PRIVATE_ACCESS_TOKEN } from '$env/static/private';
import { checkAndGenerateCustomerShopifyData } from '$lib/server/services/shopify';
import { customerAddress } from '$lib/graphql.util';
import { insertShopifyFailure } from '$lib/server/collections/shopifyFailure';
import { AUTH_METHOD_MANUAL_ACTIVATION } from '$lib/constants.util';
import { 
	getListUserAddress,
	insertUserAddresses,
	insertUserAddress,
} from '$lib/server/collections/userAddress';
import { getUserById } from '$lib/server/collections/user';
import type { Address, AddressInput, ShopifyAddressData } from '$lib/types/address';

export const GET: RequestHandler = async ({ fetch, cookies, locals }) => {

	const userId = locals.userId
	let addresses = []
	if (!userId) {
		return json({
			success: false,
			message: "Unauthorized",
			data: []
		})
	}

	type ResponseType = {
		success: boolean;
		message: string;
		data: Address[];
	};

	let res: ResponseType;
	try {
		addresses = await getListUserAddress(userId)
		if (addresses.length === 0) {
			const user = await getUserById(userId)
			if (user && user.method !== AUTH_METHOD_MANUAL_ACTIVATION) { // to hide default user address from shopify
				// handle from shopify
				const shopifyAddresses = await getShopifyCustomerAddress(fetch, cookies, locals)
				if (shopifyAddresses.length > 0) {
					const addressDocuments: Address[] = [];
					for (const data of shopifyAddresses) {
						const doc: Address = {
							userId: userId,
							address1: data.address1,
							address2: data.address2,
							company: data.company,
							firstName: data.firstName,
							lastName: data.lastName,
							phone: data.phone,
							country: data.country,
							province: data.province,
							city: data.city,
							zip: data.zip,
							default: data.default,
						}
						addressDocuments.push(doc)
					}
					const userAddresses = await insertUserAddresses(addressDocuments)
					addresses = userAddresses
				}
			}
		}

		res = {
			success: true,
			message: 'Success get customer addresses',
			data: addresses,
		}
	}catch(e) {
		const errorMessage = e instanceof Error ? e.message : "Failed to get customer addresses"
		res = {
			success: false,
			message: errorMessage,
			data: [],
		}
	}

	return json(res);	
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.userId) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

	const input: AddressInput = await request.json();
	const data: Address = {
		userId: locals.userId,
		address1: input.address1,
		address2: input.address2,
		company: input.company,
		firstName: input.firstName,
		lastName: input.lastName,
		phone: input.phone,
		country: input.country,
		province: input.province,
		city: input.city,
		zip: input.zip,
		default: input.default ? input.default : false,
	}

	try {
		await insertUserAddress(data)

		return json({message: "Successfully created customer address.", status:201})
	}catch(e) {
		const errorMessage = e instanceof Error ? e.message : "Failed to create customer address."
		return json({message: errorMessage, status: 500})
	} 
};



const getShopifyCustomerAddress = async (fetch: typeof globalThis.fetch, cookies: Cookies, locals: App.Locals) => {
	const client = createStorefrontApiClient({
        storeDomain: SHOPIFY_STORE_DOMAIN,
        apiVersion: SHOPIFY_API_VERSION,
        privateAccessToken: SHOPIFY_PRIVATE_ACCESS_TOKEN,
        customFetchApi: fetch
    });
	const query = customerAddress();

	if (!locals.userId) {
		return []
	}

	// handle missing shopify data
	let token: string
	const userId = locals.userId
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
			return []
		}
	} catch(e) {
		console.error("getShopifyCustomerAddress error: ", (e as Error).message)
		return []
	}

	// get shopify customer address
	const variable = {
        "token": token
    }
    const result = await client.fetch(query.schema, { variables: variable });
    const response = await result.json();
	if (response.data.customer.addresses) {
		const addresses = response.data.customer.addresses.nodes.map((data: ShopifyAddressData) => {
			return {
				...data,
				default: data.id === response.data.customer.defaultAddress.id,
			}
		});

		return addresses
	} else {
		let errMessage = "Failed to get customer address from Shopify"
		if (response?.data?.errors?.length > 0) {
			errMessage = response?.data?.errors[0].message
		} else {
			errMessage = response.data?.customer?.customerUserErrors[0].message
		}
		console.error(errMessage)
		insertShopifyFailure({
			shopifyToken: token,
			eventAction: "get-customer-address",
			errorMessage: errMessage,
		})
		return []
	}
}
