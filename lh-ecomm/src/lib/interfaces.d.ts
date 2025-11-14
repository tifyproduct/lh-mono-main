export interface ProductsQueryParams {
	handle: string;
	filters: Array<string>;
	sortKey: string;
	reverse: boolean;
	after?: string;
	before?: string;
	first?: number;
	last?: number;
}

export interface GetProductsQueryParams {
	query: string;
	reverse: boolean;
	sortKey: string;
	after?: string;
	before?: string;
	first?: number;
	last?: number;
}
