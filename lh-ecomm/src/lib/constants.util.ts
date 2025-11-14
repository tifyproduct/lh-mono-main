export const STORE = {
	id: 'id',
	sg: 'sg',
	beauty: 'beauty'
};

export const LANG = {
	id: 'id',
	en: 'en'
};

export const EXCLUSIVE_BRANDS = ['rolex', 'hermes', 'dior'];

export const RECENTLY_VIEWED_COOKIES_NAME = 'lh_rvp';
export const SHOPIFY_TOKEN_COOKIES_NAME = 'lh_access';
export const AUTH_TOKEN_COOKIES_NAME = 'lh_auth_token';
export const CACHE_COOKIES_NAME = 'lh_cache';

export const TEMP_TOKEN_COOKIES_NAME = 'lh_temp_access';
export const CART_COOKIES_NAME = 'lh_cart';
export const OTP_VALID_COOKIES_NAME = 'lh_otp_valid';
export const SHOW_GOOGLE_LOGIN_COOKIES_NAME = 'lh_show_google_login';

export const badgeFlag = {
	PRE_ORDER: 'Pre-Order',
	PO_WITH_PRICE: 'PO with Price',
	NEW_ARRIVAL: 'New Arrival',
	SOLD_OUT: 'Sold Out'
};

export const productType = {
	BEAUTY: 'beauty',
	WATCH: 'watch',
	BAG: 'bag',
	JEWELRY: 'jewelry',
	ACCESSORIES: 'accessories',
	ALL: ['watch', 'bag', 'beauty', 'jewelry', 'accessories']
};

export const WA_NUMBER = {
	ID_PHONE: '6287888880803',
	SG_BUY: '6598625974'
};

export const WA_MESSAGE = {
	BUY: 'Hello Luxehouze, I have a question about this available',
	SELL: 'Hi Luxehouze! I have some questions about the sell my watch process at Luxehouze. Could you guide me for this',
	SERVICE: 'Hi Luxehouze! I would like to know more about Luxehouze services.',
	PDP: 'Hello Luxehouze, I have a question about this available {collection} Product: {ProductVendor} - {ProductTitle}. Can you assists?',
	HOMEPAGE: (name: string, url: string) =>
		`Hello Luxehouze! ${name ? `My name is ${name}.` : ''} I've browsed through your homepage and would love to learn more. Can you assist me? ${url}`,
	PRODUCT: (category: string) => `I need more details about ${category} Product.`,
	WATCH: 'I need more details about your Watch Product.',
	CONSIGNMENT:
		'Hi Luxehouze! I have some questions about the Consignment process at Luxehouze. Could you guide me?',
	DIRECT_SELL:
		'Hi Luxehouze! I’m keen on learning more about your Direct-Sell program. Can you provide more details?',
	TRADE_IN: "Hi Luxehouze! I'm interested in learning more about Trade-in.",
	PROFILE_ORDER_CONTACT:
		'Hi Luxehouze! I have some questions about my order at Luxehouze. Could you guide me for this',
	ORDER_HISTORY: (orderId: string) =>
		`Hello Luxehouze, I need some details regarding my processed order ${orderId}. Can you help?`,
	PROFILE_ORDER_COMPLAIN: 'Hi Luxehouze! I have issue with my order',
	SEARCH: 'Hi Luxehouze! I have question related to item i want to search'
};

export const COMMUNITY_GROUP = {
	ID: 'https://bit.ly/TelegramWatchesID',
	SG: 'https://bit.ly/TelegramWatchesSG'
};

export const LABEL_BADGE = {
	OUT_OF_STOCK: 'OUT OF STOCK',
	SOLD_OUT: 'SOLD OUT',
	PRE_ORDER: 'PRE-ORDER',
	SALE: 'SPECIAL PRICE',
	NEW_ARRIVAL: 'NEW ARRIVAL'
};

export const LABEL_ALLOWED = [
	'OUT OF STOCK',
	'SOLD OUT',
	'PRE-ORDER',
	'SPECIAL PRICE',
	'NEW ARRIVAL'
];

export const AUTH_METHOD_SOCIAL_LOGIN_GOOGLE = 'social-login-google';
export const AUTH_METHOD_FORM = 'auth-form';
export const AUTH_METHOD_MANUAL_ACTIVATION = 'manual-activation';

export const FREEBIES_TAG = 'Freebies';
export const TESTING_TAG = 'Testing';
export const EXCLUDED_TAGS = [TESTING_TAG, FREEBIES_TAG];

export const MAX_RECENTLY_VIEWED_PRODUCT_COUNT = 30;

export const BUSINESS_ID_API_ID = 'ChIJ84aS8MrxaS4Rjk6MvBAQFVI';
export const BUSINESS_ID_API_SG = 'ChIJbz_t95AZ2jERpu5ce4It9eU';
export const RESET_PASSWORD_EMAIL_SUBJECT = 'Verification Code to Reset Password';

// Regex
export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
export const authPhoneRegex = /^[\+]?[(]?[0-9]*[)]?[-\s\.]?[0-9]*[-\s\.]?[0-9]*$/;

// Filter to convert store to database value
export const COUNTRY = {
	ID: 'indonesia',
	SG: 'singapore'
};

export const APP_MODE = {
	PROD: 'PROD',
	DEV: 'DEV'
};
