import { STORE, WA_MESSAGE, WA_NUMBER } from '../constants.util';
import type { CustomerProfile } from '$lib/types/customer';
import type { ZohoMiddlewareLeadsBodyRequest } from '$lib/types/zoho';

const getPhoneNumber = (storeLocation: string) => {
	if (storeLocation === STORE.sg) {
		return WA_NUMBER.SG_BUY;
	}
	return WA_NUMBER.ID_PHONE;
};

export const chatWhatsappRedirect = (country: string, message: string) => {
	const phoneNumber = getPhoneNumber(country);
	const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
	window.open(url, '_blank');
};

export const chatWhatsappServiceRedirect = (country: string, message: string) => {
	const phoneNumber = getPhoneNumber(country);
	const url = `https://api.whatsapp.com/send/?phone=${phoneNumber}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
	window.open(url, '_blank');
};

const zohoWebhookSendData = ({
	phoneNumber,
	currentUrl,
	brand,
	subbrand,
	firstname,
	lastname,
	email,
	utmCampaign,
	utmMedium,
	utmSource,
	utmTerm,
	utmContent,
	productId,
	customerId,
	referrer,
	leadSrc,
	salesCode,
	country,
	productName,
	productCategory
}: {
	email?: string | null;
	utmCampaign?: string | null;
	utmMedium?: string | null;
	utmSource?: string | null;
	utmTerm?: string | null;
	utmContent?: string | null;
	phoneNumber: string | null;
	firstname?: string | null;
	lastname?: string | null;
	currentUrl: string;
	brand?: string;
	subbrand?: string;
	productId?: string;
	customerId?: string;
	referrer?: string;
	leadSrc?: string;
	country?: string;
	salesCode?: string;
	productName?: string;
	productCategory?: string;
}): void => {
	const data: ZohoMiddlewareLeadsBodyRequest = {
		first_page_visited: currentUrl,
		referrer: referrer ?? '',
		chat_entry_point: currentUrl,
		utm_campaign: utmCampaign ?? '',
		utm_content: utmContent ?? '',
		utm_medium: utmMedium ?? '',
		utm_source: utmSource ?? '',
		utm_term: utmTerm ?? '',
		no_telp: phoneNumber ?? '',
		email: email ?? '',
		brand: brand ?? '',
		sub_brand: subbrand ?? '',
		product_name: productName ?? '',
		prod_cat: productCategory ?? '',
		item: productId ?? '',
		lead_src: leadSrc ?? '',
		lname: lastname ?? '',
		fname: firstname ?? '',
		customer_id: customerId ?? '',
		country: country ?? '',
		sales_code: salesCode ?? ''
	};

	if (!customerId) {
		return
	}

	// Define fetch request options
	const requestOptions: RequestInit = {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		},
		redirect: 'follow' as RequestRedirect
	};

	fetch(`/api/webhooks/zoho-middleware`, requestOptions)
		.then((response) => response.text())
		.catch((error) => console.error('Error:', error));
};

export const buySellWhatsappRedirect = ({
	type,
	storeLocation,
	productTitle,
	productId,
	collection,
	brand,
	subBrand,
	showCurrentUrl = true,
	customer,
	utmCampaign,
	utmMedium,
	utmSource,
	utmTerm,
	utmContent,
	referrer,
	leadSrc,
	salesCode
}: {
	type: 'buy' | 'sell';
	storeLocation: string;
	productTitle: string;
	productId: string;
	collection: string;
	brand: string;
	subBrand: string;
	showCurrentUrl?: boolean;
	customer: CustomerProfile | undefined;
	utmCampaign?: string | null;
	utmMedium?: string | null;
	utmSource?: string | null;
	utmTerm?: string | null;
	utmContent?: string | null;
	referrer?: string;
	leadSrc?: string;
	salesCode?: string;
}) => {
	const currentUrl = window.location.href;
	const lhphoneNumber = getPhoneNumber(storeLocation);
	const text = type === 'buy' ? WA_MESSAGE.BUY : WA_MESSAGE.SELL;

	const url = `https://api.whatsapp.com/send?phone=${lhphoneNumber}&text=${encodeURIComponent(text)} ${encodeURIComponent(collection)} Product: ${encodeURIComponent(brand)} - ${encodeURIComponent(productTitle)}. Can you assists? ${showCurrentUrl ? encodeURIComponent(currentUrl) : ''}`;
	window.open(url, '_blank');

	zohoWebhookSendData({
		phoneNumber: customer?.phone ?? '',
		currentUrl,
		brand,
		customerId: customer?.id ?? '',
		email: customer?.email ?? '',
		firstname: customer?.firstName ?? '',
		lastname: customer?.lastName ?? '',
		utmCampaign,
		utmMedium,
		utmSource,
		utmTerm,
		utmContent,
		referrer,
		leadSrc: leadSrc ?? 'Website',
		productId,
		productCategory: collection,
		productName: productTitle,
		subbrand: subBrand,
		country: storeLocation.toUpperCase(),
		salesCode,
	});
};

export const pdpWhatsappRedirect = ({
	country,
	message,
	brand,
	phoneNumber,
	subbrand,
	utmCampaign,
	utmMedium,
	utmSource,
	utmTerm,
	utmContent,
	firstname,
	lastname,
	email,
	productId,
	customerId,
	referrer,
	leadSrc,
	salesCode,
	productCategory,
	productName
}: {
	country: string;
	message: string;
	brand?: string;
	phoneNumber: string;
	subbrand?: string;
	utmCampaign?: string | null;
	utmMedium?: string | null;
	utmSource?: string | null;
	utmTerm?: string | null;
	utmContent?: string | null;
	firstname?: string;
	lastname?: string | null;
	email?: string | null;
	productId?: string;
	customerId?: string;
	productCategory?: string;
	productName?: string;
	referrer?: string;
	leadSrc?: string;
	salesCode?: string;
}) => {
	const currentUrl = window.location.href;
	const lhphoneNumber = getPhoneNumber(country);
	const url = `https://api.whatsapp.com/send?phone=${lhphoneNumber}&text=${encodeURIComponent(message)} ${encodeURIComponent(currentUrl)}`;
	window.open(url, '_blank');
	zohoWebhookSendData({
		phoneNumber,
		currentUrl,
		brand,
		subbrand,
		firstname,
		lastname,
		email,
		utmCampaign,
		utmMedium,
		utmSource,
		utmTerm,
		utmContent,
		productId,
		customerId,
		referrer,
		leadSrc,
		country: country.toUpperCase(),
		salesCode,
		productCategory,
		productName
	});
};

export const redirectToWhatsappSWU = (
	{
		country,
		type,
		customer,
		utmCampaign,
		utmMedium,
		utmSource,
		utmTerm,
		utmContent,
		referrer,
		leadSrc,
		salesCode,
		productCategory,
		productName
	}: {
		country: string;
		type: string;
		customer: CustomerProfile | undefined;
		utmCampaign?: string | null;
		utmMedium?: string | null;
		utmSource?: string | null;
		utmTerm?: string | null;
		utmContent?: string | null;
		referrer?: string;
		leadSrc?: string;
		salesCode?: string;
		productCategory?: string;
		productName?: string;
	}
) => {
	const currentUrl = window.location.href;
	let message: string = '';

	if (type === 'Consignment') {
		message = WA_MESSAGE.CONSIGNMENT;
	} else if (type === 'Trade-in') {
		message = WA_MESSAGE.TRADE_IN;
	} else {
		message = WA_MESSAGE.DIRECT_SELL;
	}

	const phoneNumber = getPhoneNumber(country);
	const url = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
	window.open(url, '_blank');

	zohoWebhookSendData({
		phoneNumber: customer?.phone || '',
		currentUrl: currentUrl,
		firstname: customer?.firstName || '',
		lastname: customer?.lastName || '',
		email: customer?.email || '',
		utmCampaign,
		utmMedium,
		utmSource,
		utmTerm,
		utmContent,
		country: country.toUpperCase(),
		salesCode,
		referrer,
		leadSrc,
		productCategory,
		productName
	});
};

export const redirectToWhatsapp = ({
	customer,
	firstName,
	lastName,
	phoneNumber,
	email,
	country,
	baseParams,
	pathname,
	collection,
	orderID,
	brand,
	subbrand,
	productId,
	utmCampaign,
	utmMedium,
	utmSource,
	utmTerm,
	utmContent,
	referrer,
	leadSrc,
	salesCode,
	productName
}: {
	customer: CustomerProfile | undefined;
	firstName: string;
	lastName: string;
	phoneNumber: string;
	email: string;
	country: string;
	baseParams: string;
	pathname: string;
	orderID?: string;
	collection?: string;
	brand?: string;
	subbrand?: string;
	productId?: string;
	utmCampaign?: string | null;
	utmMedium?: string | null;
	utmSource?: string | null;
	utmTerm?: string | null;
	utmContent?: string | null;
	referrer?: string;
	leadSrc?: string;
	salesCode?: string;
	productName?: string;
}) => {
	const currentUrl = window.location.href;
	const pageMapping = {
		'/watch-service': {
			message: WA_MESSAGE.SERVICE,
			label: 'Request a Service'
		},
		'/watch': {
			message: WA_MESSAGE.WATCH,
			label: 'Watch'
		},
		'/beauty': {
			message: WA_MESSAGE.PRODUCT('Beauty'),
			label: 'Beauty'
		},
		'/jewelry': {
			message: WA_MESSAGE.PRODUCT('Jewelry'),
			label: 'Jewelry'
		},
		'/bag': {
			message: WA_MESSAGE.PRODUCT('Bag'),
			label: 'Bag'
		},
		'/hermes': {
			message: WA_MESSAGE.PRODUCT('Hermès'),
			label: 'Hermès'
		},
		'/profile?page=order-history-contact': {
			message: WA_MESSAGE.ORDER_HISTORY(orderID || ''),
			label: 'Order'
		},
		'/profile?page=order-history-complain': {
			message: WA_MESSAGE.PROFILE_ORDER_COMPLAIN,
			label: 'Order'
		},
		'/search': {
			message: WA_MESSAGE.SEARCH,
			label: 'Search'
		},
		'': {
			message: WA_MESSAGE.HOMEPAGE(customer?.firstName || '', currentUrl),
			label: 'Homepage'
		}
	};

	let message: string = '';
	let matched: boolean = false;

	for (const path in pageMapping) {
		if (pathname === `${baseParams}${path}`) {
			message = pageMapping[path].message;
			matched = true;
			break;
		}
	}

	if (matched) {
		chatWhatsappRedirect(country, message);
	} else {
		let message;
		if (brand && collection) {
			message = `Hello Luxehouze, I have a question about this available ${collection} Product: ${brand}`;
			if (subbrand) {
				message += `-${subbrand}`;
			}
			message += `. Can you assist? ${currentUrl}`;
		} else if (orderID) {
			message = WA_MESSAGE.ORDER_HISTORY(orderID || '');
		} else {
			message = WA_MESSAGE.HOMEPAGE(firstName || '', currentUrl);
		}
		chatWhatsappRedirect(country, message);
	}

	zohoWebhookSendData({
		phoneNumber: phoneNumber,
		currentUrl,
		brand,
		subbrand,
		firstname: firstName,
		lastname: lastName,
		email: email,
		utmCampaign,
		utmMedium,
		utmSource,
		utmTerm,
		utmContent,
		productId,
		customerId: customer?.id,
		referrer,
		leadSrc,
		country: country.toUpperCase(),
		salesCode,
		productCategory: collection,
		productName
	});
};
