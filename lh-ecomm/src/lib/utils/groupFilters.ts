/* eslint-disable @typescript-eslint/no-explicit-any */
const groupFilters = (filters: any[]) => {
	const groupedFilters: { [key: string]: string[] } = {};

	filters.forEach((filter) => {
		let key: string | undefined;
		let value: string = '';

		if (filter.tag) {
			key = 'tag';
			value = filter.tag;
		} else if (filter.productVendor) {
			key = 'productVendor';
			value = filter.productVendor;
		} else if (filter.productType) {
			key = 'productType';
			value = filter.productType;
		} else if (filter.price) {
			key = 'price';
			value = `min: ${filter.price.min}, max: ${filter.price.max}`;
		} else if (filter.productMetafield) {
			key = filter.productMetafield.key;
			value = filter.productMetafield.value;
		}

		if (key) {
			if (!groupedFilters[key]) {
				groupedFilters[key] = [];
			}

			if (!groupedFilters[key].includes(value)) {
				groupedFilters[key].push(value);
			}
		}
	});

	return groupedFilters;
};

export default groupFilters;
