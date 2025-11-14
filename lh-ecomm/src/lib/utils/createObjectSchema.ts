/* eslint-disable @typescript-eslint/no-explicit-any */
import { productType } from '../constants.util';
import { OrderHistoryStatus, OrderHistoryStatusValues } from '../enum.utils';
import { DateTime } from 'luxon';
import { PUBLIC_SHOPIFY_STORE_DOMAIN } from '$env/static/public';

import type { BreadcrumbData } from '../types/breadcrumb';
import type {
	ProductData,
	GetVariantsByHandleResponse,
	VariantData,
	VariantByHandleResponse
} from '../types/product';
import type { ReviewGoogleData, ReviewGoogleFormatted } from '$lib/types/review';
import type {
	OrderData,
	OrderPaymentDetails,
	ShippingAddressDetails,
	OrderProductDetail,
	OrderStatusStep,
	OrderPayment
} from '../types/order';
import { type Pagination, paginate } from '$lib/utils/pagination';
import {
	buildCheckoutURL,
	discountPercentage,
	productUrlFormatter,
	titleCaseFormat
} from './formatter';
import {
	mapShopifyStatus,
	calculateDiscountAmount,
	parseStorefrontOrderIDtoAdminOrderID,
	extractShopifyID
} from './shopifyDataConverter';
import {
	isNewArrival,
	isOutOfStock,
	isPreOrder,
	showLabelProduct,
	showProductPrice,
	specificationProductBasedOnType,
	typeValidator
} from './productValidator';

export function productObjectSchema({
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
	const sale =
		(Number(product.priceRange.minVariantPrice.amount) <
			Number(product.compareAtPriceRange.minVariantPrice.amount || 0));
	const type = typeValidator({ tags: product.tags, productType: product.productType });
	const specifications = specificationProductBasedOnType({
		specifications:
			type.toLowerCase() === productType.BEAUTY
				? product?.specificationsBeauty
				: type.toLowerCase() === productType.BAG
					? product?.specificationsBag
					: type.toLowerCase() === productType.JEWELRY
						? product?.specificationsJewelry
						: product?.specificationsWatch
	});

	const wishlisted = wishlists.findIndex((x: string) => x === product.id);
	return {
		id: product.id,
		handle: product.handle,
		title: product.title,
		vendor: product.vendor,
		description: product?.description,
		descriptionHtml: product.descriptionHtml,
		image: product?.featuredImage,
		saleExpiredAt: product?.saleExpired?.value,
		year: product.year?.value,
		completeness: product.completeness?.value,
		condition: product.condition?.value,
		percentage: discountPercentage(
			product.compareAtPriceRange.minVariantPrice.amount,
			product.priceRange.minVariantPrice.amount
		),
		type,
		discount: sale,
		preOrder: isPreOrder(product.tags),
		newArrival: isNewArrival(product.tags, product?.publishedAt, product?.totalInventory),
		outOfStock: isOutOfStock(
			product.tags,
			product.totalInventory,
			type,
			product?.variants?.nodes,
			product?.availableForSale
		),
		specifications: specifications,
		tags: showLabelProduct({
			tag: product.tags,
			totalInventory: product.totalInventory,
			sale,
			updateTime: product?.updatedAt,
			type,
			openForSale: product.availableForSale
		}),
		totalInventory: product.totalInventory,
		tagAll: product.tags,
		currency: product.priceRange.minVariantPrice.currencyCode,
		showPrice: showProductPrice({
			type,
			tags: product.tags,
			price: product.priceRange.minVariantPrice.amount,
			totalInventory: product.totalInventory
		}),
		salePrice: sale
			? product.priceRange.minVariantPrice.amount
			: product.compareAtPriceRange.minVariantPrice.amount,
		normalPrice: sale
			? product.compareAtPriceRange.minVariantPrice.amount
			: product.priceRange.minVariantPrice.amount,
		thumbnails: product?.thumbnails?.edges?.map((img: any) => {
			return {
				id: img?.node.id,
				alt: product.title,
				src: img.node.originalSrc
			};
		}),
		url: productUrlFormatter(store, lang, product, type),
		shippingDelivery: {
			type: product?.shippingDelivery?.reference.fields[0]?.value,
			value: product?.shippingDelivery?.reference.fields[1]?.value
		},
		wishlisted: wishlisted !== -1,
		productExpires: product?.productExpire?.value ?? ''
	};
}

export function productVariantData({ variants, product }: { variants: any; product: any }) {
	return variants.map((prod) => {
		const sale = (Number(prod.price.amount) < Number(prod.compareAtPrice?.amount || 0));
		const type = typeValidator({ tags: product.tags, productType: product.productType });
		const specifications = specificationProductBasedOnType({
			specifications:
				type.toLowerCase() === productType.BEAUTY
					? product?.specificationsBeauty
					: type.toLowerCase() === productType.BAG
						? product?.specificationsBag
						: type.toLowerCase() === productType.JEWELRY
							? product?.specificationsJewelry
							: product?.specificationsWatch
		});

		specifications.push({
			key: 'SKU',
			value: prod?.sku
		});

		return {
			id: prod.id,
			title: product.title,
			variant: prod.title,
			vendor: product.vendor,
			description: product?.description,
			descriptionHtml: product.descriptionHtml,
			image: prod?.image,
			saleExpiredAt: product?.saleExpired?.value,
			year: product.year?.value,
			completeness: product.completeness?.value,
			condition: product.condition?.value,
			percentage: discountPercentage(prod.compareAtPrice?.amount || 0, prod.price.amount),
			type,
			discount: sale,
			preOrder: isPreOrder(product.tags),
			newArrival: isNewArrival(product.tags, product?.publishedAt, prod.quantityAvailable),
			outOfStock: isOutOfStock(
				product.tags,
				prod.quantityAvailable,
				type,
				null,
				prod.availableForSale
			),
			specifications: specifications,
			totalInventory: prod.quantityAvailable,
			tags: showLabelProduct({
				tag: product.tags,
				totalInventory: prod.quantityAvailable,
				sale,
				updateTime: product?.updatedAt,
				type,
				openForSale: prod.availableForSale
			}),
			currency: prod.price.currencyCode,
			showPrice: showProductPrice({
				type: type,
				tags: product.tags,
				price: prod.price.amount,
				totalInventory: prod.quantityAvailable
			}),
			salePrice: sale ? prod.price.amount : prod.compareAtPrice?.amount || 0,
			normalPrice: sale ? prod.compareAtPrice?.amount || 0 : prod.price.amount,
			thumbnails: product?.thumbnails?.edges?.map((img: any) => {
				return {
					id: img?.node.id,
					alt: product.title,
					src: img.node.originalSrc
				};
			}),
			sku: prod.sku,
			storeAvailability: prod.storeAvailability.nodes
				.map((store: any) => {
					return {
						available: store.available,
						location: store.location.address,
						name: store.location.name
					};
				})
				.filter((store: any) => store.available),
			shippingDelivery: {
				type: product?.shippingDelivery?.reference.fields[0]?.value,
				value: product?.shippingDelivery?.reference.fields[1]?.value
			},
			isAddableToCart: type === 'Beauty',
			productExpires: product?.productExpire?.value ?? ''
		};
	});
}

const createBreadcrumb = (collection: any) => {
	const breadcrumb: any = [];

	function traverse(current: any) {
		if (!current) return;

		breadcrumb.push({
			title: current.title,
			handle: current.handle
		});

		if (current.parentCollection?.reference) {
			traverse(current.parentCollection.reference);
		}
	}

	traverse(collection);

	return breadcrumb.reverse();
};

export function breadcrumbObjectSchema({
	data,
	isProduct,
	params
}: {
	data: any;
	isProduct: boolean;
	params?: any;
}): Array<BreadcrumbData> {
	const breadcrumbs: Array<BreadcrumbData> = [];

	if (isProduct) {
		const type = typeValidator({ tags: data.tags, productType: data.productType });

		if (type.toLowerCase() === productType.BEAUTY) {
			const brand = data?.vendor;
			const category = data?.beautyCategory;
			const isChild =
				data?.beautyCategory?.reference?.parentCollection?.reference?.parentCollection;
			const isGrandChild = data?.beautyCategory?.reference?.parentCollection;
			const relevantCollections = data?.collections?.nodes?.filter(collection =>
				collection.category?.value === 'Brand' && !collection?.title.toLowerCase().includes('test')
			) ?? null;
			const relevantCollection = relevantCollections?.length > 0 ? relevantCollections[0] : null
			const collectionHandle: string = relevantCollection ? relevantCollection.handle : '';

			// Parent Menu
			breadcrumbs.push({
				title: type ?? titleCaseFormat(params?.type),
				url: `/${type ?? params?.type}`.toLowerCase()
			});

			// Brand
			breadcrumbs.push({
				title: brand,
				url: `/${type ?? params?.type}/${collectionHandle}`.toLowerCase()
			});

			// Ex: Make Up, Skin Care
			if (isChild) {
				breadcrumbs.push({
					title: isChild.reference.title,
					url: `/${type ?? params?.type}/${isGrandChild?.reference?.category?.value}/${isChild?.reference?.handle}`.toLowerCase()
				});
			}

			// Ex: Face, Lips
			if (isGrandChild) {
				breadcrumbs.push({
					title: isGrandChild.reference.title,
					url: `/${type ?? params?.type}/${isGrandChild?.reference?.category?.value}/${isChild?.reference?.handle}/${isGrandChild?.reference?.handle}`.toLowerCase()
				});
			}

			if (category) {
				breadcrumbs.push({
					title: category.reference.title,
					url: `/${type ?? params?.type}/${isGrandChild?.reference?.category?.value}/${isChild?.reference?.handle}/${isGrandChild?.reference?.handle}/${category?.reference?.handle}`.toLowerCase()
				});
			}

			breadcrumbs.push({
				title: data?.title,
				url: ''
			});

		} else if (data?.subBrand) {
			const parentMenu = data?.subBrand?.reference?.parentCollection?.reference?.parentMenu?.value;
			const brandData = data?.subBrand?.reference?.parentCollection?.reference?.title;
			const subBrandData = data?.subBrand?.reference.title;

			// Parent Menu
			breadcrumbs.push({
				title: parentMenu ?? titleCaseFormat(params?.type),
				url: `/${parentMenu ?? params?.type}`.toLowerCase()
			});

			// Brand
			breadcrumbs.push({
				title: brandData,
				url: `/${parentMenu}/${data?.subBrand?.reference?.parentCollection?.reference?.handle}`.toLowerCase()
			});

			// Sub Brand
			breadcrumbs.push({
				title: subBrandData,
				url: `/${parentMenu}/${data?.subBrand?.reference?.parentCollection?.reference?.handle}/${data?.subBrand?.reference?.handle}`.toLowerCase()
			});

			// Product
			breadcrumbs.push({
				title: data.title,
				url: ''
			});
		} else {
			const type = typeValidator({ tags: data.tags, productType: data.productType });

			const brandData = data?.vendor;
			const relevantCollections =
				data?.collections?.nodes?.filter((collection) => collection.category?.value === 'Brand') ??
				null;
			const relevantCollection = relevantCollections?.length > 0 ? relevantCollections[0] : null;
			const collectionHandle: string = relevantCollection ? relevantCollection.handle : '';
			// Parent Menu
			breadcrumbs.push({
				title: type,
				url: `/${type}`.toLowerCase()
			});

			// Brand
			breadcrumbs.push({
				title: brandData,
				url: `/${type}/${collectionHandle}`.toLowerCase()
			});

			// Product
			breadcrumbs.push({
				title: data.title,
				url: ''
			});
		}
	} else {
		if (data?.category?.value?.toLowerCase().includes('sub brand')) {
			const subBrandData = data?.title;

			const parentMenu = data?.parentMenu?.value;
			const brandMenu = data?.parentCollection?.reference?.title;

			// Parent Menu
			breadcrumbs.push({
				title: parentMenu ?? titleCaseFormat(params?.type),
				url: `/${parentMenu ?? params?.type}`.toLowerCase()
			});

			// Brand Menu
			breadcrumbs.push({
				title: brandMenu,
				url: `/${parentMenu}/${data?.parentCollection?.reference?.handle}`.toLowerCase()
			});

			// Brand
			breadcrumbs.push({
				title: subBrandData,
				url: ''
			});
		} else if (data?.category?.value?.toLowerCase().includes('brand')) {
			const brandData = data?.title;

			const parentMenu = data?.parentMenu?.value;

			// Parent Menu
			breadcrumbs.push({
				title: parentMenu ?? titleCaseFormat(params?.type),
				url: `/${parentMenu ?? params?.type}`.toLowerCase()
			});

			// Brand
			breadcrumbs.push({
				title: brandData,
				url: ''
			});
		} else if (data?.parentMenu?.value?.toLowerCase() === productType.BEAUTY) {
			const breadcrumbData = createBreadcrumb(data);
			const parentMenu = data?.parentMenu?.value;
			const category = data?.category?.value;

			// Parent Menu
			breadcrumbs.push({
				title: parentMenu ?? titleCaseFormat(params?.type),
				url: `/${parentMenu ?? params?.type}`.toLowerCase()
			});

			// Category
			breadcrumbs.push({
				title: category,
				url: `/${parentMenu ?? params?.type}`.toLowerCase()
			});

			let baseUrl = `/${parentMenu ?? params?.type}`.toLowerCase();
			breadcrumbData.forEach((item: any, index: number) => {
				// Add `/category` if it's the first item
				const handle = index === 0 ? `category/${item.handle}` : item.handle;

				breadcrumbs.push({
					title: item.title,
					url: `${baseUrl}/${handle}`
				});
				baseUrl = `${baseUrl}/${handle}`;
			});
		} else {
			const parentMenu = data?.parentMenu?.value;
			const category = data?.category?.value;

			// Parent Menu
			breadcrumbs.push({
				title: parentMenu ?? titleCaseFormat(params?.type),
				url: `/${parentMenu ?? params?.type}`.toLowerCase()
			});

			// Category
			breadcrumbs.push({
				title: category ?? '-',
				url: ''
			});

			breadcrumbs.push({
				title: data?.title,
				url: ''
			});
		}
	}

	return breadcrumbs;
}

export function promotedSectionObjectSchema(
	promoted: any,
	link: any,
	lang: string,
	store: string,
	wishlists = []
) {
	return {
		banner: promoted.banner?.reference?.image?.url || null,
		bannerLink: link?.url || null,
		products: promoted?.products.edges.map((product) =>
			productObjectSchema({
				product: product.node,
				store: store,
				lang: lang,
				wishlists
			})
		)
	};
}

export function articleListFilterObjectSchema(data: any, lang: string, store: string) {
	if (store === 'id') {
		if ('id' === lang) {
			if (data.slug.includes('/id') && !data.slug.includes('/en-id')) {
				return data;
			}
		} else {
			if (data.slug.includes('/en-id')) {
				return data;
			}
		}
	} else {
		if (data.slug.includes('/en') && !data.slug.includes('/en-id')) {
			return data;
		}
	}
}

export function generateOrderStatusSteps(statusName: string): OrderStatusStep[] {
	const steps = [
		{ label: statusName === 'Payment' ? 'Pay Order' : 'Order Paid' },
		{ label: 'In Process' },
		{ label: 'Shipping' },
		{ label: 'Completed' },
		{ label: 'Refunded' }
	];

	if (statusName === 'Refunded') {
		return [
			{ status: 'Order Paid', isActive: true },
			{ status: 'Refunded', isActive: true }
		];
	}

	const statusOrder = steps.findIndex(
		(step) => step.label === (statusName === 'Payment' ? 'Pay Order' : statusName)
	);

	return steps.map((step, index) => ({
		status: step.label,
		isActive: statusName === 'Payment' ? index === 0 : index <= statusOrder
	}));
}

export function orderHistoryStatusCounts(orders: any[]): { status: string; count: number }[] {
	const statusMap = orders.reduce(
		(acc, order) => {
			const orderStatus = mapShopifyStatus(order.financialStatus, order.fulfillmentStatus);
			if (!acc[orderStatus]) {
				acc[orderStatus] = { data: [], count: 0 };
			}
			acc[orderStatus].count += 1;
			return acc;
		},
		{} as { [key: string]: { count: number } }
	);

	return [
		{
			status: OrderHistoryStatusValues[OrderHistoryStatus.PAYMENT],
			count: statusMap[OrderHistoryStatus.PAYMENT]?.count || 0
		},
		{
			status: OrderHistoryStatusValues[OrderHistoryStatus.IN_PROGRESS],
			count: statusMap[OrderHistoryStatus.IN_PROGRESS]?.count || 0
		},
		{
			status: OrderHistoryStatusValues[OrderHistoryStatus.SHIPPED],
			count: statusMap[OrderHistoryStatus.SHIPPED]?.count || 0
		},
		{
			status: OrderHistoryStatusValues[OrderHistoryStatus.REFUNDED],
			count: statusMap[OrderHistoryStatus.REFUNDED]?.count || 0
		}
	];
}

export function groupOrdersByStatusSchema(
	orders: any[],
	page: number = 1,
	perPage: number = 10,
	orderPaymentMap: Record<string, OrderPayment> = {}
): { status: string; data: OrderData[]; pagination: Pagination; count: number }[] {
	const statusMap = orders.reduce(
		(acc, order) => {
			const orderStatus = mapShopifyStatus(order.financialStatus, order.fulfillmentStatus);
			if (!acc[orderStatus]) {
				acc[orderStatus] = { data: [], count: 0 };
			}
			const orderObject = getOrderObjectSchema(order, orderPaymentMap);
			acc[orderStatus].data.push(orderObject);
			acc[orderStatus].count += 1;
			return acc;
		},
		{} as { [key: string]: { data: OrderData[]; count: number } }
	);
	return [
		// {
		// 	status: OrderHistoryStatusValues[OrderHistoryStatus.PAYMENT],
		// 	...paginate(statusMap[OrderHistoryStatus.PAYMENT]?.data || [], page, perPage),
		// 	count: statusMap[OrderHistoryStatus.PAYMENT]?.count || 0
		// },
		{
			status: OrderHistoryStatusValues[OrderHistoryStatus.IN_PROGRESS],
			...paginate(statusMap[OrderHistoryStatus.IN_PROGRESS]?.data || [], page, perPage),
			count: statusMap[OrderHistoryStatus.IN_PROGRESS]?.count || 0
		},
		{
			status: OrderHistoryStatusValues[OrderHistoryStatus.SHIPPED],
			...paginate(statusMap[OrderHistoryStatus.SHIPPED]?.data || [], page, perPage),
			count: statusMap[OrderHistoryStatus.SHIPPED]?.count || 0
		},
		// {
		// 	status: "Completed",
		// 	...paginate(statusMap["Completed"]?.data || [], page, perPage),
		// 	count: statusMap["Completed"]?.count || 0
		// },
		{
			status: OrderHistoryStatusValues[OrderHistoryStatus.REFUNDED],
			...paginate(statusMap[OrderHistoryStatus.REFUNDED]?.data || [], page, perPage),
			count: statusMap[OrderHistoryStatus.REFUNDED]?.count || 0
		}
	];
}

export function filterOrdersByStatusSchema(
	orders: any[],
	page: number = 1,
	perPage: number = 10,
	status: OrderHistoryStatus
): { data: OrderData[]; pagination: Pagination; orderIDs: string[] } {
	const statusMap = orders.reduce(
		(acc, order) => {
			const status = mapShopifyStatus(order.financialStatus, order.fulfillmentStatus);
			if (!acc[status]) {
				acc[status] = { data: [], count: 0, orderIDs: [] };
			}
			const orderObject = getOrderObjectSchema(order);
			const orderID = parseStorefrontOrderIDtoAdminOrderID(order.id);
			acc[status].data.push(orderObject);
			acc[status].orderIDs.push(orderID);
			acc[status].count += 1;
			return acc;
		},
		{} as { [key: string]: { data: OrderData[]; count: number; orderIDs: string[] } }
	);
	return {
		...paginate(statusMap[status]?.data || [], page, perPage),
		orderIDs: statusMap[status]?.orderIDs || []
	};
}

export function getOrderObjectSchema(
	data: any,
	orderPaymentMap: Record<string, OrderPayment> | null = {}
): OrderData {
	const orderID = parseStorefrontOrderIDtoAdminOrderID(data.id);
	const orderStatus = mapShopifyStatus(data.financialStatus, data.fulfillmentStatus);
	const subTotal = parseInt(data.subtotalPrice.amount, 10);
	const totalShippingAmount = parseInt(data.totalShippingPrice.amount, 10);
	const paymentAmount = parseInt(data.totalPrice.amount, 10);
	const totalTaxAmount = parseInt(data.totalTax.amount, 10);
	const totalDiscountAmount = calculateDiscountAmount(
		subTotal,
		totalShippingAmount,
		totalTaxAmount,
		paymentAmount
	);
	const totalRefunded = parseInt(data.totalRefunded.amount, 10);
	const paymentDueAt =
		(orderPaymentMap &&
			orderPaymentMap[orderID]?.order?.paymentTerms?.paymentSchedules?.nodes[0]?.dueAt) ||
		'';

	const orderPaymentDetail: OrderPaymentDetails = {
		subtotalAmount: {
			amount: subTotal,
			currencyCode: data.subtotalPrice.currencyCode
		},
		shippingAmount: {
			amount: totalShippingAmount,
			currencyCode: data.totalShippingPrice.currencyCode
		},
		discountAmount: {
			amount: totalDiscountAmount,
			currencyCode: data.totalPrice.currencyCode
		},
		paymentTotal: {
			amount: paymentAmount,
			currencyCode: data.totalPrice.currencyCode
		},
		totalRefundedAmount: {
			amount: totalRefunded,
			currencyCode: data.totalRefunded.currencyCode
		},
		paymentDueDate: paymentDueAt instanceof Date ? paymentDueAt.toISOString() : paymentDueAt || ''
	};

	const address = data.shippingAddress || data.billingAddress;
	const shippingDetail: ShippingAddressDetails = {
		firstName: address?.firstName || '',
		lastName: address?.lastName || '',
		phone: address?.phone || '',
		address1: address?.address1 || '',
		address2: address?.address2 || '',
		city: address?.city || '',
		province: address?.province || '',
		country: address?.country || '',
		zip: address?.zip || ''
	};

	const orderProducts: OrderProductDetail[] = [];
	const cartItems: Array<[string, number]> = [];
	for (const item of data.lineItems.nodes) {
		if (item.variant) {
			const variantID = extractShopifyID(item.variant?.id);
			cartItems.push([variantID, item.quantity]);
			const type = typeValidator({ tags: item.variant?.product.tags, productType: '' });
			const productDetail: OrderProductDetail = {
				productID: item.variant?.product.id,
				productVariantID: item.variant?.id,
				quantity: item.quantity,
				name: item.title,
				brandName: item.variant?.product.vendor,
				imageURL: item.variant?.image.src,
				variant: item.variant?.title,
				handle: item.variant?.product.handle,
				typeLowerCase: type.toLocaleLowerCase(),
				price: {
					amount: item.discountedTotalPrice.amount,
					currencyCode: item.discountedTotalPrice.currencyCode
				},
				shippingDetail: {
					companyName: data.successfulFulfillments[0]?.trackingCompany || '',
					// logoURL: "",
					trackingID: data.successfulFulfillments[0]?.trackingInfo[0]?.number || '',
					trackingURL: data.successfulFulfillments[0]?.trackingInfo[0]?.url || ''
				}
			};
			orderProducts.push(productDetail);
		}
	}
	return {
		adminAPIID: orderID,
		number: data.name,
		orderedAt: data.processedAt,
		status: orderStatus,
		steps: generateOrderStatusSteps(orderStatus),
		totalItems: data.lineItems?.nodes.length || 0,
		paymentDetails: orderPaymentDetail,
		shippingAddress: shippingDetail,
		productDetails: orderProducts,
		checkoutURL: buildCheckoutURL(PUBLIC_SHOPIFY_STORE_DOMAIN, cartItems)
	};
}

export function getProductVariantsSchema(data: GetVariantsByHandleResponse): VariantData[] {
	const { productByHandle } = data;

	return productByHandle.variants.nodes.map((variant: VariantByHandleResponse) => ({
		id: variant.id,
		image: variant.image,
		vendor: productByHandle.vendor,
		title: variant.title,
		price: variant.price,
		compareAtPrice: variant.compareAtPrice,
		weight: variant.weight,
		weightUnit: variant.weightUnit,
		currentlyNotInStock: variant.currentlyNotInStock,
		quantityAvailable: variant.quantityAvailable,
		availableForSale: variant.availableForSale,
		sku: variant.sku
	}));
}

export function reviewGoogleSchema(data: ReviewGoogleData): ReviewGoogleFormatted {
	const createdDate = DateTime.fromISO(data.review_datetime_utc);

	return {
		name: data.author_name,
		relatedTime:
			createdDate?.toRelative({
				style: 'long',
				unit: ['years', 'months', 'weeks', 'days', 'hours']
			}) || '1 hours',
		rating: data.rating,
		description: data.review_text || '',
		url: data.review_link,
		createdAt: data.review_datetime_utc
	};
}

export function convertWebhookProductData(data: any) {
	const idProduct = data.tags.findIndex((x: string) => x.toLowerCase() === 'indonesia');
	const originalPrice = data.priceRange.minVariantPrice.amount;
	const discountPrice = Number(data.compareAtPriceRange.minVariantPrice.amount) ? data.compareAtPriceRange.minVariantPrice.amount : null;
	const genderIdx = data.specificationsWatch.findIndex((x: any) => x?.key.toLowerCase() === 'gender');
	const isLiveProduct = data.tags.findIndex((x: string) => x.toLowerCase() === 'live');
	const idxCondition = data.specificationsWatch.findIndex((x: any) => x?.key === 'condition');

	const leatherIdx = data.specificationsBag.findIndex((x: any) => x?.key?.toLowerCase() === 'hermes_leather');
	const caseIdx = data.specificationsWatch.findIndex((x: any) => x?.key?.toLowerCase() === 'case_material');
	const jewelryIdx = data.specificationsJewelry.findIndex((x: any) => x?.key?.toLowerCase() === 'materials');
	const claspIdx = data.specificationsWatch.findIndex((x: any) => x?.key?.toLowerCase() === 'clasp');

	const sku = data.variants.nodes[0].sku || null;

	const productType = typeValidator({ tags: data.tags, productType: data.productType });

	const specifications = specificationProductBasedOnType({
		specifications:
			productType.toLowerCase() === 'beauty'
				? data.specificationsBeauty
				: productType.toLowerCase() === 'bag'
					? data.specificationsBag
					: productType.toLowerCase() === 'jewelry'
						? data.specificationsJewelry
						: data.specificationsWatch
	});

	const isPreOrderWithPrice = data.tags.findIndex((x: any) => x === 'PO with Price');
	const isPreOrder = data.tags.findIndex((x: any) => x === 'Pre-Order');
	const isSoldOut = productType.toLowerCase() === 'beauty' ? data.availableForSale === true ? -1 : data.tags.findIndex((x: any) => x === 'Sold Out') : data.tags.findIndex((x: any) => x === 'Sold Out');

	const now = DateTime.now();
	const newArrival = DateTime.fromISO(data.publishedAt);
	const diff = now.diff(newArrival, ['days']).toObject();

	const isDiscount = productType.toLowerCase() === 'beauty' ? (data.availableForSale && Number(discountPrice) && (isPreOrderWithPrice === -1) && (isPreOrder === -1) && (isSoldOut === -1)) : (Number(discountPrice) && (isPreOrderWithPrice === -1) && (isPreOrder === -1) && (isSoldOut === -1)) ? true : false;
	const isNewArrival = ((diff.days! < 7) && (isPreOrderWithPrice === -1) && (isPreOrder === -1) && (isSoldOut === -1)) ? true : false;
	const isReadyStock = ((diff.days! > 7) && (isPreOrderWithPrice === -1) && (isPreOrder === -1) && (isSoldOut === -1)) ? true : false;


	return {
		shopifyId: data.id,
		title: data.title,
		handle: data.handle,
		isDiscount,
		isNewArrival,
		isReadyStock,
		isPreOrderWithPrice: isPreOrderWithPrice !== -1,
		isPreOrder: isPreOrder !== -1,
		isSoldOut: isSoldOut !== -1,
		isLive: isLiveProduct !== -1,
		availableForSale: data.availableForSale,
		productType,
		productTypeRaw: data.productType,
		completeness: data.completeness ? data.completeness.value : null,
		year: data.year ? data.year.value : null,
		condition: idxCondition !== -1 ? data.specificationsWatch[idxCondition].value.trim() : null,
		caseMaterial: caseIdx !== -1 ? data.specificationsWatch[caseIdx]?.value?.trim() : null,
		leatherMaterial: leatherIdx !== -1 ? data.specificationsBag[leatherIdx]?.value.trim() : null,
		jewelryMaterial: leatherIdx !== -1 ? data.specificationsJewelry[jewelryIdx]?.value.trim() : null,
		clasp: claspIdx !== -1 ? data.specificationsWatch[claspIdx]?.value.trim() : null,
		tag: data.tags,
		brand: data.vendor,
		specifications,
		variants: data.variants.nodes.map((variant: any) => {
			const originalPrice = variant.price.amount;
			const discountPrice = variant.compareAtPrice?.amount || null;

			return {
				shopifyId: variant.id,
				title: variant.title,
				sku: variant.sku,
				featureImageSrc: variant.image?.src,
				featureImageAlt: variant.image?.altText,
				stock: variant.quantityAvailable,
				price: Number(discountPrice) ? discountPrice : originalPrice,
				discountPrice: Number(discountPrice) ? originalPrice : discountPrice,
				availableForSale: variant.availableForSale,
			}
		}),
		variantType: data.options.map((type: any) => {
			const valueType = type.optionValues.map((value: any) => value.name);

			return {
				type: type.name,
				value: valueType,
			}
		}),
		thumbnails: data.thumbnails.edges.map((thumb: any) => thumb.node.originalSrc),
		price: Number(discountPrice) ? discountPrice : originalPrice,
		discountPrice: Number(discountPrice) ? originalPrice : discountPrice,
		country: idProduct !== -1 ? 'indonesia' : 'singapore',
		currency: idProduct !== -1 ? 'Rp' : 'SGD',
		featureImageSrc: data.featuredImage?.src,
		featureImageAlt: data.featuredImage?.altText?.trim(),
		gender: genderIdx !== -1 ? data.specificationsWatch[genderIdx].value : null,
		totalInventory: data.totalInventory,
		sku: sku,
		publishedAt: data.publishedAt,
		updatedAt: data.updatedAt,
		seo: {
			idLangTitle: idProduct !== -1 ? data.seo.title : data.seoIdTitle ? data.seoIdTitle?.value : null,
			idLangDesc: idProduct !== -1 ? data.seo.description : data.seoIdDesc ? data.seoIdDesc?.value : null,
			engLangTitle: idProduct !== -1 ? data.seoSgTitle ? data.seoSgTitle?.value : null : data.seo.title,
			engLangDesc: idProduct !== -1 ? data.seoSgDesc ? data.seoSgTitle?.value : null : data.seo.description,
		},
		collections: data?.node?.collections?.nodes?.map((collection: any) => {
			return {
				shopifyId: collection.id,
				title: collection.title,
				handle: collection.handle,
				category: collection.category ? collection.category.value : collection.category,
			}
		})
	}
}
