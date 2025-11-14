import { getDB } from '$lib/server/db';
import { Collection } from 'mongodb';
import { type OrderPayment } from '$lib/types/order';


export const COLLECTION_NAME = 'OrderPayments';

let collection: Collection<OrderPayment> | null = null;

export async function getOrderPaymentsCollection(): Promise<Collection<OrderPayment>> {
    if (!collection) {
      const db = await getDB();
      collection = db.collection<OrderPayment>(COLLECTION_NAME);
    }
    return collection;
}

export async function findOrderPaymentsByIds(orderIDs: string[]): Promise<OrderPayment[]> {
    const collection = await getOrderPaymentsCollection();
    return collection.find({ orderId: { $in: orderIDs } }).toArray();
}