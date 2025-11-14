import { getDB } from '$lib/server/db';
import type { Address, AddressInput } from '$lib/types/address';
import type { ObjectId } from "mongodb";

export const COLLECTION_NAME = 'UserAddresses';

export async function getListUserAddress(userId: string): Promise<Address[]> {
    const db = await getDB();
    const collection = db.collection<Address>(COLLECTION_NAME);

    try {
        return await collection.find({userId: userId}).toArray()
    } catch(e) {
        console.error("Error get list user address: ", e)
        return []
    }
}

export async function insertUserAddresses(addresses: Address[]): Promise<Address[]> {
    const db = await getDB();
    const collection = db.collection<Address>(COLLECTION_NAME);

    try {
        const result = await collection.insertMany(addresses);
        const insertedAddresses = addresses.map((address, index) => ({
            ...address,
            _id: result.insertedIds[index]
          }));

        return insertedAddresses
    } catch(e) {
        console.error("Error inserting user addresses: ", e)
        return []
    }
}

export async function insertUserAddress(address: Address): Promise<void> {
    const db = await getDB();
    const collection = db.collection<Address>(COLLECTION_NAME);

    try {
        await collection.insertOne(address);
    } catch(e) {
        console.error(e)
        const errorMessage = e instanceof Error ? e.message : 'Error inserting user address';
        throw new Error(errorMessage)
    }
}

export async function updateUserAddress(id: ObjectId, updatedAddress: AddressInput): Promise<void> {
    const db = await getDB();
    const collection = db.collection<Address>(COLLECTION_NAME);

    try {
        await collection.updateOne(
            { _id: id},
            { $set: updatedAddress }
        );
    } catch(e) {
        console.error(e)
        const errorMessage = e instanceof Error ? e.message : 'Error updating user address';
        throw new Error(errorMessage)
    }
}

export async function updateUserAddressDefault(userId: string, id: ObjectId, defaultValue: boolean): Promise<void> {
    const db = await getDB();
    const collection = db.collection<Address>(COLLECTION_NAME);

    try {
        if (defaultValue) {
            await collection.updateMany(
                { default: true, _id: { $ne: id }, userId: userId },
                { $set: { default: false } }
            )
        }
        await collection.updateOne(
            { _id: id },
            { $set: { default: defaultValue } }
        );
    } catch (e) {
        console.error(e);
        const errorMessage = e instanceof Error ? e.message : 'Error updating default user address';
        throw new Error(errorMessage);
    }
}

export async function deleteUserAddress(id: ObjectId): Promise<void> {
    const db = await getDB();
    const collection = db.collection<Address>(COLLECTION_NAME);

    try {
        await collection.deleteOne({ _id: id});
    } catch(e) {
        console.error(e)
        const errorMessage = e instanceof Error ? e.message : 'Error deleting user address';
        throw new Error(errorMessage)
    }
}