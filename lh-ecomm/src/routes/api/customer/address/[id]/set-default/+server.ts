import { json, type RequestHandler } from '@sveltejs/kit';
import { updateUserAddressDefault } from '$lib/server/collections/userAddress';
import { ObjectId } from 'mongodb';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.userId) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

    const { id } = params;
    if (!id) {
        return json({ error: "Invalid user address id" }, { status: 422 });
    }

    const { isDefault }: { isDefault: boolean } = await request.json();
    if (isDefault === undefined || isDefault === null) {
        return json({ error: "Request cannot be empty" }, { status: 422 });
    }

    try {
        const objectId = new ObjectId(id)
        await updateUserAddressDefault(locals.userId, objectId, isDefault);

		return json({message: "Successfully updated default customer address.", status:200})
    }catch(e) {
        const errorMessage = (e as Error).message;
        return json({ error: errorMessage }, { status: 500 });
    }
}