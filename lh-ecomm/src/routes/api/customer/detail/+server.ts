import { json, type RequestHandler } from '@sveltejs/kit';
import { getUserById } from '$lib/server/collections/user';
import type { APIResponse } from '$lib/types/response/response';
import type { GetCustomerDetailResponse } from '$lib/types/customer';

export const GET: RequestHandler = async ({ locals }) => {
	const failedMessage = 'Failed to get customer detail';

	const userId = locals.userId;
	if (!userId) {
		return json({ message: 'Unauthorized', error: 'invalid or missing token' }, { status: 403 });
	}

	try {
		const user = await getUserById(userId);
		if (!user) {
			return json({ message: failedMessage, error: 'User is not found' }, { status: 400 });
		}

		const response: APIResponse<GetCustomerDetailResponse> = {
			message: 'Ok',
			status: 200,
			data: {
				id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				phone: user.phone ?? null,
				email: user.email,
				registerMethod: user.method,
				createdAt: user.createdAt,
				isSetPassword: user.isSetPassword
			}
		};

		return json(response);
	} catch (e) {
		console.error('get customer detail error: ', e);
		const errorMessage = e instanceof Error ? e.message : 'Internal Server Error';

		return json({ message: failedMessage, error: errorMessage }, { status: 500 });
	}
};
