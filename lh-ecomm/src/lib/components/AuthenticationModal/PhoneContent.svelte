<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { phoneRegex } from '$lib/constants.util';

	const dispatch = createEventDispatcher();
	export let email = '';

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

	async function handleSubmit(event: any) {
		event.preventDefault();

		dispatch('loading-on');

		validateForm();

		const formattedPhoneNumber =
			selectedCode + (phone?.startsWith('0') ? phone.substring(1) : phone);

		try {
			const response = await fetch('/api/customer/update', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					variables: {
						customer: {
							email: email,
							phone: formattedPhoneNumber
						}
					}
				})
			});

			const result = await response.json();

			if (result.success) {
				dispatch('close-success');
			} else {
				throw new Error(result.message);
			}
		} catch (error) {
			console.error(`Update phone number error for ${email} with no: ${formattedPhoneNumber}: `, error);
			errorMessage = error instanceof Error ? error.message : 'Internal Server Error, Try again later.';
		} finally {
			dispatch('loading-off');
		}
	}
</script>

<form method="POST" class="flex flex-col gap-3" on:submit={handleSubmit}>
	<!-- Phone Number -->
	<div class="phone-input-container mt-3">
		<label for="phone-number" class="text-sm leading-[22px] text-[#24252B] font-bold">
			Phone Number
		</label>

		<div class="relative flex flex-row mt-1">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="bg-gray-300 flex flex-row min-w-[85px] items-center cursor-pointer py-1 px-2 rounded-l-md justify-between gap-1"
				on:click={toggleDropdown}
			>
				<img bind:this={flagImage} src="/icons/indonesia_flag.svg" alt="country flag" />
				<span>{selectedCode}</span>
				<!-- Arrow Icon -->
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

			<!-- Dropdown Options -->
			<div
				class="options-container absolute top-full left-0 w-full border border-gray-300 rounded bg-white z-10 {isDropdownActive
					? 'active'
					: 'hidden'}"
			>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="option p-2.5 cursor-pointer flex flex-row justify-center hover:bg-gray-200"
					on:click={() => selectCode('+62')}
				>
					<img src="/icons/indonesia_flag.svg" alt="indonesia flag" />
					<span>+62</span>
				</div>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="option p-2.5 cursor-pointer flex flex-row justify-center hover:bg-gray-200"
					on:click={() => selectCode('+65')}
				>
					<img src="/icons/sg_flag.svg" alt="singapore flag" />
					<span>+65</span>
				</div>
			</div>

			<input
				class="border border-[#DBD8D7] p-2 min-h-[22px] w-full rounded-r-md border-l-0"
				type="tel"
				id="phone-number"
				placeholder="e.g: 812 3456 7890"
				bind:value={phone}
				on:input={validateForm}
			/>
		</div>
	</div>
	{#if error.phone}
		<p class="text-[#9F392D] text-[11px]" id="phone-dont-valid-text">Phone number is invalid</p>
	{/if}

	{#if errorMessage}
		<p
			class="text-[#9F392D] text-sm leading-6 font-medium mt-10 text-center"
			style="margin-bottom: -12px;"
		>
			{errorMessage}
		</p>
	{/if}

	<div class="button-form-sign-in mt-4">
		<button
			class="w-full py-3 px-4 bg-[#302B29] text-white-1 text-lg leading-6 font-semibold rounded-md cursor-pointer"
			type="submit">UPDATE</button
		>
	</div>
</form>

<style>
	.options-container.active {
		display: block;
		margin-top: 3px;
		max-width: 90px;
		display: flex;
		background-color: white;
		flex-direction: column;
	}
</style>
