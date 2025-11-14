export interface Review {
	shopifyProductId: string;
	reviewerName: string;
	rating: number;
	title?: string;
	description: string;
	reviewedAt: Date;
	isAnonymous: boolean;
	imageKeys: string[];
}

export interface ProductReviews {
	reviews: ReviewResponse[];
	imageURLs: string[];
	rating: string;
	totalReviews: number;
}

export interface ReviewResponse {
	shopifyProductId: string;
	reviewerName: string;
	rating: number;
	title: string;
	description: string;
	reviewedAt: string;
	presignedURLs: string[];
}
