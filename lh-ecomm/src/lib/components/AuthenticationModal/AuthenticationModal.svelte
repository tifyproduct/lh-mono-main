<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import CheckEmailContent from './CheckEmailContent.svelte';
	import Loading from '$lib/components/Common/Loading.svelte';
	import SignInContent from './SignInContent.svelte';
	import ForgotPasswordContent from './ForgotPasswordContent.svelte';
	import SignUpContent from './SignUpContent.svelte';
	import PhoneContent from './PhoneContent.svelte';
	import { page } from '$app/stores';
	import { showAuthenticationModal } from '$lib/stores/authentication';
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher();
	let redirectPath: string | null = '';

	$: {
		redirectPath = $page.url.searchParams.get('redirect');
	}

	let isLoading = false;
	let isSignIn = false;
	let isSignUp = false;
	let isForgotPass = false;
	let isUpdatePhone = false;
	let errorMessage: string | null = null;
	export let credentialSoc;

	const loadingShow = () => {
		isLoading = true;
	};

	const loadingHide = () => {
		isLoading = false;
	};

	const closeModal = () => {
		if (!isUpdatePhone) {
			isLoading = false;
			isSignIn = false;
			isSignUp = false;
			isUpdatePhone = false;
			dispatch('close');
		} else {
			isLoading = false;
			isSignIn = false;
			isSignUp = false;
			isUpdatePhone = false;
			dispatch('close-success');
		}
	};

	const closeSuccessModal = async () => {
		isLoading = false;
		isSignIn = false;
		isSignUp = false;
		isUpdatePhone = false;
		if (redirectPath) {
			$showAuthenticationModal = false;
			await goto(`/${$page.params.store}/${$page.params.lang}/${redirectPath}`);
			return;
		}
		dispatch('close-success');
	};

	const showSignIn = (e: any) => {
		email = e?.detail?.email;
		isSignIn = true;
		isForgotPass = false;
	};

	const showUpdatePhone = (e: any) => {
		email = e.detail.email;
		isSignIn = false;
		isForgotPass = false;
		isUpdatePhone = true;
	};

	const showSignUp = (e: any) => {
		email = e.detail.email;
		isSignUp = true;
	};

	const showForgotPass = (e: any) => {
		isSignIn = false;
		isForgotPass = true;
	};

	const handleError = (e: CustomEvent) => {
		errorMessage = e.detail.message;
		console.error('Error received from CheckEmailContent:', errorMessage);
		dispatch('error', { message: e.detail.message });
	};

	const clearError = () => {
		errorMessage = null;
	};
</script>

<div class="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.7)]">
	<div
		class="mx-auto flex flex-col gap-2.5 w-full h-[90vh] md:h-fit md:w-[544px] p-7 md:rounded-lg border border-black bg-white-1"
	>
		<button class="flex justify-end -mt-[15px] -mr-[15px] cursor-pointer" on:click={closeModal}>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M12.0002 10.586L16.9502 5.63599L18.3642 7.04999L13.4142 12L18.3642 16.95L16.9502 18.364L12.0002 13.414L7.05023 18.364L5.63623 16.95L10.5862 12L5.63623 7.04999L7.05023 5.63599L12.0002 10.586Z"
					fill="#ADB0BA"
				/>
			</svg>
		</button>
		<div class="flex justify-center">
			<img class="max-w-[200px]" src="/img/main-logo.png" alt="Main Logo" />
		</div>

		{#if !isSignIn && !isSignUp && !isForgotPass && !isUpdatePhone}
			<CheckEmailContent
				{credentialSoc}
				on:loading-on={loadingShow}
				on:loading-off={loadingHide}
				on:signin={showSignIn}
				on:signup={showSignUp}
				on:close-success={closeSuccessModal}
				on:phone-update={showUpdatePhone}
				on:error={handleError}
			/>
		{:else if isUpdatePhone}
			<PhoneContent
				{email}
				on:loading-on={loadingShow}
				on:loading-off={loadingHide}
				on:close-success={closeSuccessModal}
			/>
		{:else if isSignIn}
			<SignInContent
				{email}
				on:loading-on={loadingShow}
				on:loading-off={loadingHide}
				on:close-success={closeSuccessModal}
				on:forgot-show={showForgotPass}
			/>
		{:else if isSignUp}
			<SignUpContent
				{email}
				on:loading-on={loadingShow}
				on:loading-off={loadingHide}
				on:close-success={closeSuccessModal}
			/>
		{:else if isForgotPass}
			<ForgotPasswordContent on:return-signin={showSignIn} />
		{/if}

		<Loading state={isLoading} />
	</div>
</div>
