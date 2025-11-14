import type { AddressInput } from '$lib/types/address';

export const createAddress = async (input: AddressInput) => {
	const res = await fetch('/api/customer/address', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			address1: input.address1,
			address2: input.address2,
			company: input.company,
			firstName: input.firstName,
			lastName: input.lastName,
			phone: input.phone,
			country: input.country,
			province: input.province,
			city: input.city,
			zip: input.zip,
			default: input.default,
		})
	});

	const result = await res.json();

	if (result.status !== 201 ) {
		console.error(result.errors);
		throw new Error('Failed to create address');
	}
};

export const updateAddress = async (selectedAddressId: string, addressData: AddressInput) => {
	const res = await fetch(`/api/customer/address/${selectedAddressId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			...addressData
		})
	});

	const result = await res.json();

	if (result.status !== 200 ) {
		console.error(result.errors);
		throw new Error('Failed to update address');
	}
};

export const deleteAddress = async (selectedAddressId: string) => {
	const res = await fetch(`/api/customer/address/${selectedAddressId}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const result = await res.json();

	if (result.status !== 200 ) {
		console.error(result.errors);
		throw new Error('Failed to delete address');
	}
};

export const setAsDefaultAddress = async (selectedAddressId: string) => {
	const res = await fetch(`/api/customer/address/${selectedAddressId}/set-default`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			isDefault: true,
		})
	});

	const result = await res.json();

	if (result.errors) {
		console.error(result.errors);
		throw new Error('Failed to update default address');
	}
};
