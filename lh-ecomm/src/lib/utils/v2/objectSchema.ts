import type { ProductData } from '$lib/types/product';
import { discountPercentage, productUrlFormatter } from '../formatter';
import {
	isNewArrival,
	isOutOfStock,
	isPreOrder,
	showLabelProduct,
	showProductPrice
} from './valueValidator';

export function convertProductMongoToCardProduct({
	product,
	store,
	lang,
	wishlists = []
}: {
	product: any;
	store: string;
	lang: string;
	wishlists: string[];
}): ProductData {
	const sale = product.isDiscount;

	const wishlisted = wishlists.findIndex((x: string) => x === product.shopifyId);

	return {
		id: product.shopifyId,
		handle: product.handle,
		title: product.title,
		vendor: product.brand,
		description: product?.description,
		descriptionHtml: product.descriptionHtml,
		image: {
			url: product?.featureImageSrc,
			alt: product?.featureImageAlt
		},
		saleExpiredAt: '',
		year: product.year,
		completeness: product.completeness,
		condition: product.condition,
		percentage: discountPercentage(product.price, product.discountPrice),
		type: product.productType,
		discount: sale,
		preOrder: isPreOrder(product.tag),
		newArrival: product.isNewArrival,
		// newArrival: isNewArrival(product.tag, product?.publishedAt, product?.totalInventory),
		outOfStock: isOutOfStock(
			product.tag,
			product.totalInventory,
			product.productType,
			product?.variants,
			product?.availableForSale
		),
		specifications: product.specifications,
		tags: showLabelProduct({
			tag: product.tag,
			totalInventory: product.totalInventory,
			sale,
			updateTime: product?.updatedAt,
			type: product.productType,
			openForSale: product.availableForSale
		}),
		totalInventory: product.totalInventory,
		tagAll: product.tag,
		currency: product.currency,
		showPrice: showProductPrice({
			type: product.productType,
			tags: product.tag,
			price: product.price,
			totalInventory: product.totalInventory
		}),
		salePrice: product.discountPrice,
		normalPrice: product.price,
		url: productUrlFormatter(store, lang, product, product.productType),
		wishlisted: wishlisted !== -1,
		productExpires: ''
	};
}
