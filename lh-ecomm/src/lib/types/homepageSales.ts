import type { ProductData } from './product';

export interface HomepageSales {
	title: string;
	handle: string;
	products: ProductData[];
	expiredSale: {
		type: string;
		value: string;
	};
}
