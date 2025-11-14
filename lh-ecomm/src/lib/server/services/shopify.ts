import type {CustomerCreateInputShopify, CreateAccessTokenInputShopify, GenerateCustomerShopifyDataResult} from '$lib/types/auth'
import  { createStorefrontApiClient, type StorefrontApiClient } from '@shopify/storefront-api-client';
import { SHOPIFY_STORE_DOMAIN, SHOPIFY_API_VERSION, SHOPIFY_PRIVATE_ACCESS_TOKEN } from '$env/static/private';
import { registerCustomer, loginCustomer, customerProfile } from '$lib/graphql.util';
import { getUserById, updateUserShopifyData } from '$lib/server/collections/user';
import type { CustomerProfile } from '$lib/types/customer';
import { insertShopifyFailure } from '$lib/server/collections/shopifyFailure';
import type { Cookies } from '@sveltejs/kit';
import { generateJWTToken, setAuthToken } from '$lib/utils/auth';
import type {  User } from '$lib/types/user';




export function getShopifyStorefrontAPIClient(): StorefrontApiClient {
    const client = createStorefrontApiClient({
		storeDomain: SHOPIFY_STORE_DOMAIN,
		apiVersion: SHOPIFY_API_VERSION,
		privateAccessToken: SHOPIFY_PRIVATE_ACCESS_TOKEN,
		customFetchApi: fetch
	});

    return client
}

export async function getCustomerProfileShopify(token: string): Promise<CustomerProfile | null> {
    const client = getShopifyStorefrontAPIClient()
    const query = customerProfile();

    try {
        const shopifyReq = await client.fetch(
            query.schema, 
            {variables: {token: token}}
        )

        const resp = await shopifyReq.json()
        if (!resp.data.customer) {
            return null
        }

        const userProfile: CustomerProfile = {
            isLoggedIn: true,
            firstName: resp.data.customer?.firstName,
            lastName: resp.data.customer?.lastName,
            id: resp.data.customer?.id,
            email: resp.data.customer?.email,
            phone: resp.data.customer?.phone,
            userId: null,
        }

        return userProfile
    } catch (e) {
        console.error("failed to get customer shopify: ", e)
        const err = e instanceof Error ? e : new Error("Failed to get customer shopify data")
        throw err
    }

}

export async function createCustomerShopify(request: CustomerCreateInputShopify): Promise<string> {

    const client = getShopifyStorefrontAPIClient()
	const customerCreateQuery = registerCustomer();
    const variables: Record<string, CustomerCreateInputShopify> = {input: request}

    try {
        const shopifyReq = await client.fetch(
            customerCreateQuery.schema,
            { variables }
        )
    
        const resp = await shopifyReq.json()
        if (resp?.errors?.length > 0) {
            console.error(resp?.errors[0].message)
            throw new Error(resp?.errors[0].message)
        }
        if (resp.data?.customerCreate?.customerUserErrors?.length > 0) {
            console.error(resp.data.customerCreate.customerUserErrors[0].message)
            throw new Error(resp.data.customerCreate.customerUserErrors[0].message)
        }
    
        const customerShopifyId = resp.data.customerCreate.customer.id;
        return customerShopifyId
    } catch (e) {
        console.error("failed to create customer shopify: ", e)
        const errorMessage = e instanceof Error ? e.message: "Failed to create customer shopify"

        insertShopifyFailure({
            shopifyId: null,
			email: request.email,
			eventAction: "customer-create",
			errorMessage: errorMessage,})

        throw new Error(errorMessage)
    }
}

export async function createCustomerAccessTokenShopify(request: CreateAccessTokenInputShopify): Promise<string> {

    const client = getShopifyStorefrontAPIClient()
	const query = loginCustomer();

    try {
        const shopifyReq = await client.fetch(
            query.schema,
            { variables: { email: request.email, password: request.password } }
        )
    
        const resp = await shopifyReq.json()
        if (resp?.errors?.length > 0) {
            console.error(resp.errors[0].message)
            throw new Error(resp.errors[0].message)
        }
        if (resp.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
            console.error(resp.data.customerAccessTokenCreate.customerUserErrors[0].message)
            throw new Error(resp.data.customerAccessTokenCreate.customerUserErrors[0].message)
        }
    
        const customerShopifyToken = resp.data.customerAccessTokenCreate.customerAccessToken.accessToken;
        return customerShopifyToken
    } catch (e) {
        console.error("failed to create customer access token shopify: ", e)
        const errorMessage = e instanceof Error ? e.message: "Failed to create customer access token shopify"

        insertShopifyFailure({
            shopifyId: null,
            email: request.email,
            eventAction: "customer-access-token-create",
            errorMessage: errorMessage,})

        throw new Error(errorMessage)
    }
}


// to fix user data that does not have shopify data
export async function checkAndGenerateCustomerShopifyData(cookies: Cookies ,userId: string, userShopifyId: string | null, userShopifyToken: string | null): Promise<GenerateCustomerShopifyDataResult> {
    if (userShopifyToken && userShopifyId) {
        // case values exist in token
        return {
            shopifyId: userShopifyId,
            token: userShopifyToken
        }
    }

    try {
        const user = await getUserById(userId)
        if (!user) {
            throw new Error("User is not found")
        }
        userShopifyId = user.shopifyId || userShopifyId;
        userShopifyToken = user.token || userShopifyToken;

        if (userShopifyToken && userShopifyId) {
            const authToken = generateJWTToken(
				{
					userId: user.id,
					shopifyId: userShopifyId,
					shopifyToken: userShopifyToken
				}
			)
			setAuthToken(cookies, authToken)
            return {
                shopifyId: userShopifyId,
                token: userShopifyToken
            }
        }

        if (userShopifyId && !userShopifyToken) {
            // If user has Shopify ID, create token if missing
            return await handleTokenCreationForExistingShopifyId(user, userShopifyId, cookies);
        } else if (userShopifyToken && !userShopifyId) {
            // If user has token but missing ID
            return await handleShopifyIdRecovery(user, userShopifyToken, cookies);
        } else {
            // If both id and token are missing, create new customer and token
            return await handleCustomerCreation(user, cookies);
        }
    } catch (e) {
        const err = e instanceof Error ? e : new Error("Failed to generate shopify data")
        throw err
    }
}

export async function handleTokenCreationForExistingShopifyId(
    user: User, 
    userShopifyId: string, // shopifyId from jwt token
    cookies?: Cookies
): Promise<GenerateCustomerShopifyDataResult> {
    try {
        const loginRequest: CreateAccessTokenInputShopify = { email: user.email, password: user.email };
        const token = await createCustomerAccessTokenShopify(loginRequest);
        
        const isUserUpdated = await updateUserShopifyData(user.id, token, null);
        if (!isUserUpdated) {
            console.log("User data is not updated");
        }

        if (cookies) {
            const authToken = generateJWTToken({ userId: user.id, shopifyId: userShopifyId, shopifyToken: token });
            setAuthToken(cookies, authToken);
        }

        return { shopifyId: userShopifyId, token };
    } catch (e) {
        const error = e instanceof Error ? e : new Error("Failed during token creation for existing Shopify ID");
        throw error;
    }
}

export async function handleShopifyIdRecovery(
    user: User, 
    userShopifyToken: string, // shopifyToken from jwt token
    cookies?: Cookies
): Promise<GenerateCustomerShopifyDataResult> {
    try {
        const customer = await getCustomerProfileShopify(userShopifyToken);
        if (customer) {
            const isUserUpdated = await updateUserShopifyData(user.id, null, customer.id);
            if (!isUserUpdated) {
                console.log("User data is not updated");
            }
        }

        if (cookies) {
            const authToken = generateJWTToken({ userId: user.id, shopifyId: customer?.id || null, shopifyToken: userShopifyToken });
            setAuthToken(cookies, authToken);
        }

        return { shopifyId: customer?.id, token: userShopifyToken };
    } catch (e) {
        const error = e instanceof Error ? e : new Error("Failed during Shopify ID recovery");
        throw error;
    }
}

export async function handleCustomerCreation(
    user: User, 
    cookies?: Cookies
): Promise<GenerateCustomerShopifyDataResult> {
    try {
        const shopifyData = await createCustomerAndTokenAccess(user.email, user.firstName, user.lastName)

        const isUserUpdated = await updateUserShopifyData(user.id, shopifyData.token, shopifyData.id);
        if (!isUserUpdated) {
            console.log("User data is not updated");
        }

        if (cookies) {
            const authToken = generateJWTToken({ userId: user.id, shopifyId: shopifyData.id, shopifyToken: shopifyData.token });
            setAuthToken(cookies, authToken);
        }
 
        return { shopifyId: shopifyData.id, token: shopifyData.token };
    } catch (e) {
        const error = e instanceof Error ? e : new Error("Failed during customer creation");
        throw error;
    }
}

export async function createCustomerAndTokenAccess(email: string, firstName: string, lastName: string): Promise<{id: string, token: string}> {
    const createCustomerRequest: CustomerCreateInputShopify = {
        acceptsMarketing: true,
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: email
    };
    const shopifyId = await createCustomerShopify(createCustomerRequest);

    const loginRequest: CreateAccessTokenInputShopify = { email: email, password: email };
    const token = await createCustomerAccessTokenShopify(loginRequest);

    return { id: shopifyId, token: token };
}