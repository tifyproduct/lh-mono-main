import type { HTMLImgAttributes } from 'svelte/elements';
import type { CurrencyAmount } from './currency';

export interface ProductData {
	id: string;
	url?: string;
	title: string;
	handle: string;
	vendor: string;
	year?: string;
	type?: string;
	condition?: string;
	completeness?: string;
	description: string;
	descriptionHtml: string;
	discount?: boolean;
	preOrder?: boolean;
	outOfStock?: boolean;
	newArrival?: boolean;
	percentage: number;
	tags: Array<string>;
	tagAll: Array<string>;
	currency: string;
	showPrice: boolean;
	normalPrice: string;
	expiredAt?: string;
	specifications?: Array<SpecificationData>;
	salePrice: string;
	thumbnails?: Array<HTMLImgAttributes>;
	image: HTMLImgAttributes & { url?: string };
	variant?: string;
	storeAvailability?: Array<StoreAvailability>;
	saleExpiredAt?: string;
	shippingDelivery?: ShippingDelivery;
	totalInventory: number;
	wishlisted: boolean;
	productExpires: string;
	sku?: string;
}

export interface ProductShowPriceValidator {
	tags: Array<string>;
	price: string;
	type: string;
	totalInventory: number;
}

export interface SpecificationData {
	key?: string;
	value?: string;
}

export interface StoreAvailability {
	name: string;
	available: boolean;
	location: {
		address1: string;
		address2: string;
		city: string;
		country: string;
		latitude: number;
		longitude: number;
		province: string;
		zip: string;
	};
}

export interface ShippingDelivery {
	type: string;
	value: string;
}

export interface VariantData {
	id: string;
	image: HTMLImgAttributes & { url?: string };
	vendor: string;
	title: string;
	price: CurrencyAmount;
	compareAtPrice: CurrencyAmount | null;
	weight: number;
	weightUnit: string;
	currentlyNotInStock: boolean;
	quantityAvailable: number;
	availableForSale: boolean;
	sku: string;
	expiredAt?: string;
}

export interface VariantByHandleResponse {
	availableForSale: boolean;
	id: string;
	title: string;
	image: HTMLImgAttributes & { url?: string };
	price: CurrencyAmount;
	compareAtPrice: CurrencyAmount | null;
	currentlyNotInStock: boolean;
	quantityAvailable: number;
	sku: string;
	weight: number;
	weightUnit: string;
}

export interface GetVariantsByHandleResponse {
	productByHandle: {
		id: string;
		vendor: string;
		tags: string[];
		handle: string;
		productType: string;
		variants: {
			nodes: VariantByHandleResponse[];
		};
	};
}
