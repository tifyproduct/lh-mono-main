<script lang="ts">
	import { onMount } from 'svelte';
	import { Tabs, TabItem, Input, Label, Helper, Spinner } from 'flowbite-svelte';
	import {
		EyeFillSystem,
		EyeOffFillSystem,
		InformationLineSystem,
		CouponLineFinance,
		Notification3LineMedia,
		StarLineSystem,
		SubtractLineSystem,
		CheckFillSystem
	} from 'svelte-remix';
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Modal from '../Modal/Modal.svelte';
	import ForgotPasswordModal from './ForgotPasswordModal.svelte';
	import { phoneRegex } from '$lib/constants.util';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { showAuthenticationModal } from '$lib/stores/authentication';
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import NewSocialLogin from './NewSocialLogin.svelte';
	import LoadingModal from './LoadingModal.svelte';
	import type { CustomerProfile } from '$lib/types/customer';
	import { handleSignIn as externalHandleSignIn } from '$lib/utils/handleSignIn';
	import { handleSignUp as externalHandleSignUp } from '$lib/utils/handleSignUp';
	import OTPModal from './OTPModal.svelte';
	import NewPasswordModal from './NewPasswordModal.svelte';
	import NewPasswordOtpModal from './NewPasswordOTPModal.svelte';

	const dispatch = createEventDispatcher();

	export let isModalOpen: boolean = true;
	export let credentialSoc;
	export let showGoogleLogin: boolean = false;
	export let customer: CustomerProfile | undefined;

	let showPasswordSignIn = false;
	let showPasswordSignUp = false;
	let showConfirmPassword = false;
	let isLoading = false;

	const closeModal = () => {
		isModalOpen = false;
	};

	let activeTab = 'SignIn';

	onMount(() => {
		const customerExists = localStorage.getItem('customer');
		const userExists = localStorage.getItem('user');
		if (customerExists || userExists) {
			activeTab = 'SignIn';
		} else {
			activeTab = 'SignUp';
		}
	});
	let selectedCode = '+62';
	let phone = '';
	let flagImage: HTMLImageElement;
	let errorMessage = '';
	let error = {
		phone: false
	};

	let isDropdownActive = false;

	function toggleDropdown() {
		isDropdownActive = !isDropdownActive;
	}

	function selectCode(code: string) {
		selectedCode = code;
		isDropdownActive = false;
		updateFlagImage();
	}

	function updateFlagImage() {
		if (selectedCode === '+62') {
			flagImage.src = '/icons/indonesia_flag.svg';
		} else if (selectedCode === '+65') {
			flagImage.src = '/icons/sg_flag.svg';
		}
	}
	function validateForm() {
		error.phone = !phoneRegex.test(phone);
	}

	let email = '';
	let firstName = '';
	let lastName = '';
	let password = '';
	let confirmPassword = '';
	let isPasswordMismatch = false;
	let isPasswordInvalid = false;
	let isEmailRegistered = false;
	let isPhoneCodeInvalid = false;

	const currentPage = get(page);
	const store = currentPage.params.store;

	$: isFormValid =
		email &&
		firstName &&
		lastName &&
		phone &&
		password &&
		confirmPassword &&
		store &&
		!isPasswordInvalid &&
		password.length >= 8 &&
		confirmPassword.length >= 8;

	const passwordRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
	$: {
		if (password && confirmPassword) {
			if (confirmPassword.length >= password.length) {
				if (password !== confirmPassword) {
					isPasswordInvalid = true;
					errorMessage = "Passwords don't match";
				} else if (!passwordRegex.test(password) || !passwordRegex.test(confirmPassword)) {
					isPasswordInvalid = true;
					errorMessage = "Password doesn't meet requirements";
				} else {
					isPasswordInvalid = false;
					if (
						errorMessage === "Passwords don't match" ||
						errorMessage === "Password doesn't meet requirements"
					) {
						errorMessage = '';
					}
				}
			} else {
				isPasswordInvalid = false;
				if (
					errorMessage === "Passwords don't match" ||
					errorMessage === "Password doesn't meet requirements"
				) {
					errorMessage = '';
				}
			}
		} else {
			isPasswordMismatch = false;
			isPasswordInvalid = false;
			errorMessage = '';
		}
	}

	const handleSignUp = async () => {
		await externalHandleSignUp({
			email,
			firstName,
			lastName,
			phone,
			password,
			confirmPassword,
			store,
			selectedCode,
			setErrorMessage: (value) => (errorMessage = value),
			setIsPasswordMismatch: (value) => (isPasswordMismatch = value),
			setIsPasswordInvalid: (value) => (isPasswordInvalid = value),
			setIsEmailRegistered: (value) => (isEmailRegistered = value),
			setIsLoading: (value) => (isLoading = value),
			setIsPhoneCodeInvalid: (value) => (isPhoneCodeInvalid = value)
		});
	};

	let signInEmail = '';
	let signInPassword = '';
	let errorMessageSignIn = '';
	let errorMessageSignInTimeOut = '';

	$: isSignInValid = signInEmail && signInPassword;

	let showLoadingModal = false;
	let showOTPModal = false;
	let showModalNewPassword = false;
	let IdFromCheck = '';

	const handleSignIn = async () => {
		await externalHandleSignIn({
			signInEmail,
			signInPassword,
			setIsLoading: (value) => (isLoading = value),
			setErrorMessageSignIn: (value) => (errorMessageSignIn = value),
			setShowLoadingModal: (value) => (showLoadingModal = value),
			setIdFromCheck: (value) => (IdFromCheck = value),
			setShowOTPModal: (value) => (showOTPModal = value),
			setShowModalNewPassword: (value) => (showModalNewPassword = value)
		});
	};

	let showModalForgot = false;

	const closeModalForgot = () => {
		showModalForgot = false;
	};

	const forgotPassword = () => {
		showModalForgot = true;
	};

	$: isEightChars = password.length >= 8;
	$: hasLowercase = /[a-z]/.test(password);
	$: hasNumber = /\d/.test(password);
	$: hasUppercase = /[A-Z]/.test(password);

	const handleSignInSocial = () => {
		$showAuthenticationModal = true;
	};

	let isSignIn = false;
	let isSignUp = false;
	let isForgotPass = false;
	let isUpdatePhone = false;
	let redirectPath: string | null = '';

	$: {
		redirectPath = $page.url.searchParams.get('redirect');
	}

	const loadingShow = () => {
		isLoading = true;
	};

	const loadingHide = () => {
		isLoading = false;
	};

	const showSignIn = (e: any) => {
		email = e?.detail?.email;
		isSignIn = true;
		isForgotPass = false;
	};

	const showSignUp = (e: any) => {
		email = e.detail.email;
		isSignUp = true;
	};

	const showUpdatePhone = (e: any) => {
		email = e.detail.email;
		isSignIn = false;
		isForgotPass = false;
		isUpdatePhone = true;
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
		// isModalOpen = false;
		// window.location.reload();
	};
</script>

<Modal
	isOpen={isModalOpen && !showModalForgot && !showLoadingModal}
	title=" "
	onClose={closeModal}
	padding="p-4 lg:p-7 z-50"
	fullScreenMobile
>
	<div class="sticky top-0 bg-white z-30 overflow-hidden bg-white-1">
		<div class="flex justify-center">
			<img class="max-w-[200px]" src="/img/main-logo.png" alt="Main Logo" />
		</div>
		<div class="mt-4 text-center">
			<Text type="body-1" weight="regular" color="black-6">
				Sign in or Create an Account to elevate your shopping experience with:
			</Text>
		</div>
		<div class="flex gap-4 justify-center mt-4">
			<div class="grid place-items-center h-full max-w-24 lg:max-w-36 text-center gap-1.5">
				<CouponLineFinance fill="#dbb999" />
				<Text type="body-2" color="black-6">Exclusive Deals & Promo</Text>
			</div>
			<div class="grid place-items-center h-full max-w-24 lg:max-w-36 text-center gap-1.5">
				<Notification3LineMedia fill="#dbb999" />
				<Text type="body-2" color="black-6">New Arrival Updates</Text>
			</div>
			<div class="grid place-items-center h-full max-w-24 lg:max-w-36 text-center gap-1.5">
				<StarLineSystem fill="#dbb999" />
				<Text type="body-2" color="black-6">Elevated Shopping</Text>
			</div>
		</div>

		<Tabs
			tabStyle="full"
			defaultClass="flex bg-white"
			class="bg-white mt-4"
			contentClass="bg-white py-4"
		>
			<TabItem
				class="w-full  flex items-center"
				activeClasses="w-full !border-brown-10 !text-brown-10 border-b-2 py-2"
				inactiveClasses="w-full !border-dark-brown-1 border-b py-2 !text-black-4"
				open={activeTab === 'SignIn'}
				on:click={() => (activeTab = 'SignIn')}
			>
				<span slot="title" class="text-base font-semibold">Sign In</span>
			</TabItem>
			<TabItem
				class="w-full flex items-center"
				activeClasses="w-full !border-brown-10 !text-brown-10 border-b-2 py-2"
				inactiveClasses="w-full !border-dark-brown-1 border-b py-2 !text-black-4"
				open={activeTab === 'SignUp'}
				on:click={() => (activeTab = 'SignUp')}
			>
				<span slot="title" class="text-base font-semibold">Sign Up</span>
			</TabItem>
		</Tabs>
	</div>

	<div class="max-h-[100vh] overflow-y-auto z-0 sticky overflow-hidden">
		{#if activeTab === 'SignIn'}
			<form on:submit|preventDefault={handleSignIn}>
				<div>
					<Label for="email" class="mb-2 font-semibold">Email</Label>
					<Input
						type="text"
						id="email"
						placeholder="Enter your email"
						required
						color="base"
						class="bg-transparent rounded placeholder-black-4"
						size="lg"
						bind:value={signInEmail}
					/>
				</div>
				<div class="mt-4">
					<div class="flex justify-between">
						<Label for="show-password" class="mb-2 font-semibold">Password</Label>
						<a on:click={forgotPassword} class="cursor-pointer mb-2">
							<Text color="dark-brown-6" type="caption-1" weight="semibold">Forgot password?</Text>
						</a>
					</div>
					<Input
						id="show-password"
						type={showPasswordSignIn ? 'text' : 'password'}
						placeholder="Enter your password"
						color="base"
						size="lg"
						class="bg-transparent rounded placeholder-black-4"
						bind:value={signInPassword}
					>
						<button
							type="button"
							slot="right"
							on:click={() => (showPasswordSignIn = !showPasswordSignIn)}
							class="pointer-events-auto"
						>
							{#if showPasswordSignIn}
								<EyeFillSystem fill="black-9" />
							{:else}
								<EyeOffFillSystem fill="black-9" />
							{/if}
						</button>
					</Input>
				</div>
				<div class="mb-8">
					<Text type="caption-2" color="black-4">
						For previous Google login users, enter your Gmail password to verify your data.
					</Text>
				</div>
				{#if errorMessageSignIn}
					<div class="text-center mt-8">
						<Text type="body-1" color="red-5">{errorMessageSignIn}</Text>
					</div>
				{/if}
				{#if errorMessageSignInTimeOut}
					<div class="text-center mt-8">
						<Text type="body-1" color="red-5">{errorMessageSignInTimeOut}</Text>
					</div>
				{/if}
				<Button variant="primary" class="w-full py-4 mt-4" type="submit" disabled={!isSignInValid}>
					{#if isLoading}
						<Spinner size={6} color="gray" />
					{:else}
						<span>SIGN IN</span>
					{/if}
				</Button>
			</form>
			{#if showGoogleLogin}
				<div class="flex items-center justify-center w-full mt-5">
					<div class="flex-1 border-t border-black-1"></div>
					<Text type="body-2" color="black-4" class="mx-4 whitespace-nowrap">or continue with</Text>
					<div class="flex-1 border-t border-black-1"></div>
				</div>
				<div class="text-center mt-5">
					{#if !isSignIn && !isSignUp && !isForgotPass && !isUpdatePhone}
						<NewSocialLogin
							{credentialSoc}
							on:loading-on={loadingShow}
							on:loading-off={loadingHide}
							on:signin={showSignIn}
							on:signup={showSignUp}
							on:close-success={closeSuccessModal}
							on:phone-update={showUpdatePhone}
						/>
					{/if}
				</div>
			{/if}
		{:else if activeTab === 'SignUp'}
			<form on:submit|preventDefault={handleSignUp}>
				<div>
					<Label for="email" class="mb-2 font-semibold">Email</Label>
					<Input
						type="text"
						id="email"
						placeholder="Enter your email"
						required
						color="base"
						class={`bg-transparent rounded placeholder-black-4 ${isEmailRegistered ? 'border-red-5 text-[#9F392D]' : ''}`}
						size="lg"
						bind:value={email}
					/>
					{#if isEmailRegistered}
						<Helper class="mt-2 text-red-5">
							<span class="font-medium">{errorMessage}</span>
						</Helper>
					{/if}
				</div>
				<div class="grid gap-0 lg:gap-6 md:grid-cols-2 mt-4">
					<div>
						<Label for="first_name" class="mb-2 font-semibold">First name</Label>
						<Input
							type="text"
							id="first_name"
							color="base"
							placeholder="e.g: John"
							required
							class="bg-transparent rounded placeholder-black-4"
							size="lg"
							bind:value={firstName}
						/>
					</div>
					<div>
						<Label for="last_name" class="mb-2 lg:mt-0 mt-4 font-semibold">Last name</Label>
						<Input
							type="text"
							id="last_name"
							color="base"
							placeholder="e.g: Carter"
							required
							class="bg-transparent rounded placeholder-black-4"
							size="lg"
							bind:value={lastName}
						/>
					</div>
				</div>
				<div class="phone-input-container mt-3">
					<label for="phone-number" class="text-sm leading-[22px] text-[#24252B] font-bold">
						Phone Number
					</label>
					<div
						class={`relative flex flex-row mt-1 border rounded border-dark-brown-1 ${isPhoneCodeInvalid ? 'border-red-5' : ''}`}
					>
						<div
							class="flex items-center cursor-pointer pl-3 rounded-l justify-between gap-2"
							on:click={toggleDropdown}
						>
							<span class="font-semibold">{selectedCode}</span>
							<svg
								class="arrow-icon"
								width="10"
								height="6"
								viewBox="0 0 10 6"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M4.99999 3.78132L8.29999 0.481323L9.24266 1.42399L4.99999 5.66666L0.757324 1.42399L1.69999 0.481323L4.99999 3.78132Z"
									fill="#302B29"
								/>
							</svg>
						</div>
						<div
							class="options-container absolute top-full left-0 border rounded bg-white-1 z-50 {isDropdownActive
								? 'active'
								: 'hidden'}"
						>
							<div
								class="option p-2.5 cursor-pointer flex flex-row justify-center hover:bg-gray-200 gap-1"
								on:click={() => selectCode('+62')}
							>
								<img bind:this={flagImage} src="/icons/indonesia_flag.svg" alt="indonesia flag" />
								<span class="font-semibold">+62</span>
							</div>
							<div
								class="option p-2.5 cursor-pointer flex flex-row justify-center hover:bg-gray-200 gap-1"
								on:click={() => selectCode('+65')}
							>
								<img bind:this={flagImage} src="/icons/sg_flag.svg" alt="singapore flag" />
								<span class="font-semibold">+65</span>
							</div>
						</div>

						<Input
							class={`w-full rounded bg-transparent border-0 placeholder-black-4 ${isPhoneCodeInvalid ? 'text-[#9F392D]' : ''}`}
							type="tel"
							id="phone-number"
							placeholder="e.g: 812 3456 7890"
							size="lg"
							bind:value={phone}
							on:input={validateForm}
						/>
					</div>
					{#if isPhoneCodeInvalid}
						<Helper class="mt-2 text-red-5">
							<span class="font-medium">{errorMessage}</span>
						</Helper>
					{/if}
				</div>
				<div class="mt-4">
					<Label for="show-password" class="mb-2 font-semibold">Password</Label>
					<Input
						id="show-password"
						type={showPasswordSignUp ? 'text' : 'password'}
						placeholder="Enter your password"
						color="base"
						size="lg"
						class={`bg-transparent rounded placeholder-black-4 ${isPasswordMismatch || isPasswordInvalid ? 'border-red-5 text-[#9F392D]' : ''}`}
						bind:value={password}
					>
						<button
							type="button"
							slot="right"
							on:click={() => (showPasswordSignUp = !showPasswordSignUp)}
							class="pointer-events-auto"
						>
							{#if showPasswordSignUp}
								<EyeFillSystem fill="black-9" />
							{:else}
								<EyeOffFillSystem fill="black-9" />
							{/if}
						</button>
					</Input>
					{#if isPasswordInvalid}
						<Helper class="mt-2 text-red-5">
							<span class="font-medium">{errorMessage}</span>
						</Helper>
					{/if}

					<!-- {#if isPasswordMismatch}
						<Helper class="mt-2 text-red-5">
							<span class="font-medium">{errorMessage}</span>
						</Helper>
					{/if} -->
				</div>
				<div class="grid-cols-2 mt-2 hidden lg:grid">
					<div class="flex items-center gap-1">
						{#if isEightChars}
							<CheckFillSystem fill="#24252b" width={16} height={16} />
						{:else}
							<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
						{/if}
						<Text
							type="caption-1"
							weight="regular"
							class={isEightChars ? '!text-[#24252b]' : '!text-[#adb0ba]'}
						>
							Min. 8 characters
						</Text>
					</div>
					<div class="flex items-center gap-1">
						{#if hasLowercase}
							<CheckFillSystem fill="#24252b" width={16} height={16} />
						{:else}
							<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
						{/if}
						<Text type="caption-1" class={hasLowercase ? '!text-[#24252b]' : '!text-[#adb0ba]'}
							>Lowercase characters
						</Text>
					</div>
					<div class="flex items-center gap-1">
						{#if hasNumber}
							<CheckFillSystem fill="#24252b" width={16} height={16} />
						{:else}
							<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
						{/if}
						<Text type="caption-1" class={hasNumber ? '!text-[#24252b]' : '!text-[#adb0ba]'}
							>Contains 1 number
						</Text>
					</div>
					<div class="flex items-center gap-1">
						{#if hasUppercase}
							<CheckFillSystem fill="#24252b" width={16} height={16} />
						{:else}
							<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
						{/if}
						<Text type="caption-1" class={hasUppercase ? '!text-[#24252b]' : '!text-[#adb0ba]'}
							>Contains 1 uppercase
						</Text>
					</div>
				</div>

				<div class="flex justify-between mt-2 lg:hidden">
					<div>
						<div class="flex items-center gap-1">
							{#if isEightChars}
								<CheckFillSystem fill="#24252b" width={16} height={16} />
							{:else}
								<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
							{/if}
							<Text
								type="caption-1"
								weight="regular"
								class={isEightChars ? '!text-[#24252b]' : '!text-[#adb0ba]'}
							>
								Min. 8 characters
							</Text>
						</div>
						<div class="flex items-center gap-1">
							{#if hasNumber}
								<CheckFillSystem fill="#24252b" width={16} height={16} />
							{:else}
								<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
							{/if}
							<Text type="caption-1" class={hasNumber ? '!text-[#24252b]' : '!text-[#adb0ba]'}
								>Contains 1 number
							</Text>
						</div>
					</div>
					<div>
						<div class="flex items-center gap-1">
							{#if hasLowercase}
								<CheckFillSystem fill="#24252b" width={16} height={16} />
							{:else}
								<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
							{/if}
							<Text type="caption-1" class={hasLowercase ? '!text-[#24252b]' : '!text-[#adb0ba]'}
								>Lowercase characters
							</Text>
						</div>
						<div class="flex items-center gap-1">
							{#if hasUppercase}
								<CheckFillSystem fill="#24252b" width={16} height={16} />
							{:else}
								<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
							{/if}
							<Text type="caption-1" class={hasUppercase ? '!text-[#24252b]' : '!text-[#adb0ba]'}
								>Contains 1 uppercase
							</Text>
						</div>
					</div>
				</div>
				<div class="mt-4">
					<Label for="show-password" class="mb-2 font-semibold">Confirm Password</Label>
					<Input
						id="confirm-password"
						type={showConfirmPassword ? 'text' : 'password'}
						placeholder="Re-enter your password"
						color="base"
						size="lg"
						class={`bg-transparent rounded placeholder-black-4 ${isPasswordMismatch || isPasswordInvalid ? 'border-red-5 text-[#9F392D]' : ''}`}
						bind:value={confirmPassword}
					>
						<button
							type="button"
							slot="right"
							on:click={() => (showConfirmPassword = !showConfirmPassword)}
							class="pointer-events-auto"
						>
							{#if showConfirmPassword}
								<EyeFillSystem fill="black-9" />
							{:else}
								<EyeOffFillSystem fill="black-9" />
							{/if}
						</button>
					</Input>
					{#if isPasswordInvalid}
						<Helper class="mt-2 text-red-5">
							<span class="font-medium">{errorMessage}</span>
						</Helper>
					{/if}

					<!-- {#if isPasswordMismatch}
						<Helper class="mt-2 text-red-5">
							<span class="font-medium">{errorMessage}</span>
						</Helper>
					{/if} -->
				</div>
				<div class="flex items-start gap-2 mt-4">
					<InformationLineSystem class="w-8 h-6" />
					<Text type="body-2" color="black-9" weight="regular">
						By signing up, you'll be updated on latest news, events and exclusive offers from
						Luxehouze.
					</Text>
				</div>
				{#if isEmailRegistered}
					<Helper class="mt-4 text-red-5 text-center">
						<Text type="body-1" color="red-5">{errorMessage}</Text>
					</Helper>
				{/if}
				<Button variant="primary" class="w-full py-4 mt-8" type="submit" disabled={!isFormValid}>
					{#if isLoading}
						<Spinner size={6} color="gray" />
					{:else}
						<span>SIGN UP</span>
					{/if}
				</Button>
			</form>
		{/if}
	</div>
</Modal>

{#if showModalForgot}
	<ForgotPasswordModal bind:isModalForgotOpen={showModalForgot} on:closeModal={closeModalForgot} />
{/if}
{#if showLoadingModal}
	<LoadingModal
		bind:showLoadingModal
		userEmail={signInEmail}
		userPassword={signInPassword}
		{customer}
		{IdFromCheck}
	/>
{/if}
{#if showOTPModal}
	<OTPModal bind:showOTPModal emailOTP={signInEmail} idOTP={IdFromCheck} />
{/if}
{#if showModalNewPassword}
	<NewPasswordModal
		bind:isModalNewPasswordOpen={showModalNewPassword}
		userId={IdFromCheck}
		userEmail={signInEmail}
	/>
{/if}
