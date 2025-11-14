export const currencyFormat = (value: number, storeLocation: string) => {
	const isSg = storeLocation === 'sg';
	const locales = isSg ? 'en-sg' : 'id-ID';
	const currency = isSg ? 'SGD' : 'IDR';
	const currencyDisplay = isSg ? 'code' : 'symbol';

	const formatter = new Intl.NumberFormat(locales, {
		style: 'currency',
		currency: currency,
		currencyDisplay: currencyDisplay
	});

	return formatter.format(value);
};

// "bracelet_material" to "Bracelet Material"
export const titleCaseFormat = (string: string) => {
	return string
		.split('_')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
};

// Discount Percentage
export function discountPercentage(maxPrice: string, minPrice: string) {
	return ((Number(maxPrice) - Number(minPrice)) / Number(maxPrice)) * 100;
}

// URL Formatter
export function productUrlFormatter(store: string, lang: string, product: any, type: string) {
	return `/${store}/${lang}/product/${type}/${product.handle}`.toLowerCase();
}

export function navigationUrlFormatter({
	handle,
	previousLink,
	categoryParent
}: {
	handle: string;
	previousLink: string | null;
	categoryParent: string;
}) {
	if (previousLink) {
		return `${previousLink}/${handle === 'hermes' ? 'bags/' : categoryParent ? `${categoryParent}/` : ''}${handle}`.toLowerCase();
	}

	return null;
}

export function buildCheckoutURL(baseURL: string, items: Array<[string, number]>): string {
	if (!baseURL || items.length === 0) {
		return '';
	}

	const cartItems = items.map(([id, quantity]) => `${id}:${quantity}`).join(',');
	return `${baseURL}/cart/${cartItems}`;
}

export function censorName(fullName: string): string {
	if (!fullName) {
		return '*';
	}

	const nameParts = fullName.trim().split(/\s+/);

	const censorNamePart = (name: string, isFirstName: boolean = false): string => {
		if (isFirstName) {
			if (name.length > 3) {
				return `${name.slice(0, 2)}${'*'.repeat(name.length - 2)}`;
			} else {
				return `${name[0]}${'*'.repeat(name.length - 1)}`;
			}
		} else {
			if (name.length > 4) {
				return `${name[0]}${'*'.repeat(name.length - 1)}`;
			} else {
				return `${name[0]}${'*'.repeat(name.length - 1)}`;
			}
		}
	};

	if (nameParts.length === 1) {
		return censorNamePart(nameParts[0], true);
	}

	const censoredFirstName = censorNamePart(nameParts[0], true);
	const censoredMiddleAndLastNames = nameParts
		.slice(1)
		.map((name) => censorNamePart(name))
		.join(' ');

	return `${censoredFirstName} ${censoredMiddleAndLastNames}`;
}

export function seoDefaultGenerate(section: string): string {
	if (section === 'title') {
		return `Luxehouze`;
	} else {
		return `Luxury Marketplace`;
	}
}

export function getLast8Digits(phoneNumber: string): string {
    // Remove any non-digit characters
    const cleanedNumber = phoneNumber.replace(/\D/g, '');
    console.log(cleanedNumber)

    if (cleanedNumber.length < 8) {
        throw new Error("Phone number must contain at least 8 digits.");
    }

    return cleanedNumber.slice(-8);
}