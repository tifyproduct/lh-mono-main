import type { ObjectId } from "mongodb";

export interface ShopifyAddressData {
	id: string;
	address1: string;
	address2: string;
	company: string;
	firstName: string;
	lastName: string;
	phone: string;
	country: string;
	province: string;
	city: string;
	zip: string;
	default: boolean;
}

// address entity mongoDB
export interface Address {
	_id?: ObjectId;
	userId: string;
	address1: string;
	address2: string;
	company: string;
	firstName: string;
	lastName: string;
	phone: string;
	country: string;
	province: string;
	city: string;
	zip: string;
	default: boolean;
}

export interface AddressInput {
	address1: string;
	address2: string;
	company: string;
	firstName: string;
	lastName: string;
	phone: string;
	country: string;
	province: string;
	city: string;
	zip: string;
	default?: boolean;
};
