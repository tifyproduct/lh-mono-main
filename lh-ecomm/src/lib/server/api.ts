export function formDataToJson(formData: FormData): object {
	let body = {};

	formData.forEach((value, key) => {
		body = {
			...body,
			[key]: value
		};
	});

	return body;
}
