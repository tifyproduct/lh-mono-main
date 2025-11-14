import { json, type RequestHandler } from '@sveltejs/kit';
import type { AddressInput } from '$lib/types/address';
import { updateUserAddress, deleteUserAddress } from '$lib/server/collections/userAddress';
import { ObjectId } from 'mongodb';

export const PUT: RequestHandler = async ({ request, locals, params }) => {
	if (!locals.userId) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

    const { id } = params;
    if (!id) {
        return json({ error: "Invalid user address id" }, { status: 422 });
    }

	const input: AddressInput = await request.json();
    if (!input) {
        return json({ error: "Request cannot be empty" }, { status: 422 });
    }

    try {
        const objectId = new ObjectId(id)
        await updateUserAddress(objectId, input);

		return json({message: "Successfully updated customer address.", status:200})
    }catch(e) {
        const errorMessage = (e as Error).message;
        return json({ error: errorMessage }, { status: 500 });
    }
}

export const DELETE: RequestHandler = async ({ locals, params }) => {
	if (!locals.userId) {
		return json({ error: "Unauthorized" }, { status: 401 });
	}

    const { id } = params;
    if (!id) {
        return json({ error: "Invalid user address id" }, { status: 422 });
    }

    try {
        const objectId = new ObjectId(id)
        await deleteUserAddress(objectId);

		return json({message: "Successfully deleted customer address.", status:200})
    }catch(e) {
        const errorMessage = (e as Error).message;
        return json({ error: errorMessage }, { status: 500 });
    }
}
