export type ZohoMiddlewareLeadsBodyRequest = {
	first_page_visited: string;
	referrer: string;
	chat_entry_point: string;
	utm_campaign: string;
	utm_medium: string;
	utm_source: string;
	utm_term: string;
	utm_content: string;
	no_telp: string;
	email: string;
	brand: string;
	sub_brand: string;
	product_name: string;
	item: string;
	lead_src: string;
	lname: string;
	fname: string;
	customer_id: string;
	country: string;
	sales_code: string;
	prod_cat: string;
};

export type ZohoSwuBodyRequest = {
	customer_name: string;
	no_telp: string;
	email: string;
	country: string;
	lead_src: string;
	utm_campaign: string;
	utm_medium: string;
	utm_source: string;
	utm_term: string;
	utm_content: string;
	prod_cat: string;
	sell_type: string;
	sales_code: string;
	referrer: string;
	first_page_visited: string;
	chat_entry_point: string;
	watch_data: {
		brand_name: string;
	};
	hermes_data: {
		model: string;
	};
};
