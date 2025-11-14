<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import Modal from '../Modal/Modal.svelte';
	import type { CustomerProfile } from '$lib/types/customer';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	import UpdateModal from './UpdateModal.svelte';

	export let showLoadingModal: boolean = false;
	export let userEmail: string | undefined;
	export let userPassword: string | undefined;
	export let customer: CustomerProfile | undefined;
	export let IdFromCheck;

	let errorMessageSignIn: string = '';
	let errorMessageSignInTimeOut: string = '';
	let countdown = 10;

	let showUpdateModal = false;

	const startCountdown = () => {
		const interval = setInterval(() => {
			if (countdown > 0) {
				countdown--;
				errorMessageSignInTimeOut = `Timeout Issue, Please retry in ${countdown} seconds`;
			} else {
				clearInterval(interval);
				errorMessageSignInTimeOut = '';
			}
		}, 1000);
	};

	const handleLogin = async () => {
		try {
			const payload = {
				email: userEmail,
				password: userPassword
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
				const loginData = { emailFromLogin: userEmail };
				const existingCustomerData = localStorage.getItem('customer')
					? JSON.parse(localStorage.getItem('customer'))
					: {};

				const updatedCustomerData = {
					...existingCustomerData,
					...loginData
				};

				localStorage.setItem('customer', JSON.stringify(updatedCustomerData));
			}

			if (result.error) {
				errorMessageSignIn = result.error;
			}
		} catch (error) {
			errorMessageSignInTimeOut = `Timeout Issue, Please retry in ${countdown} seconds`;
			startCountdown();
		} finally {
			setTimeout(() => {
				showUpdateModal = true;
			}, 2000);
		}
	};

	$: if (showLoadingModal) {
		setTimeout(() => {
			handleLogin();
		}, 1000);
	}

	const closeModal = () => {
		showLoadingModal = false;
	};
</script>

<Modal
	isOpen={showLoadingModal && !showUpdateModal}
	title=" "
	onClose={closeModal}
	padding="p-4 lg:p-7"
	fullScreenMobile
>
	<div class="flex justify-center">
		<img class="max-w-[200px]" src="/img/main-logo.png" alt="Main Logo" />
	</div>
	<div class="justify-center mt-8 grid">
		<img
			src="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/9e8985ad6fabf1ebbd69843676fbdc8c.gif?v=1733838197"
			alt="loading"
		/>
		<Text type="body-2" color="black-5" class="mt-12">Getting you signed in...</Text>
	</div>
</Modal>

{#if showUpdateModal}
	<UpdateModal
		bind:showUpdateModal
		{customer}
		{IdFromCheck}
		on:closeModal={() => {
			showLoadingModal = false;
			showUpdateModal = false;
		}}
	/>
{/if}
