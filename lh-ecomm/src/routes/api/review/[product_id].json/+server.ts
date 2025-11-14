import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { json, type RequestHandler } from '@sveltejs/kit';

const s3: S3Client = new S3Client({
	credentials: {
		accessKeyId: 'dd9788eb5b4fa00898c1bfc3bd4e4b1b',
		secretAccessKey: 'cc325528f45be8ad7a1882a1e74ffe001ce491bb1b1be963f422613d0c241b1b'
	},
	region: 'auto',
	endpoint: 'https://8c8b807c68725aef93013cdba1756460.r2.cloudflarestorage.com'
});

const bucket = 'cdn';

export const GET: RequestHandler = async ({ params }) => {
	const productId = params.product_id;
	const reviewKey = `lh-reviews/product/${productId}.json`;

	const command = new GetObjectCommand({
		Bucket: bucket,
		Key: reviewKey
	});

	let reviews = [];

	try {
		const response = await s3.send(command);
		reviews = JSON.parse((await response.Body.transformToString()) || '[]') as Array<any>;
	} catch (e) {}

	let ratingTotal = 0;
	const reviewImages = [];

	for (const review of reviews) {
		ratingTotal += review.rating;

		if (review.images[0]) {
			reviewImages.unshift(review.images[0]);
		}
	}

	return json({
		reviews,
		images: reviewImages,
		rating: reviews.length > 0 ? (ratingTotal / reviews.length).toFixed(1) : '0',
		totalReviews: reviews.length
	});
};
