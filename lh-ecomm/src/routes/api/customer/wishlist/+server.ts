import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';

const productWishlistCollection = 'ProductWishlist';

export const GET: RequestHandler = async ({ locals }) => {
	const userId = locals.userId
    try {
        const db = getDB();
        
        const productIDs: string[] = [];

        if(userId) {
            const productWishlists = await db
                .collection(productWishlistCollection)
                .find({ userId: userId })
                .toArray();
    
            for (const wishlist of productWishlists) {
                productIDs.push(wishlist.productID);
            }
        }

        return json({ list: productIDs });
    } catch (error) {
        return json({ error: 'Internal server error.' }, { status: 500 });
    }
};