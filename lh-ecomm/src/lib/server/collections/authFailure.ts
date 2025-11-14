import { getDB } from '$lib/server/db';
import type { AuthFailureLog, AuthFailureMetadata } from '$lib/types/authFailureLog';

export const COLLECTION_NAME = 'AuthFailure';

export async function insertAuthFailure(data: AuthFailureMetadata): Promise<Error | void> {
    try {
        const db = await getDB();
        const collection = db.collection<AuthFailureLog>(COLLECTION_NAME);
    
        const log: AuthFailureLog = {
            timestamp: new Date(),
            metadata: {
                shopifyId: data.shopifyId,
                email: data.email,
                eventAction: data.eventAction,
                errorMessage: data.errorMessage,
                userAgent: data.userAgent,
                ipAddress: data.ipAddress,
            }
        };

        await collection.insertOne(log);
    } catch (err) {
        console.error('Error inserting auth failure: ', err);
        return new Error('Error inserting auth failure')
    }
}