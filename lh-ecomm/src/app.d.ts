// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			userShopifyToken: string | null;
			userId: string;
			userShopifyId: string | null;
			isOtpValid: boolean;
			requestIPAddress: string;
			// userInfo: {
			// 	id: string;
				// phone: string;
				// email: string;
				// firstName: string;
				// lastName: string;
				// shopifyId: string | null;
				// shopifyToken: string | null;
			// }
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
