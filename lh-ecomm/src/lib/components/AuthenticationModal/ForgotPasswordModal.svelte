<script lang="ts">
	import { Input, Label, Spinner, Helper } from 'flowbite-svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Modal from '../Modal/Modal.svelte';
	import ResetPasswordModal from './ResetPasswordModal.svelte';

	export let isModalForgotOpen: boolean = false;

	let activeModal = 'SEND';
	let isLoading = false;

	const closeModal = () => {
		isModalForgotOpen = false;
	};

	let errorMessage = '';

	let email = '';
	let submittedEmail = '';
	let userId: string | undefined;
	let userEmail: string | undefined;
	let otp = Array(6).fill('');
	let isInvalidOTP = false;
	let isInvalidEmail = false;

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	$: isFormValid = emailRegex.test(email);

	async function handleForgot(event: any) {
		event.preventDefault();
		isLoading = true;
		isInvalidEmail = false;

		try {
			const payload = { email: email };
			const response = await fetch('/api/auths/send-reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (!response.ok) {
				if (result.error === 'Email is not registered') {
					isInvalidEmail = true;
				}
				throw new Error(result.error || 'An error occurred');
			}

			if (result.message === 'Successfully send reset password') {
				submittedEmail = email;
				activeModal = 'OTP';
				errorMessage = '';
				userId = result.data.userId;
				userEmail = email;
				startCountdown();
			}
		} catch (error) {
			console.error('Error during forgot password:', error);
		} finally {
			isLoading = false;
		}
	}

	function handleOTPVerification(event: Event, index: number) {
		const inputElement = event.target as HTMLInputElement;
		const value = inputElement.value;

		otp[index] = value;

		if (value.length === 1 && index < otp.length - 1) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			if (nextInput) {
				(nextInput as HTMLInputElement).focus();
			}
		}

		if (event instanceof KeyboardEvent && event.key === 'Backspace' && value === '' && index > 0) {
			const previousInput = document.getElementById(`otp-${index - 1}`);
			if (previousInput) {
				(previousInput as HTMLInputElement).focus();
			}
		}

		if (otp.every((digit) => digit !== '')) {
			isLoading = true;

			const otpString = otp.join('');

			fetch('/api/auths/verify-otp', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					otp: otpString,
					userId: userId
				})
			})
				.then((response) => response.json())
				.then((result) => {
					if (result.message === 'Success') {
						showModalReset = true;
					} else {
						isInvalidOTP = true;
						otp = Array(6).fill('');
						const firstInput = document.getElementById('otp-0');
						if (firstInput) {
							(firstInput as HTMLInputElement).focus();
						}
					}
				})
				.catch((error) => {
					errorMessage = 'Internal Server Error, Try again later.';
				})
				.finally(() => {
					isLoading = false;
				});
		}
	}

	const returnSignIn = () => {
		isModalForgotOpen = false;
	};

	let showModalReset = false;
	const closeModalReset = () => {
		showModalReset = false;
	};

	async function resendCode() {
		if (!isCountdownActive) {
			countdown = 300;
			isCountdownActive = true;
			startCountdown();

			try {
				const payload = {
					email: email
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
					submittedEmail = email;
					activeModal = 'OTP';
					errorMessage = '';
					userId = result.data.userId;
				} else {
					errorMessage = 'Your email is not registered!';
				}
			} catch (error) {
				errorMessage = 'Internal Server Error, Try again later.';
			}
		}
	}

	let countdown = 300;
	let isCountdownActive = true;
	function formatCountdown(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
	}

	function startCountdown() {
		const timer = setInterval(() => {
			if (countdown > 0) {
				countdown -= 1;
			} else {
				clearInterval(timer);
				isCountdownActive = false;
			}
		}, 1000);
	}
</script>

<Modal
	isOpen={isModalForgotOpen && !showModalReset}
	title=" "
	onClose={closeModal}
	padding="p-4 lg:p-7"
	fullScreenMobile
>
	<div class="flex justify-center">
		<img class="max-w-[200px]" src="/img/main-logo.png" alt="Main Logo" />
	</div>
	{#if activeModal === 'SEND'}
		<div class="mt-10 text-center">
			<Text type="subtitle-2" weight="semibold" color="black-9">Forgot Your Password?</Text>
		</div>
		<div class="mt-3 text-center">
			<Text type="body-1" weight="regular" color="black-9">
				Don't worry! Fill in the form and we'll redirect you to reset your password.
			</Text>
		</div>
		<div class="mt-8">
			<form on:submit|preventDefault={handleForgot}>
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
						bind:value={email}
					/>
				</div>

				{#if isInvalidEmail}
					<Helper class="mt-8 text-red-5 text-center">
						<Text type="body-2" color="red-5">Email is not registered</Text>
					</Helper>
				{/if}

				<Button variant="primary" class="w-full mt-12 p-4" type="submit" disabled={!isFormValid}>
					{#if isLoading}
						<Spinner size={6} color="gray" />
					{:else}
						<span>RESET MY PASSWORD</span>
					{/if}
				</Button>
			</form>

			<div class="text-center mt-6 cursor-pointer">
				<a on:click={returnSignIn}>
					<Text type="body-2" color="dark-brown-10" weight="semibold">RETURN TO SIGN IN</Text>
				</a>
			</div>
		</div>
	{/if}
	{#if activeModal === 'OTP'}
		<div class="mt-10 text-center grid">
			<Text type="subtitle-2" color="black-9" weight="semibold">Enter Email's OTP</Text>
			<Text type="body-1" color="black-9" weight="regular" class="mt-3">
				We've sent the OTP to <Text type="body-1" weight="semibold">{submittedEmail}</Text> If it doesn't
				show up, kindly check your spam folder.
			</Text>
		</div>
		<div class="mt-12">
			<div class="flex justify-between gap-2">
				{#each otp as digit, index}
					<div class="w-1/6">
						<Input
							id="otp-{index}"
							type="text"
							maxlength="1"
							bind:value={otp[index]}
							class="w-full h-[60px] lg:h-[100px] text-center bg-white-2 border border-black-1 rounded placeholder-black-4 text-3xl font-bold"
							required
							on:input={(event) => handleOTPVerification(event, index)}
							on:keydown={(event) => handleOTPVerification(event, index)}
						/>
					</div>
				{/each}
			</div>
			{#if isInvalidOTP}
				<Helper class="mt-2 text-red-5 text-center">
					<Text type="body-2" color="red-5">Invalid OTP. Please try again or resend the code.</Text>
				</Helper>
			{/if}
		</div>
		<div class="text-center mt-12">
			<Text type="body-1" color="black-9">Didn't receive the code?</Text>
		</div>
		<div class="text-center mt-2">
			<a
				class="cursor-pointer"
				on:click={resendCode}
				class:!cursor-not-allowed={isCountdownActive}
				class:!text-gray-400={isCountdownActive}
				disabled={isCountdownActive}
			>
				<Text type="body-2" color={isCountdownActive ? 'gray-4' : 'black-4'} weight="semibold">
					Resend Code {#if isCountdownActive}({formatCountdown(countdown)}){/if}
				</Text>
			</a>
		</div>
	{/if}
</Modal>
{#if showModalReset}
	<ResetPasswordModal
		bind:isModalResetOpen={showModalReset}
		on:closeModal={closeModalReset}
		{userId}
		{userEmail}
	/>
{/if}
