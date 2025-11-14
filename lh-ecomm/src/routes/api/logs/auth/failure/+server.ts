import  {json, type RequestHandler } from '@sveltejs/kit';
import { insertAuthFailure } from '$lib/server/collections/authFailure';
import type { AuthFailureMetadata } from '$lib/types/authFailureLog';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        const data: AuthFailureMetadata = await request.json();

        if (!data.ipAddress) {
            data.ipAddress = locals.requestIPAddress || request.headers.get('x-forwarded-for') || request.headers.get('remote-addr');
        }

        if (!data.userAgent) {
            data.userAgent = request.headers.get('user-agent');
        }

        const result = await insertAuthFailure(data);
        if (result instanceof Error) {
            return json({ error: result.message }, { status: 500 })
        }
        return json({
            status: 201,
            body: { message: 'Log auth failure successfully created' }
        });
    } catch (error) {
        console.error('Error log auth failure:', error);
        return json({ error: 'Internal Server Error' }, { status: 500 })
    }
};