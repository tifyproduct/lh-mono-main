import { json, type RequestHandler } from '@sveltejs/kit';
import { createCustomerAccessTokenShopify } from '$lib/server/services/shopify';
import {generateHashPassword} from '$lib/utils/crypto';
import type { UserInput } from '$lib/types/user';
import { AUTH_METHOD_MANUAL_ACTIVATION } from '$lib/constants.util';
import { getCountryCodeFromPhoneNumber } from '$lib/utils/phoneNumber';
import { insertAuthFailure } from '$lib/server/collections/authFailure';
import { insertUser } from '$lib/server/collections/user';


export const POST: RequestHandler = async ({ request }) => {

    if (!request.body) {
		return json({status: 204, message: "No Content"});
	}

	const body = await request.json();

    if (body.tags === 'Manual Activation' && body.state === 'enabled' && !body.last_order_id) {
        try {
            const token = await createCustomerAccessTokenShopify({
                email: body.email,
                password: body.email
            })

            const hashedPassword = await generateHashPassword(body.email);
            const countryCode = getCountryCodeFromPhoneNumber(body.phone);
    
            const data: UserInput = {
                firstName: body.first_name,
                lastName: body.last_name,
                phone: body.phone,
                email: body.email.toLowerCase(),
                password: hashedPassword,
                method: AUTH_METHOD_MANUAL_ACTIVATION,
                countryCode: countryCode,
                shopifyId: body.admin_graphql_api_id,
                token: token
            }

            await insertUser(data);

            return json({status: 200, message: "Ok"});
        } catch(e) {
            console.error("Manual Activation failed: ", e)
            const errorMessage = e instanceof Error ? e.message : 'Error create user from manual activation';

            insertAuthFailure({
                shopifyId: null,
                email: body.email,
                eventAction: "manual-activation",
                errorMessage: errorMessage,
            })

            return json({status: 204, message: "No Content"});
        }
    }

    return json({});
};
