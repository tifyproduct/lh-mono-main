import { performSignIn, saveCustomerDataToLocalStorage } from './signIn';

interface HandleSignInParams {
	signInEmail: string;
	signInPassword: string;
	setIsLoading: (isLoading: boolean) => void;
	setErrorMessageSignIn: (errorMessage: string) => void;
	setShowLoadingModal: (isVisible: boolean) => void;
	setIdFromCheck: (id: string) => void;
	setShowOTPModal: (isVisible: boolean) => void;
	setShowModalNewPassword: (isVisible: boolean) => void;
}

export const handleSignIn = async ({
	signInEmail,
	signInPassword,
	setIsLoading,
	setErrorMessageSignIn,
	setIdFromCheck,
	setShowOTPModal,
	setShowModalNewPassword
}: HandleSignInParams): Promise<void> => {
	setIsLoading(true);
	try {
		const payloadCheck = {
			email: signInEmail
		};

		const responseCheck = await fetch('/api/auths/sign-in/status', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(payloadCheck)
		});

		if (!responseCheck.ok) {
			const errorData = await responseCheck.json();
			throw new Error(errorData.error);
		}

		const resultCheck = await responseCheck.json();

		if (resultCheck?.data?.isSocialAccount) {
			if (resultCheck?.data?.hasSetPassword) {
				const resultSignIn = await performSignIn({
					email: signInEmail,
					password: signInPassword
				});

				if (resultSignIn?.accessToken) {
					saveCustomerDataToLocalStorage(signInEmail);
					window.location.reload();
				}
			} else {
				if (resultCheck?.data?.hasPhoneNumber) {
					if (resultCheck?.data?.isValidPhoneNumber) {
						const payload = {
							email: signInEmail
						};
						const response = await fetch('/api/auths/send-reset-password', {
							method: 'POST',
							headers: {
								'Content-Type': 'application/json'
							},
							body: JSON.stringify(payload)
						});

						const result = await response.json();
						if (result.message === 'Successfully send reset password') {
							setIdFromCheck(result?.data?.userId);
							setShowModalNewPassword(true);
						} else {
							console.log('Error');
						}
					}
				} else {
					const payload = {
						email: signInEmail
					};
					const response = await fetch('/api/auths/send-reset-password', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify(payload)
					});

					const result = await response.json();
					if (result.message === 'Successfully send reset password') {
						setIdFromCheck(result?.data?.userId);
						setShowOTPModal(true);
					} else {
						console.log('Error');
					}
				}
			}
		} else {
			const resultSignIn = await performSignIn({
				email: signInEmail,
				password: signInPassword
			});

			if (resultSignIn?.accessToken) {
				saveCustomerDataToLocalStorage(signInEmail);
				window.location.reload();
			}
		}
	} catch (error: any) {
		console.error('Error during sign-in:', error.message);
		setErrorMessageSignIn(error.message);
	} finally {
		setIsLoading(false);
	}
};
