<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import { phoneRegex } from '$lib/constants.util';

	import { CloseLineSystem, ArrowDownSLineArrows, CheckboxCircleFillSystem } from 'svelte-remix';

	const indonesianFlag = '/icons/indonesia_flag.svg';
	const singaporeFlag = '/icons/sg_flag.svg';
	const dispatch = createEventDispatcher();
	export let customer;

	let resetProfile: boolean = true;
	let successUpdated: boolean = false;
	let lastName = customer.lastName ? String(customer.lastName) : '-';
	let firstName = String(customer.firstName || '');
	let phone = customer.phone ? String(customer.phone) : '-';
	let flagImage: HTMLImageElement;
	let selectedCode: string = '+62';
	let dropdownActive: boolean = false;

	const toggleSignInForm = () => {
		resetProfile = !resetProfile;
		dispatch('closeModal');
	};

	const closeModal = () => {
		successUpdated = false;
		dispatch('closeModal');
	};

	const toggleDropdown = () => {
		dropdownActive = !dropdownActive;
	};

	const selectCode = (code: string) => {
		selectedCode = code;
		dropdownActive = false;
		updateFlagImage();
	};

	const updateFlagImage = () => {
		if (flagImage) {
			if (selectedCode === '+62') {
				flagImage.src = indonesianFlag;
			} else if (selectedCode === '+65') {
				flagImage.src = singaporeFlag;
			}
		}
	};

	const setPhone = () => {
		if (customer.phone) {
			if (customer.phone.startsWith('+62')) {
				selectedCode = '+62';
				phone = customer.phone.replace('+62', '');
			} else if (customer.phone.startsWith('+65')) {
				selectedCode = '+65';
				phone = customer.phone.replace('+65', '');
			}
			updateFlagImage();
		}
	};

	onMount(() => {
		setPhone();
	});

	let error = {
		name: false,
		phone: false
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();

		error.phone = !phoneRegex.test(phone);
		if (phone.startsWith('0')) {
			phone = phone.substring(1);
		}
		error.name = firstName.trim() === '';
		const Phone = `${selectedCode}${phone}`;

		if (!error.phone && !error.name) {
			try {
				const response = await fetch('/api/customer/update', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						variables: {
							customer: {
								email: customer.email,
								firstName: firstName,
								lastName: lastName,
								phone: Phone
							}
						}
					})
				});

				const result = await response.json();

				if (result.success) {
					successUpdated = true;
					resetProfile = false;
					setTimeout(() => {
						window.location.reload();
					}, 100);
				} else {
					console.log('Updated failed:', result.message);
				}
			} catch (error) {
				console.error('Error updating customer:', error);
			}
		} else {
			console.log('Validation failed.');
		}
	};
</script>

{#if resetProfile}
	<div
		role="dialog"
		class="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.7)]"
	>
		<div
			class="mx-auto flex flex-col gap-2.5 w-full p-7 h-full border border-black bg-white-1 lg:w-[544px] lg:h-auto lg:rounded-lg"
		>
			<div
				role="button"
				aria-label="Close"
				class="flex justify-end -mt-[15px] -mr-[15px] cursor-pointer"
				on:click={toggleSignInForm}
			>
				<CloseLineSystem class="text-black-9 w-[16px] h-[16px] sm:w-[24px] sm:h-[24px]" />
			</div>

			<div class="text-[#24252B] text-center mb-4">
				<div class="mb-2 text-2xl font-semibold">Edit Profile</div>
				<div class="text-base font-normal">Make sure you’ve entered the right credentials.</div>
			</div>

			<!-- Form -->
			<form class="flex flex-col gap-2" on:submit={handleSubmit}>
				<div class="flex flex-row justify-between mt-3 gap-x-4">
					<div class="flex flex-col gap-1 flex-1">
						<label for="first-name" class="text-sm text-[#24252B] font-bold">First Name</label>
						<input
							id="first-name"
							type="text"
							bind:value={firstName}
							placeholder="e.g: John"
							class="border border-[#DBD8D7] rounded-md p-2 min-h-[22px] w-full"
						/>
						{#if error.name}
							<p class="text-[#9F392D] text-[11px]">Name is invalid</p>
						{/if}
					</div>
					<div class="flex flex-col gap-1 flex-1">
						<label for="last-name" class="text-sm text-[#24252B] font-bold">Last Name</label>
						<input
							id="last-name"
							bind:value={lastName}
							type="text"
							placeholder="e.g: Carter"
							class="border border-[#DBD8D7] rounded-md p-2 min-h-[22px] w-full"
						/>
					</div>
				</div>

				<div class="flex flex-col gap-1">
					<label for="email" class="text-sm text-[#24252B] font-bold">Email</label>
					<input
						id="email"
						type="text"
						placeholder="wang@gmail.com"
						bind:value={customer.email}
						class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full bg-black-1"
						disabled
					/>
				</div>

				<div class="phone-input-container">
					<label for="phone-number" class="text-sm text-[#24252B] font-bold"> Phone Number </label>

					<div class="relative flex flex-row mt-1">
						<div
							class="bg-gray-300 flex flex-row w-[100px] items-center cursor-pointer py-1 px-2 rounded-l-md justify-between gap-1"
							on:click={toggleDropdown}
						>
							<img bind:this={flagImage} src={indonesianFlag} alt="country flag" />
							<span>{selectedCode}</span>
							<ArrowDownSLineArrows class="text-black-9 w-[24px] h-[24px]" />
						</div>

						<!-- Dropdown Options -->
						<div
							class="options-container absolute top-full left-0 border border-gray-300 rounded bg-white-1 z-10 w-[80px] {dropdownActive
								? 'active'
								: 'hidden'}"
						>
							<div
								class="option p-2.5 cursor-pointer flex flex-row justify-center hover:bg-gray-200"
								on:click={() => selectCode('+62')}
							>
								<img src={indonesianFlag} alt="indonesia flag" />
								<span>+62</span>
							</div>
							<div
								class="option p-2.5 cursor-pointer flex flex-row justify-center hover:bg-gray-200"
								on:click={() => selectCode('+65')}
							>
								<img src={singaporeFlag} alt="singapore flag" />
								<span>+65</span>
							</div>
						</div>

						<input
							class="border border-[#DBD8D7] p-2 min-h-[22px] w-full rounded-r-md border-l-0"
							type="tel"
							id="phone-number"
							bind:value={phone}
							placeholder="e.g: 812 3456 7890"
						/>
					</div>
				</div>
				{#if error.phone}
					<p class="text-[#9F392D] text-[11px]" id="phone-dont-valid-text">
						Phone number is invalid
					</p>
				{/if}

				<!-- Submit button -->
				<div class="lg:relative lg:w-full fixed bottom-0 left-0 w-full p-5">
					<button
						type="submit"
						class="uppercase w-full py-3 px-4 bg-[#302B29] text-white-1 font-semibold rounded-md cursor-pointer"
					>
						Save Changes
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- success Edit Profile -->
{#if successUpdated}
	<div
		role="alert"
		class="fixed left-0 right-0 top-[120px] mx-auto w-max h-auto bg-[#68755E] gap-2 text-white rounded-lg flex items-center justify-between px-4 py-3 shadow-lg border-l-4 border-[#3D4C36]"
	>
		<!-- Icon -->
		<div class="flex items-center gap-2">
			<CheckboxCircleFillSystem class="text-white-1 w-[15px] h-[15px]" />
			<span class="text-white-1">Account successfully updated</span>
		</div>
		<!-- Close button -->
		<button aria-label="Close" on:click={closeModal}>
			<CloseLineSystem class="text-white-1 w-[16px] h-[16px] sm:w-[24px] sm:h-[24px]" />
		</button>
	</div>
{/if}
<!-- End of success Edit Profile -->
