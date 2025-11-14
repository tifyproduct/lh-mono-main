export const googleAnalClickedEvent = (eventName: string, attributes: Object) => {
	window.dataLayer = window.dataLayer || [];

	window.dataLayer.push({
		event: eventName,
		...attributes
	});
};

export const googleAnalClickProduct = (eventName: string, product: any) => {
	window.dataLayer = window.dataLayer || [];

	window.dataLayer.push({
		event: eventName,
		product: {
			name: product.name,
			category: product.category,
			collection: product.collection
		}
	});
};
