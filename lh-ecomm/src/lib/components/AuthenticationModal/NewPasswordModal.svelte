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
	import SuccessModal from './SuccessModal.svelte';
	import { toast } from 'svelte-sonner';
	import { isPasswordFormat } from '$lib/utils/passwordFormat';

	export let isModalNewPasswordOpen: boolean = false;
	export let userId: string | undefined;
	export let userEmail: string | undefined;

	let showPassword = false;
	let showConfirmPassword = false;
	let password = '';
	let confirmPassword = '';
	let isPasswordMismatch = false;
	let errorMessage = '';
	$: sendUserId = userId;
	let currentUrl = '';

	if (typeof window !== 'undefined') {
		currentUrl = window.location.href;
	}

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

			const response = await fetch('/api/auths/set-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (result.message === 'Successfully to set new password') {
				userPassword = password;
				showModalSuccess = true;
			}
		} catch (error) {
			toast.error('Error Setting Password', {
				position: 'top-center'
			});
		}
	};

	$: confirmPasswordTrue = confirmPassword.length >= 8;

	let passwordChecks = {
		isEightChars: false,
		hasLowercase: false,
		hasNumber: false,
		hasUppercase: false
	};

	$: passwordChecks = isPasswordFormat(password);
</script>

<Modal
	isOpen={isModalNewPasswordOpen && !showModalSuccess}
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
					type="button"
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
					{#if passwordChecks.isEightChars}
						<CheckFillSystem fill="#24252b" width={16} height={16} />
					{:else}
						<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
					{/if}
					<Text
						type="caption-1"
						weight="regular"
						color={passwordChecks.isEightChars ? 'black-9' : 'black-4'}
					>
						Min. 8 characters
					</Text>
				</div>
				<div class="flex items-center gap-1">
					{#if passwordChecks.hasLowercase}
						<CheckFillSystem fill="#24252b" width={16} height={16} />
					{:else}
						<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
					{/if}
					<Text type="caption-1" color={passwordChecks.hasLowercase ? 'black-9' : 'black-4'}
						>Lowercase characters
					</Text>
				</div>
				<div class="flex items-center gap-1">
					{#if passwordChecks.hasNumber}
						<CheckFillSystem fill="#24252b" width={16} height={16} />
					{:else}
						<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
					{/if}
					<Text type="caption-1" color={passwordChecks.hasNumber ? 'black-9' : 'black-4'}
						>Contains 1 number
					</Text>
				</div>
				<div class="flex items-center gap-1">
					{#if passwordChecks.hasUppercase}
						<CheckFillSystem fill="#24252b" width={16} height={16} />
					{:else}
						<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
					{/if}
					<Text type="caption-1" color={passwordChecks.hasUppercase ? 'black-9' : 'black-4'}
						>Contains 1 uppercase
					</Text>
				</div>
			</div>

			<div class="flex justify-between mt-2 lg:hidden">
				<div>
					<div class="flex items-center gap-1">
						{#if passwordChecks.isEightChars}
							<CheckFillSystem fill="#24252b" width={16} height={16} />
						{:else}
							<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
						{/if}
						<Text
							type="caption-1"
							weight="regular"
							color={passwordChecks.isEightChars ? 'black-9' : 'black-4'}
						>
							Min. 8 characters
						</Text>
					</div>
					<div class="flex items-center gap-1">
						{#if passwordChecks.hasNumber}
							<CheckFillSystem fill="#24252b" width={16} height={16} />
						{:else}
							<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
						{/if}
						<Text type="caption-1" color={passwordChecks.hasNumber ? 'black-9' : 'black-4'}
							>Contains 1 number
						</Text>
					</div>
				</div>
				<div>
					<div class="flex items-center gap-1">
						{#if passwordChecks.hasLowercase}
							<CheckFillSystem fill="#24252b" width={16} height={16} />
						{:else}
							<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
						{/if}
						<Text type="caption-1" color={passwordChecks.hasLowercase ? 'black-9' : 'black-4'}
							>Lowercase characters
						</Text>
					</div>
					<div class="flex items-center gap-1">
						{#if passwordChecks.hasUppercase}
							<CheckFillSystem fill="#24252b" width={16} height={16} />
						{:else}
							<SubtractLineSystem fill="#adb0ba" width={16} height={16} />
						{/if}
						<Text type="caption-1" color={passwordChecks.hasUppercase ? 'black-9' : 'black-4'}
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
			disabled={!passwordChecks.isEightChars ||
				!passwordChecks.hasLowercase ||
				!passwordChecks.hasNumber ||
				!passwordChecks.hasUppercase ||
				!confirmPasswordTrue}
		>
			RESET PASSWORD
		</Button>
	</form>
</Modal>
{#if showModalSuccess}
	<SuccessModal
		bind:isModalSuccessResetOpen={showModalSuccess}
		on:closeModal={closeModalSuccess}
		{userPassword}
		userEmail={sentUserEmail}
	/>
{/if}
