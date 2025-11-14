import { getDB } from '$lib/server/db';
import { type Review } from '$lib/types/productReview';
import { ObjectId } from 'mongodb';


export const COLLECTION_NAME = 'ProductReviews';

export async function insertProductReview(data: {
    shopifyProductId: string;
    reviewerName: string;
    rating: number;
    title?: string;
    description: string;
    isAnonymous: boolean;
    imageKey?: string[];
}): Promise<string> {
    const db = await getDB();
    const collection = db.collection<Review>(COLLECTION_NAME);

    const { shopifyProductId, reviewerName, rating, title, description, isAnonymous, imageKey = [] } = data;
    
    const productReviewDocument: Review = {
        shopifyProductId,
        reviewerName,
        rating,
        description,
        reviewedAt: new Date(),
        isAnonymous,
        imageKeys: imageKey
    };

    if (title) {
        productReviewDocument.title = title;
    }
    
    try {
        const result = await collection.insertOne(productReviewDocument);
        return result.insertedId.toString();
    } catch(e) {
        console.error("Error inserting product review:", e)
        throw new Error("Failed to insert product review")
    }
}

export async function updateImageKeys(reviewId: string, imageKey: string): Promise<void> {
    const db = await getDB()
    const reviewsCollection = db.collection<Review>(COLLECTION_NAME);

    try {
        await reviewsCollection.updateOne(
            { _id: new ObjectId(reviewId) },
            { $set: { imageKeys: [imageKey] } }
        );
    }catch(e) {
        console.error("Error updating product review image key:", e)
        throw new Error("Failed to update product review")
    }

}

export async function getReviewsByProductId(productId: string): Promise<Review[]> {
    const db = await getDB();
    const collection = db.collection<Review>(COLLECTION_NAME);

    try {
        const reviews = await collection.find({ shopifyProductId: `gid://shopify/Product/${productId}`}).toArray();
        return reviews;
    } catch (e) {
        console.error("Error get reviews by product id:", e);
        return []
    }
}


