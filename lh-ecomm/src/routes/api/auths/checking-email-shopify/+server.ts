import { json, type RequestHandler } from '@sveltejs/kit';
import { CACHE_COOKIES_NAME } from '$lib/constants.util';

export const POST: RequestHandler = async ({ request, cookies }) => {
    const cacheEmail = cookies.get(CACHE_COOKIES_NAME);

    const { variables } = await request.json() as { variables: Record<string, any> };

    let res = {
        success: false,
        message: '',
    }

    if (cacheEmail) {
        if (variables.email === cacheEmail) {
            res = {
                success: true,
                message: 'Email verified',
            }
        }
    }

    return json(res);
};
