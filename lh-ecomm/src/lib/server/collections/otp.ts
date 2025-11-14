import { getDB } from '$lib/server/db';
import type { UserOTP } from '$lib/types/user';
import { OTP_TTL_IN_SECONDS } from '$env/static/private';


export const COLLECTION_NAME = 'UserOTP';

export async function insertUserOTP(userId: string, otp: string): Promise<UserOTP> {
    const db = await getDB();
    const collection = db.collection<UserOTP>(COLLECTION_NAME);

    try {
        const otpRecord: UserOTP = {
            userId: userId,
            otp: otp,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + Number(OTP_TTL_IN_SECONDS) * 1000)
        }

        await collection.insertOne(otpRecord)
        return otpRecord
    } catch (e) {
        console.error("Error inserting user otp:", e);
        throw new Error("Failed to insert user otp");
    }
}

export async function getLatestUserOTP(userId: string): Promise<UserOTP | null> {
    const db = await getDB();
    const collection = db.collection<UserOTP>(COLLECTION_NAME);

    try {
        const otpRecords = await collection.find({ userId: userId })
            .sort({ createdAt: -1 })
            .limit(1)
            .toArray();

        if (otpRecords.length === 0) {
            return null
        }

        return otpRecords[0]
    } catch(e) {
        console.error("Error get latest user otp:", e);
        throw new Error("Failed to get user otp");
    }
}

export async function deleteUserOTPs(userId: string): Promise<boolean> {
    const db = await getDB();
    const collection = db.collection<UserOTP>(COLLECTION_NAME);

    try {
        const result = await collection.deleteMany({ userId: userId });

        return result.deletedCount > 0
    } catch (error) {
        console.error("Error deleting OTP documents:", error);
        throw new Error("Failed to delete OTP documents");
    }
}