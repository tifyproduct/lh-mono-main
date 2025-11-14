interface HandleSignUpParams {
	email: string;
	firstName: string;
	lastName: string;
	phone: string;
	password: string;
	confirmPassword: string;
	store: string;
	selectedCode: string;
	setErrorMessage: (errorMessage: string) => void;
	setIsPasswordMismatch: (isMismatch: boolean) => void;
	setIsPasswordInvalid: (isInvalid: boolean) => void;
	setIsEmailRegistered: (isRegistered: boolean) => void;
	setIsLoading: (isLoading: boolean) => void;
	setIsPhoneCodeInvalid: (isInvalid: boolean) => void;
}

export const handleSignUp = async ({
	email,
	firstName,
	lastName,
	phone,
	password,
	confirmPassword,
	store,
	selectedCode,
	setErrorMessage,
	setIsPasswordMismatch,
	setIsPasswordInvalid,
	setIsEmailRegistered,
	setIsLoading,
	setIsPhoneCodeInvalid
}: HandleSignUpParams): Promise<void> => {
	setErrorMessage('');
	setIsPasswordMismatch(false);
	setIsPasswordInvalid(false);
	setIsEmailRegistered(false);

	if ((selectedCode === '+62' && store !== 'id') || (selectedCode === '+65' && store !== 'sg')) {
		setIsPhoneCodeInvalid(true);
		setErrorMessage('Country code does not match the selected store.');
		return;
	}

	setIsLoading(true);

	try {
		const payload = {
			email,
			firstName,
			lastName,
			phone: `${selectedCode}${phone}`,
			password,
			confirmPassword,
			store
		};

		const response = await fetch('/api/auths/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payload)
		});

		const result = await response.json();

		if (response.ok) {
			window.location.reload();
		} else {
			setErrorMessage(result.msg || 'Registration failed. Please try again.');
		}

		if (result.error === 'Email already registered') {
			setIsEmailRegistered(true);
			setErrorMessage('Email already registered');
		}
	} catch (error: any) {
		setErrorMessage('An error occurred. Please try again later.');
		console.error(error.message || error);
	} finally {
		setIsLoading(false);
	}
};
