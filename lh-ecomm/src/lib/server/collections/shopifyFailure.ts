import { getDB } from '$lib/server/db';
import type { ShopifyAPIFailureLog, ShopifyAPIFailureMetadata } from '$lib/types/authFailureLog';

export const COLLECTION_NAME = 'ShopifyFailure';

export async function insertShopifyFailure(data: ShopifyAPIFailureMetadata): Promise<Error | void> {
    try {
        const db = await getDB();
        const collection = db.collection<ShopifyAPIFailureLog>(COLLECTION_NAME);
    
        const log: ShopifyAPIFailureLog = {
            timestamp: new Date(),
            metadata: {
                shopifyId: data.shopifyId,
                email: data.email,
                shopifyToken: data.shopifyToken,
                eventAction: data.eventAction,
                errorMessage: data.errorMessage
            }
        };

        await collection.insertOne(log);
    } catch (err) {
        console.error('Error inserting shopify failure: ', err);
    }
}