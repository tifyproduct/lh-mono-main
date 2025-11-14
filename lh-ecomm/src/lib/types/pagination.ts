export interface Pagination {
	page: number;
	perPage: number;
	total: number;
	hasNext: boolean;
	hasPrevious: boolean;
}


export interface ShopifyPagination {
	"isFirstPage": boolean,
	"isLastPage": boolean,
	"isCurrentPage": boolean,
	"pageNumber": number,
	"cursor": null | string,
	"url": string
}