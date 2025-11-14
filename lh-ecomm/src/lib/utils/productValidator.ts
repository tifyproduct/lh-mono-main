import { badgeFlag, LABEL_BADGE, productType } from '../constants.util';
import type { ProductShowPriceValidator } from '../types/product';
import { DateTime } from 'luxon';

function showProductPrice({ tags, price, totalInventory = 0, type }: ProductShowPriceValidator) {
	if (tags.includes(badgeFlag.PO_WITH_PRICE) && Number(price) > 0) {
		return true;
	} else if (Number(price) > 0 && totalInventory > 0) {
		return true;
	} else if (type.toLowerCase() === productType.BAG && totalInventory < 1) {
		return true;
	} else if (type.toLowerCase() === productType.BEAUTY) {
		return true;
	} else if (Number(price) > 0 && totalInventory === 0 && !tags.includes(badgeFlag.SOLD_OUT) && !tags.includes(badgeFlag.PRE_ORDER)) {
		return true;
	}

	return false;
}

function typeValidator({ tags, productType }: { tags: Array<string>, productType: string }) {
	const isWatch = tags.findIndex((x: string) => x.toLowerCase().includes('watch'));
	const isBeauty = tags.findIndex((x: string) => x.toLowerCase().includes('beauty'));
	const isBag = productType.includes('bag') ? 1 : tags.findIndex((x: string) => x.toLowerCase().includes('bag'));
	const isJewelry = tags.findIndex((x: string) => x.toLowerCase().includes('jewelry'));

	return isWatch != -1
		? 'Watch'
		: isBeauty != -1
			? 'Beauty'
			: isBag != -1
				? 'Bag'
				: isJewelry != -1
					? 'Jewelry'
					: '-';
}

function showLabelProduct({ 
	tag, 
	totalInventory = 0, 
	sale, 
	updateTime, 
	type, 
	openForSale 
} : { 
	tag: string[], 
	totalInventory: number, 
	sale: boolean, 
	updateTime: string, 
	type: string, 
	openForSale: boolean 
}) {
	const tags: Array<string> = [];

	const now = DateTime.now();
	const newArrival = DateTime.fromISO(updateTime);
	const diff = now.diff(newArrival, ['days']).toObject();

	if ((type.toLowerCase() === productType.BEAUTY)) {
		if (sale) {
			tags.push(LABEL_BADGE.SALE);
		} else if(tag.includes(badgeFlag.SOLD_OUT) && !openForSale) {
			tags.push(LABEL_BADGE.OUT_OF_STOCK);
		}
	} else if (sale && totalInventory > 0) {
		tags.push(LABEL_BADGE.SALE);
	} else if (tag.includes(badgeFlag.PO_WITH_PRICE)) {
		tags.push(LABEL_BADGE.PRE_ORDER);
	} else if (tag.includes(badgeFlag.PRE_ORDER)) {
		tags.push(LABEL_BADGE.PRE_ORDER);
	} else if ((diff.days! < 7) && (!tag.includes(badgeFlag.SOLD_OUT)) && (!tag.includes(badgeFlag.PRE_ORDER)) && (!tag.includes(badgeFlag.PO_WITH_PRICE))) {
		tags.push(LABEL_BADGE.NEW_ARRIVAL);
	} else if (tag.includes(badgeFlag.SOLD_OUT)) {
		tags.push(LABEL_BADGE.SOLD_OUT);
	} else if (sale) {
		if ((type.toLowerCase() !== productType.BAG) && (type.toLowerCase() !== productType.WATCH)) {
			tags.push(LABEL_BADGE.SALE);
		}
	}else if (totalInventory < 1) {
		if ((type.toLowerCase() !== productType.BAG) && (type.toLowerCase() !== productType.WATCH)) {
			tags.push(LABEL_BADGE.SOLD_OUT);
		}
	}

	return tags;
}

function isPreOrder(tags: Array<string>) {
	if (tags.includes(badgeFlag.PRE_ORDER)) {
		return true;
	} else if (tags.includes(badgeFlag.PO_WITH_PRICE)) {
		return true;
	}

	return false;
}

function isNewArrival(tags: Array<string>, updateTime: any, totalInventory: number) {
	const now = DateTime.now();
	const newArrival = DateTime.fromISO(updateTime);
	const diff = now.diff(newArrival, ['days']).toObject();

	if ((diff.days! < 7 ) && (!tags.includes(badgeFlag.SOLD_OUT)) && (!tags.includes(badgeFlag.PRE_ORDER)) && (!tags.includes(badgeFlag.PO_WITH_PRICE))) {
		return true;
	}

	return false;
}

function isOutOfStock(tags: Array<string>, totalInventory: number, type: string, productVariants: any, openForSale: boolean | undefined) {
	const haveStockInOtherVariant = productVariants ? productVariants.findIndex((x) => (x.quantityAvailable > 0)) !== -1 : false;

	if (totalInventory < 1 && type.toLowerCase() === productType.WATCH && tags.includes(badgeFlag.SOLD_OUT)) {
		return true;
	} else if (type.toLowerCase() === productType.BEAUTY && totalInventory < 1 && openForSale) {
		return false;
	} else if (type.toLowerCase() === productType.BEAUTY && totalInventory < 1 && tags.includes(badgeFlag.SOLD_OUT) && !haveStockInOtherVariant) {
		return true;
	} else if (type.toLowerCase() === productType.BEAUTY && totalInventory > 0) {
		return false;
	}

	return tags.includes(badgeFlag.SOLD_OUT);
}

function specificationProductBasedOnType({ specifications }) {
	const specs = specifications?.map((spec) => {
		if (spec?.key === 'brands') {
			return {
				key: 'brand',
				value: spec?.value
			};
		} else if (spec?.key === 'brands') {
			return {
				key: 'brand',
				value: spec?.value
			};
		} else if (spec?.key.includes('pendant')) {
			return {
				key: spec?.key.replace('_', '').replace('pendant', 'pendant_'),
				value: spec?.value
			};
		} else if (spec?.key.includes('chain')) {
			return {
				key: spec?.key.replace('_', '').replace('chain', 'chain_'),
				value: spec?.value
			};
		} else if (spec?.key.includes('hermes')) {
			return {
				key: spec?.key.replace('hermes_', ''),
				value: spec?.value
			};
		} else if (spec?.key.includes('_import')) {
			return {
				key: spec?.key.replace('_import', ''),
				value: JSON.stringify([spec?.value]),
			};
		} else {
			return spec;
		}
	});

	return specs?.filter((item) => item);
}

export {
	showProductPrice,
	isPreOrder,
	isNewArrival,
	showLabelProduct,
	isOutOfStock,
	typeValidator,
	specificationProductBasedOnType
};
