import { json, error, type RequestHandler } from '@sveltejs/kit';
import type { CustomerCreateInputShopify } from '$lib/types/auth';
import { registerCustomer } from '$lib/graphql.util';
import { insertShopifyFailure } from '$lib/server/collections/shopifyFailure';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const customerCreateQuery = registerCustomer();
    const input: CustomerCreateInputShopify = await request.json();
    try {
        const shopifyReq = await fetch('/api/graphql.json', {
            method: 'POST',
            body: JSON.stringify({
                query: customerCreateQuery.schema,
                variables: {
                    input: input
                }
            })
        })
    
        const resp = await shopifyReq.json();
        if (resp?.errors?.length > 0) {
            console.error(resp.errors[0].message)
            throw new Error(resp.errors[0].message)
        }
        if (resp.data.customerCreate?.customerUserErrors?.length > 0) {
            console.error(resp.data.customerCreate.customerUserErrors[0].message)
            throw new Error(resp.data.customerCreate.customerUserErrors[0].message)
        }
        return json(resp)
    } catch (e) {
        let status = 500
        let errorMessage = 'Internal Server Error'
        if (e instanceof Error) {
            status = 400
            errorMessage = e.message
        }
        insertShopifyFailure({
            shopifyId: null,
			email: input.email,
			eventAction: "customer-create",
			errorMessage: errorMessage,})
        return error(status, errorMessage)
    }

}