export type FormattedProduct = {
	id: string;
	handle: string;
	title: string;
	vendor: string;
	description: string;
	descriptionHtml: string;
	image: {
		altText: string;
		id: string;
		height: number;
		width: number;
		src: string;
		url: string;
	};
	discountPercentage: number | null;
	percentage: null | number;
	tags: string[];
	tagAll: string[];
	currency: string;
	salePrice: string;
	normalPrice: string;
	url: string;
	productType: string;
	showPrice: boolean;
	wishlisted: boolean;
	discount: boolean;
	preOrder: boolean;
	outOfStock: boolean;
	newArrival: boolean;
};

export type RecommendedCollection = {
	id: string;
	title: string;
	handle: string;
	url?: string;
};
