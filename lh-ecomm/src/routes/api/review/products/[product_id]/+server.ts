import { json, type RequestHandler } from '@sveltejs/kit';
import { getReviewsByProductId } from '$lib/server/collections/productReview';
import { signedUrl } from '$lib/server/storage';
import type { ReviewResponse, ProductReviews } from '$lib/types/productReview';
import { censorName } from '$lib/utils/formatter';

export const GET: RequestHandler = async ({ params }) => {
	const productId = params.product_id;
    if (!productId) {
        return json({ error: 'Product ID is required.' }, { status: 422 });
    }

	const productReviews = await getReviewsByProductId(productId);
    if (productReviews.length === 0) {
        return json({
            reviews: [],
            rating: '0',
            totalReviews: 0
        })
    }

	let ratingTotal = 0;
    const reviews: ReviewResponse[] = []
    const listImageURLs = [];
	for (const review of productReviews) {
        const data: ReviewResponse = {
            shopifyProductId: review.shopifyProductId,
            reviewerName: review.isAnonymous ? censorName(review.reviewerName) : review.reviewerName,
            rating: review.rating,
            title: review?.title || '',
            description: review.description,
            reviewedAt: review.reviewedAt.toISOString(),
            presignedURLs: []
        }

		if (review.imageKeys && review.imageKeys.length > 0) {
            for (const key of review.imageKeys) {
                try {
                    const presigned = await signedUrl(key)
                    data.presignedURLs.push(presigned)
                    listImageURLs.unshift(presigned)
                } catch (e) {
                    console.error(e)
                }
            }
		}
        ratingTotal += review.rating;
        reviews.push(data)
	}
    
	return json({
		reviews,
        imageURLs: listImageURLs,
		rating: productReviews.length > 0 ? (ratingTotal / productReviews.length).toFixed(1) : '0',
		totalReviews: productReviews.length
	} as ProductReviews);
};
