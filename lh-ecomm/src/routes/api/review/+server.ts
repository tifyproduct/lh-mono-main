import { json, type RequestHandler } from '@sveltejs/kit';
import { uploadFile } from '$lib/server/storage';
import { insertProductReview, updateImageKeys } from '$lib/server/collections/productReview';



export const POST: RequestHandler = async ({ locals, request }) => {
    const userId = locals.userId
	if (!userId) {
        return json({ error: 'Authorization token required.' }, { status: 401 });
	}

    const reqFormData = await request.formData();
    const file = reqFormData.get('file') as File || null;
    const rating = parseInt(reqFormData.get('rating') as string);
    const title = reqFormData.get('title') as string || undefined;
    const description = reqFormData.get('description') as string;
    const reviewerName = reqFormData.get('reviewerName') as string;
    const shopifyProductId = reqFormData.get('productId') as string;
    const isAnonymous = reqFormData.get('isAnonymous') === 'true';

    let reviewId: string
    try {
        reviewId = await insertProductReview({
            shopifyProductId,
            reviewerName,
            rating,
            title,
            description,
            isAnonymous
        });
    } catch (e) {
        console.error(e);
        return json({ error: 'Failed to insert product review' }, { status: 500 });
    }

    let imageKey: string;
    if (file && file.size > 0) {
        // Currently, we do not store multiple images
        imageKey = `lh-images/products/reviews/${crypto.randomUUID()}-${file.name}`;
        try {
            await uploadFile(file, imageKey);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            return json({ error: errorMessage }, { status: 500 });
        }

        try {
            await updateImageKeys(reviewId, imageKey)
        }catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Unknown error';
            return json({ error: errorMessage }, { status: 500 });
        } 
    }
    

    return json({ success: true }, { status: 200 });
};
