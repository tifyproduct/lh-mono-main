export interface StockReminderPayload {
	name: string;
	phone: string;
	productId: string;
}

export const createStockReminder = async ({ name, phone, productId }: StockReminderPayload) => {
	const res = await fetch('/api/products/stock-reminder', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			payload: {
				name,
				phone,
				productId
			}
		})
	});

	const result = await res.json();

	if (result.errors) {
		console.error(result.errors);
		throw new Error('Failed to create stock reminder');
	}
};
