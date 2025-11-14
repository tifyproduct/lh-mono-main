<script lang="ts">
	import { Input, Label, Spinner, Helper } from 'flowbite-svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Modal from '../Modal/Modal.svelte';
	import {
		EyeFillSystem,
		EyeOffFillSystem,
		SubtractLineSystem,
		CheckFillSystem
	} from 'svelte-remix';
	import SuccessResetModal from './SuccessResetModal.svelte';

	export let isModalResetOpen: boolean = false;
	export let userId: string | undefined;
	export let userEmail: string | undefined;

	let showPassword = false;
	let showConfirmPassword = false;
	let password = '';
	let confirmPassword = '';
	let isPasswordMismatch = false;
	let errorMessage = '';
	$: sendUserId = userId;
	$: currentUrl = window.location.href;

	let sentUserEmail = userEmail;
	let userPassword = '';

	const closeModal = () => {
		window.location.href = currentUrl;
	};

	let showModalSuccess = false;

	const closeModalSuccess = () => {
		showModalSuccess = false;
	};

	const handleResetPassword = async () => {
		try {
			if (password !== confirmPassword) {
				isPasswordMismatch = true;
				errorMessage = "Passwords don't match";
				return;
			}
			const payload = {
				userId: sendUserId,
				password: password,
				confirmPassword: confirmPassword
			};

			const response = await fetch('/api/auths/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (result.message === 'Successfully reset password') {
				userPassword = password;
				showModalSuccess = true;
			}
		} catch (error) {
			console.log('error');
		}
	};

	$: isEightChars = password.length >= 8;
	$: hasLowercase = /[a-z]/.test(password);
	$: hasNumber = /\d/.test(password);
	$: hasUppercase = /[A-Z]/.test(password);
	$: confirmPasswordTrue = confirmPassword.length >= 8;
</script>

<Modal
	isOpen={isModalResetOpen && !showModalSuccess}
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
		<Text type="subtitle-2" color="black-9" weight="semibold">Reset Password</Text>
		<Text type="body-1" color="black-9">Create your new password and you’re good to go.</Text>
	</div>
	<form on:submit|preventDefault={handleResetPassword}>
		<div class="mt-8">
			<Label for="show-password" class="mb-2 font-semibold">Create Password</Label>
			<Input
				id="show-password"
				type={showPassword ? 'text' : 'password'}
				placeholder="Enter your password"
				color="base"
				size="lg"
				class="bg-transparent rounded placeholder-black-4"
				bind:value={password}
			>
				<button
					slot="right"
					on:click={() => (showPassword = !showPassword)}
					class="pointer-events-auto"
				>
					{#if showPassword}
						<EyeFillSystem fill="black-9" />
					{:else}
						<EyeOffFillSystem fill="black-9" />
					{/if}
				</button>
			</Input>

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
		</div>
		<div class="mt-4">
			<Label for="show-password" class="mb-2 font-semibold">Confirm Password</Label>
			<Input
				id="show-password"
				type={showConfirmPassword ? 'text' : 'password'}
				placeholder="Re-enter your password"
				color="base"
				size="lg"
				class={`bg-transparent rounded placeholder-black-4 ${isPasswordMismatch ? 'border-red-5 text-[#9F392D]' : ''}`}
				bind:value={confirmPassword}
			>
				<button
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
		</div>
		{#if isPasswordMismatch}
			<Helper class="mt-2 text-red-5">
				<span class="font-medium">{errorMessage}</span>
			</Helper>
		{/if}
		<Button
			variant="primary"
			class="w-full py-4 mt-12"
			type="submit"
			disabled={!isEightChars ||
				!hasLowercase ||
				!hasNumber ||
				!hasUppercase ||
				!confirmPasswordTrue}
		>
			RESET PASSWORD
		</Button>
	</form>
</Modal>
{#if showModalSuccess}
	<SuccessResetModal
		bind:isModalSuccessResetOpen={showModalSuccess}
		on:closeModal={closeModalSuccess}
		{userPassword}
		userEmail={sentUserEmail}
	/>
{/if}
