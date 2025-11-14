import { error, json, type RequestHandler } from '@sveltejs/kit';
import { customerUpdate } from '$lib/graphql.util';

export const PUT: RequestHandler = async ({ fetch, request }) => {
	const query = customerUpdate();
    const { email, firstName, lastName, phone, token } = await request.json();
   
    try {
        const shopifyReq = await fetch('/api/graphql.json', {
            method: 'POST',
            body: JSON.stringify({
                query: query.schema,
                variables: {
                    customer: {
                        email,
                        firstName,
                        lastName,
                        phone,
                    },
                    customerAccessToken: token,
                }
            })
        })
    
        const resp = await shopifyReq.json();
        if (resp?.errors?.length > 0) {
            console.error(resp.errors[0].message)
            throw new Error(resp.errors[0].message)
        }
        if (resp.data?.customerUpdate?.customerUserErrors?.length > 0) {
            console.error(resp.data.customerUpdate.customerUserErrors[0].message)
            throw new Error(resp.data.customerUpdate.customerUserErrors[0].message)
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