export interface SignInPayload {
	email: string;
	password: string;
}

export const performSignIn = async (payload: SignInPayload): Promise<any> => {
	const response = await fetch('/api/auths/sign-in', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || 'Sign-in failed');
	}

	return response.json();
};

export const saveCustomerDataToLocalStorage = (email: string): void => {
	const loginData = { emailFromLogin: email };
	const existingCustomerData = localStorage.getItem('customer')
		? JSON.parse(localStorage.getItem('customer')!)
		: {};

	const updatedCustomerData = {
		...existingCustomerData,
		...loginData
	};

	localStorage.setItem('customer', JSON.stringify(updatedCustomerData));
};
