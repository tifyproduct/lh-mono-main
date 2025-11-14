<script lang="ts">
	import { Input, Label, Spinner, Helper } from 'flowbite-svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Modal from '../Modal/Modal.svelte';
	import NewPasswordOTPModal from './NewPasswordOTPModal.svelte';
	import { onMount } from 'svelte';

	export let showOTPModal: boolean = false;
	export let emailOTP: string | undefined;
	export let idOTP: string | undefined;

	let isLoading = false;

	const closeModal = () => {
		showOTPModal = false;
	};

	let errorMessage = '';

	let email = '';
	let submittedEmail = '';
	let userId: string | undefined;
	let userEmail: string | undefined;
	let otp = Array(6).fill('');
	let isInvalidOTP = false;

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
					userId: idOTP
				})
			})
				.then((response) => response.json())
				.then((result) => {
					if (result.message === 'Success') {
						showModalNewPassword = true;
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
		showOTPModal = false;
	};

	let showModalNewPassword = false;
	const closeModalReset = () => {
		showModalNewPassword = false;
	};

	async function resendCode() {
		if (!isCountdownActive) {
			countdown = 300;
			isCountdownActive = true;
			startCountdown();

			try {
				const payload = {
					email: emailOTP
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

	let countdown = 10;
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

	onMount(() => {
		startCountdown();
	});
</script>

<Modal isOpen={showOTPModal} title=" " onClose={closeModal} padding="p-4 lg:p-7" fullScreenMobile>
	<div class="flex justify-center">
		<img class="max-w-[200px]" src="/img/main-logo.png" alt="Main Logo" />
	</div>
	<div class="mt-10 text-center grid">
		<Text type="subtitle-2" color="black-9" weight="semibold">Enter Email's OTP</Text>
		<Text type="body-1" color="black-9" weight="regular" class="mt-3">
			We've sent the OTP to <Text type="body-1" weight="semibold">{emailOTP}</Text> If it doesn't show
			up, kindly check your spam folder.
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
			on:click={resendCode}
			class:cursor-not-allowed={isCountdownActive}
			class:text-gray-400={isCountdownActive}
			disabled={isCountdownActive}
		>
			<Text type="body-2" color={isCountdownActive ? 'gray-4' : 'black-4'} weight="semibold">
				Resend Code {#if isCountdownActive}({formatCountdown(countdown)}){/if}
			</Text>
		</a>
	</div>
</Modal>
{#if showModalNewPassword}
	<NewPasswordOTPModal
		bind:isModalNewPasswordOpen={showModalNewPassword}
		on:closeModal={closeModalReset}
		userId={idOTP}
		userEmail={emailOTP}
	/>
{/if}
