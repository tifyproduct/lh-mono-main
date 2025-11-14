import { getDB } from '$lib/server/db';
import type{  User, UserInput } from '$lib/types/user';
import { uuid } from 'uuidv4';
import { getMongoErrorResponse } from '$lib/utils/error';


export const COLLECTION_NAME = 'Users';


export async function getUserById(id: string): Promise<User | null> {
    const db = await getDB();
    const collection = db.collection<User>(COLLECTION_NAME);

    try {
        const user = await collection.findOne({id: id})
        return user
    } catch(e) {
        console.error("error get user by id: ", e)
        throw new Error("Failed to get user by id")
    }
}

export async function getUserByShopifyToken(token: string): Promise<User | null> {
    const db = await getDB();
    const collection = db.collection<User>(COLLECTION_NAME);

    try {
        const user = await collection.findOne({token: token})
        return user
    } catch(e) {
        console.error("error get user by shopify token: ", e)
        throw new Error("Failed to get user by shopify token")
    }
}


export async function updateUserShopifyData(id: string, newToken: string | null, shopifyId: string | null): Promise<boolean> {
    const db = await getDB();
    const collection = db.collection<User>(COLLECTION_NAME);
    const now = new Date();

    const updateFields: { [key: string]: any } = {
        updatedAt: now
    };

    if (newToken) {
        updateFields.token = newToken;
    }
    
    if (shopifyId) {
        updateFields.shopifyId = shopifyId;
    }

    if (Object.keys(updateFields).length === 1) {
        return false;
    }

    try {
        const result = await collection.updateOne(
            { id: id },
            { $set: updateFields }
        );

        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error updating shopify data user:", error);
        throw new Error("Failed to update shopify data user");
    }
}

export async function getUserByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const db = await getDB();
    const collection = db.collection<User>(COLLECTION_NAME);

    try {
        const user = await collection.findOne(
            {phone: phoneNumber}
        )
        return user
    } catch(e) {
        console.error("error get user by phone number: ", e)
        throw new Error("Failed to get user by phone number")
    }
}

export async function getUserByEmail(email: string): Promise<User | null> {
    const db = await getDB();
    const collection = db.collection<User>(COLLECTION_NAME);

    try {
        const user = await collection.findOne(
            {email: email.toLowerCase()}
        )
        return user
    } catch(e) {
        console.error("error get user by email: ", e)
        throw new Error("Failed to get user by email")
    }
}

export async function insertUser(data: UserInput): Promise<User> {
    const db = await getDB();
    const collection = db.collection<User>(COLLECTION_NAME);

    try {
        const newUser: User = {
            id: uuid(),
            acceptMarketing: true,        
            ...data,
            createdAt: new Date(),          
            updatedAt: new Date()           
        };

        await collection.insertOne(newUser);
        
        return newUser; 
    } catch (e) {
        console.error("Error inserting user:", e);
        const { code, message } = getMongoErrorResponse(e)
        if (code !== 500 ) {
            throw new Error(message);
        }
        throw new Error("Failed to insert user");
    }
}

export async function updateUserPassword(id: string, password: string): Promise<boolean> {
    const db = await getDB();
    const collection = db.collection<User>(COLLECTION_NAME);
    const now = new Date();

    if (!password) {
        throw new Error("Password cannot be empty")
    }

    try {
        const result = await collection.updateOne(
            { id: id },
            { $set: {
                password: password,
                updatedAt: now
            }}
        );

        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error updating user password:", error);
        throw new Error("Failed to update user password");
    }
}

export async function setNewUserPassword(id: string, password: string): Promise<boolean> {
    const db = await getDB();
    const collection = db.collection<User>(COLLECTION_NAME);
    const now = new Date();

    if (!password) {
        throw new Error("Password cannot be empty")
    }

    try {
        const result = await collection.updateOne(
            { id: id },
            { $set: {
                password: password,
                updatedAt: now,
                isSetPassword: true,
            }}
        );

        return result.modifiedCount > 0;
    } catch (error) {
        console.error("Error set new user password:", error);
        throw new Error("Failed to set new user password");
    }
}



