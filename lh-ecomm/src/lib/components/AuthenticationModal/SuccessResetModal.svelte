<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Modal from '../Modal/Modal.svelte';

	export let isModalSuccessResetOpen: boolean = false;
	export let userEmail: string | undefined;
	export let userPassword: string | undefined;

	$: currentUrl = window.location.href;

	const closeModal = async () => {
		try {
			const payload = {
				email: signInEmail,
				password: signInPassword
			};

			const response = await fetch('/api/auths/sign-in', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (result.accessToken) {
				const loginData = {
					emailFromLogin: signInEmail
				};

				const existingCustomerData = localStorage.getItem('customer')
					? JSON.parse(localStorage.getItem('customer'))
					: {};

				const updatedCustomerData = {
					...existingCustomerData,
					...loginData
				};

				localStorage.setItem('customer', JSON.stringify(updatedCustomerData));
				window.location.href = currentUrl;
			}
			if (result.error) {
				console.log('');
			}
		} catch (error) {
			console.log('');
		}
	};

	let signInEmail = userEmail;
	let signInPassword = userPassword;

	const goToHomePage = async () => {
		try {
			const payload = {
				email: signInEmail,
				password: signInPassword
			};

			const response = await fetch('/api/auths/sign-in', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (result.accessToken) {
				const loginData = {
					emailFromLogin: signInEmail
				};

				const existingCustomerData = localStorage.getItem('customer')
					? JSON.parse(localStorage.getItem('customer'))
					: {};

				const updatedCustomerData = {
					...existingCustomerData,
					...loginData
				};

				localStorage.setItem('customer', JSON.stringify(updatedCustomerData));
				window.location.href = '/';
			}
			if (result.error) {
				console.log('');
			}
		} catch (error) {
			console.log('');
		}
	};
</script>

<Modal
	isOpen={isModalSuccessResetOpen}
	title=" "
	onClose={closeModal}
	padding="p-4 lg:p-7"
	fullScreenMobile
>
	<div class="flex justify-center">
		<img class="max-w-[200px]" src="/img/main-logo.png" alt="Main Logo" />
	</div>
	<hr style="border: none; border-top: 1px solid #E9EBF0;" class="mt-8" />
	<div class="text-center mt-8 grid">
		<Text type="subtitle-2" color="black-9" weight="semibold">All Set!</Text>
		<Text type="body-1" color="black-9">
			We’ve successfully updated your password. You can now continue shopping again.
		</Text>
		<Button variant="primary" onClick={goToHomePage} class="mt-12 w-full py-4 mt-8"
			>GO TO HOMEPAGE
		</Button>
	</div>
</Modal>
