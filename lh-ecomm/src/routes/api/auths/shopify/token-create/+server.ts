import { error, json, type RequestHandler } from '@sveltejs/kit';
import type { CreateAccessTokenInputShopify } from '$lib/types/auth'
import { loginCustomer } from '$lib/graphql.util';

export const POST: RequestHandler = async ({ fetch, request }) => {
	const accessTokenCreateQuery = loginCustomer();
    const input: CreateAccessTokenInputShopify = await request.json();
   
    try {
        const shopifyReq = await fetch('/api/graphql.json', {
            method: 'POST',
            body: JSON.stringify({
                query: accessTokenCreateQuery.schema,
                variables: {
                    email: input.email,
                    password: input.password
                }
            })
        })
    
        const resp = await shopifyReq.json();
        if (resp?.errors?.length > 0) {
            console.error(resp.errors[0].message)
            throw new Error(resp.errors[0].message)
        }
        if (resp.data?.customerAccessTokenCreate?.customerUserErrors?.length > 0) {
            console.error(resp.data.customerAccessTokenCreate.customerUserErrors[0].message)
            throw new Error(resp.data.customerAccessTokenCreate.customerUserErrors[0].message)
        }
        return json(resp)
    } catch (e) {
        let status = 500
        let errorMessage = 'Internal Server Error'
        if (e instanceof Error) {
            status = 400
            errorMessage = e.message
        }
        return error(status, errorMessage)
    }


}