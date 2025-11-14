import { json, type RequestHandler } from '@sveltejs/kit';
import { getDB } from '$lib/server/db';
import { RAPID_API_KEY, RAPID_API_HOST } from '$env/static/private';
import { reviewGoogleSchema } from '$lib/utils/createObjectSchema';
import type { ReviewGoogleData, ReviewGoogleFormatted } from '$lib/types/review';
import { BUSINESS_ID_API_ID, BUSINESS_ID_API_SG } from '$lib/constants.util';
import { DateTime, Info } from 'luxon';

export const GET: RequestHandler = async ({ url }) => {
	const storeLocation = url.searchParams.get('location') || 'id';

	try {
		const db = getDB();

		let reviews = [];
		let totalReview = 0;
		let average = 0;

		const reviewDb = await db
			.collection('Reviews')
			.aggregate([
				{ $match: { store: storeLocation } },
				{
					$project: {
						totalReviews: 1,
						average: 1,
						reviews: {
							$slice: [
								{
									$sortArray: {
										input: {
											$filter: {
												input: {
													$map: {
														input: '$reviews',
														as: 'review',
														in: {
															author_name: '$$review.author_name',
															review_datetime_utc: '$$review.review_datetime_utc',
															rating: '$$review.rating',
															review_text: '$$review.review_text',
															review_link: '$$review.review_link'
														}
													}
												},
												as: 'review',
												cond: { $eq: ['$$review.rating', 5] }
											}
										},
										sortBy: { review_datetime_utc: -1 }
									}
								},
								0,
								10
							]
						}
					}
				}
			])
			.next();

		const businessId = storeLocation === 'id' ? BUSINESS_ID_API_ID : BUSINESS_ID_API_SG;

		const currentDate = DateTime.now().toISODate();
		const currentDay = DateTime.now().toFormat('DDDD').split(',')[0];

		if (!reviewDb) {
			const reviewReq = await fetch(
				`https://${RAPID_API_HOST}/business-reviews?business_id=${businessId}&limit=500&sort_by=highest_ranking`,
				{
					method: 'GET',
					headers: {
						'x-rapidapi-key': RAPID_API_KEY,
						'x-rapidapi-host': RAPID_API_HOST
					}
				}
			);

			const reviewRes = await reviewReq.json();

			if (reviewRes?.data) {
				const totalRating = reviewRes.data.reduce((acc: any, review: any) => {
					return acc + review.rating;
				}, 0);

				const ratingAvg = (totalRating / reviewRes.data.length).toFixed(2);

				await db.collection('Reviews').insertOne({
					store: storeLocation,
					placeId: businessId,
					totalReviews: reviewRes.data.length,
					reviews: reviewRes.data,
					average: ratingAvg,
					recurringDay: 'Tuesday',
					lastUpdated: DateTime.now().toISODate()
				});

				reviews = reviewRes.data.map((review: ReviewGoogleData) => {
					return reviewGoogleSchema(review);
				});

				average = Number(ratingAvg);
				totalReview = reviewRes.data.length;
			}
		} else {
			if (currentDay === reviewDb.recurringDay && currentDate !== reviewDb.lastUpdated) {
				const reviewReq = await fetch(
					`https://${RAPID_API_HOST}/business-reviews?business_id=${businessId}&limit=500&sort_by=highest_ranking`,
					{
						method: 'GET',
						headers: {
							'x-rapidapi-key': RAPID_API_KEY,
							'x-rapidapi-host': RAPID_API_HOST
						}
					}
				);

				const reviewRes = await reviewReq.json();

				if (reviewRes?.data) {
					const totalRating = reviewRes.data.reduce((acc: any, review: any) => {
						return acc + review.rating;
					}, 0);

					const ratingAvg = (totalRating / reviewRes.data.length).toFixed(2);

					await db.collection('Reviews').updateOne(
						{
							_id: reviewDb._id
						},
						{
							$set: {
								totalReviews: reviewRes.data.length,
								reviews: reviewRes.data,
								average: ratingAvg,
								lastUpdated: DateTime.now().toISODate()
							}
						}
					);

					reviews = reviewRes.data.map((review: ReviewGoogleData) => {
						return reviewGoogleSchema(review);
					});

					average = Number(ratingAvg);
					totalReview = reviewRes.data.length;
				} else {
					reviews = reviewDb.reviews.map((review: ReviewGoogleData) => {
						return reviewGoogleSchema(review);
					});

					average = Number(reviewDb.average);
					totalReview = reviewDb.totalReviews;
				}
			} else {
				reviews = reviewDb.reviews.map((review: ReviewGoogleData) => {
					return reviewGoogleSchema(review);
				});

				average = Number(reviewDb.average);
				totalReview = reviewDb.totalReviews;
			}
		}

		const sorted = reviews.sort(
			(a: ReviewGoogleFormatted, b: ReviewGoogleFormatted) =>
				new Date(b.createdAt) - new Date(a.createdAt)
		);

		const formatted = [];

		for (let i = 0; i < 10; i++) {
			if (sorted[i].rating === 5) {
				formatted.push(sorted[i]);
			}
		}

		return json({
			total: totalReview,
			average: average,
			reviews: formatted
		});
	} catch (error) {
		console.error(error);
		return json({ error: 'Internal server error.' }, { status: 500 });
	}
};
