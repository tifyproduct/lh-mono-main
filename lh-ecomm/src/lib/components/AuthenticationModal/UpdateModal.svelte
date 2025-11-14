<script lang="ts">
	import Modal from '../Modal/Modal.svelte';
	import type { CustomerProfile } from '$lib/types/customer';
	import Text from '$lib/components/Text/Text.svelte';
	import { Input, Helper, Spinner } from 'flowbite-svelte';
	import Button from '../Button/Button.svelte';
	import { authPhoneRegex } from '$lib/constants.util';
	import UpdatePasswordModal from './UpdatePasswordModal.svelte';
	import { createEventDispatcher } from 'svelte';

	export let showUpdateModal: boolean = false;
	export let customer: CustomerProfile | undefined;
	export let IdFromCheck: string | undefined;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('closeModal');
		showUpdateModal = false;
	}

	let showUpdatePasswordModal = false;

	let selectedCode = '+62';
	let phone = '';
	let isDropdownActive = false;
	let isPhoneCodeInvalid = false;
	let errorMessage = '';
	let error = { phone: false };
	let isLoading = false;

	function validateForm() {
		error.phone = !authPhoneRegex.test(phone);
	}

	function toggleDropdown() {
		isDropdownActive = !isDropdownActive;
	}

	function selectCode(code: string) {
		selectedCode = code;
		isDropdownActive = false;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!phone || error.phone) {
			errorMessage = 'Please enter a valid phone number.';
			return;
		}

		if (!IdFromCheck) {
			errorMessage = 'Invalid ID provided.';
			console.error('IdFromCheck is missing');
			return;
		}

		isLoading = true;
		errorMessage = '';
		try {
			const payload = {
				id: IdFromCheck,
				phone: `${selectedCode}${phone}`
			};

			const response = await fetch('/api/customer/check-valid-phone-number', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(payload)
			});

			const result = await response.json();

			if (response.ok && result.data.isValidPhoneNumber) {
				showUpdatePasswordModal = true;
			} else {
				errorMessage = result.message || 'Failed to validate phone number.';
			}
		} catch (err) {
			errorMessage = 'An error occurred. Please try again.';
			console.error(err);
		} finally {
			isLoading = false;
		}
	}
</script>

<Modal
	isOpen={showUpdateModal && !showUpdatePasswordModal}
	title=" "
	onClose={closeModal}
	padding="p-4 lg:p-7"
	fullScreenMobile
>
	<div class="flex justify-center">
		<img class="max-w-[200px]" src="/img/main-logo.png" alt="Main Logo" />
	</div>
	<div class="mt-10 text-center">
		<Text type="subtitle-2" color="black-9" weight="semibold">Update Account Details</Text>
	</div>
	<div class="text-center mt-1">
		<Text type="body-1" color="black-9">
			You are currently logged in using Google Login. For added security, please validate your phone
			number and update your password.
		</Text>
	</div>
	<form on:submit={handleSubmit}>
		<div class="phone-input-container mt-12">
			<label for="phone-number" class="text-sm leading-[22px] text-[#24252B] font-bold">
				Phone Number
			</label>
			<div
				class={`relative flex flex-row mt-1 border rounded border-dark-brown-1 ${error.phone ? 'border-red-5' : ''}`}
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
				<Input
					class={`w-full rounded bg-transparent border-0 placeholder-black-4 ${error.phone ? 'text-[#9F392D]' : ''}`}
					type="tel"
					id="phone-number"
					placeholder="e.g: 812 3456 7890"
					size="lg"
					bind:value={phone}
					on:input={validateForm}
				/>
			</div>
			{#if errorMessage}
				<Helper class="mt-12 text-red-5 text-center">
					<Text type="body-1" color="red-5">{errorMessage}</Text>
				</Helper>
			{/if}
			<Button
				variant="primary"
				class={`w-full py-4 ${errorMessage ? 'mt-3' : 'mt-12'}`}
				type="submit"
				disabled={!phone || error.phone || isLoading}
			>
				{#if isLoading}
					<Spinner class="mr-2" />
				{/if}
				NEXT
			</Button>
		</div>
	</form>
</Modal>

{#if showUpdatePasswordModal}
	<UpdatePasswordModal bind:showUpdatePasswordModal userId={IdFromCheck} />
{/if}
