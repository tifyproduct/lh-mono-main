<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { registerCustomer, loginCustomer } from '$lib/graphql.util';
	import { emailRegex, phoneRegex } from '$lib/constants.util';

	const dispatch = createEventDispatcher();

	let firstName = '';
	let lastName = '';
	export let email = '';
	let selectedCode = '+62';
	let phone = '';
	let createPwd = '';
	let confirmPwd = '';
	let showPwd = false;
	let showPwdConfirm = false;
	let flagImage;
	let errorMessage = '';

	let error = {
		email: false,
		name: false,
		phone: false,
		passwordMatch: false
	};

	let passwordRequirements = {
		minLength: false,
		lowercase: false,
		uppercase: false,
		number: false
	};

	let isDropdownActive = false;

	function toggleDropdown() {
		isDropdownActive = !isDropdownActive;
	}

	function selectCode(code) {
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

	const createTogglePassword = () => {
		showPwd = !showPwd;
	};

	const confirmTogglePassword = () => {
		showPwdConfirm = !showPwdConfirm;
	};

	// Password validation requirements
	const requirements = [
		{ regex: /.{8,}/, message: 'Min. 8 characters' },
		{ regex: /[a-z]/, message: 'Lowercase characters' },
		{ regex: /[0-9]/, message: 'Contains 1 number' },
		{ regex: /[A-Z]/, message: 'Contains 1 uppercase' }
	];

	// Reactive statement to validate password
	$: validationResults = requirements.map(({ regex }) => regex.test(createPwd));
	$: allRequirementsMet = validationResults.every(Boolean);

	// Mengatur flag berdasarkan input password
	function validateForm() {
		error.email = !emailRegex.test(email);
		error.name = firstName.trim() === '';
		error.phone = !phoneRegex.test(phone);

		passwordRequirements.minLength = createPwd.length >= 8;
		passwordRequirements.lowercase = /[a-z]/.test(createPwd);
		passwordRequirements.uppercase = /[A-Z]/.test(createPwd);
		passwordRequirements.number = /[0-9]/.test(createPwd);
	}

	async function logAuthFailure(errorMessage: string) {
		await fetch('/api/logs/auth/failure', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				eventAction: 'signup',
				errorMessage
			})
		})
	};

	async function handleSubmit(event: any) {
		event.preventDefault();

		dispatch('loading-on');

		validateForm();

		if (!allRequirementsMet) {
			return;
		}

		if (createPwd !== confirmPwd) {
			error.passwordMatch = true;
			return;
		}

		const formattedPhoneNumber =
			selectedCode + (phone.startsWith('0') ? phone.substring(1) : phone);

		try {
			const response = await fetch('/api/auths/register-shopify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: registerCustomer().schema,
					variables: {
						input: {
							email: email,
							firstName: firstName,
							lastName: lastName,
							phone: formattedPhoneNumber,
							password: createPwd,
							acceptsMarketing: true
						}
					}
				})
			});

			const result = await response.json();
			
			if (result.data.customerCreate?.customer) {
				await fetch('/api/auths/register', {
						method: 'POST',
						body: JSON.stringify({
							shopifyId: result.data.customerCreate.customer.id,
							email: email,
							firstName: firstName,
							lastName: lastName,
							phone: formattedPhoneNumber,
							password: createPwd,
							acceptsMarketing: true,
							method: 'form'
						})
					});

				const responseLogin = await fetch('/api/auths/login-shopify', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						query: loginCustomer().schema,
						variables: { email, password: createPwd }
					})
				});

				const resultLogin = await responseLogin.json();

				if (resultLogin.success) {
					dispatch('close-success');
				} else {
					if (result?.internal) {
						throw new Error("Internal Server Error, Try again later.");
					} else {
						throw new Error(result?.message);
					}
				}
			} else {
				if (result?.errors?.length > 0) {
					throw new Error(result?.errors[0].message);
				} else {
					throw new Error(result.data.customerCreate?.customerUserErrors[0].message);
				}
			}
		} catch (error) {
			console.error(`Sign Up error for ${email}: `, error);
			errorMessage = error instanceof Error ? error.message : 'Internal Server Error, Try again later.';
			logAuthFailure(errorMessage);
		} finally {
			dispatch('loading-off');
		}
	}
</script>

<form method="POST" id="form-signup-all" class="flex flex-col gap-3" on:submit={handleSubmit}>
	<div class="mt-3">
		<div class="form-email gap-5">
			<label for="email" class="text-sm leading-[22px] text-[#24252B] font-bold">Email</label>
			<input
				id="email"
				type="text"
				bind:value={email}
				on:input={validateForm}
				class="border border-[#DBD8D7] rounded-md p-2 min-h-[22px] w-full mt-1"
				disabled
			/>
		</div>
		{#if error.email}
			<p class="text-[#9F392D] text-[11px]" id="email-dont-valid-text">Email is invalid</p>
		{/if}
	</div>

	<div class="flex flex-row justify-between gap-5 mt-3">
		<div class="flex flex-col gap-1 flex-1">
			<label for="" class="text-sm leading-[22px] text-[#24252B] font-bold">First Name</label>
			<input
				bind:value={firstName}
				type="text"
				placeholder="e.g: John"
				class="border border-[#DBD8D7] rounded-md p-2 min-h-[22px] w-full"
			/>
			{#if error.name}
				<p class="text-[#9F392D] text-[11px]" id="email-dont-valid-text">Name is invalid</p>
			{/if}
		</div>
		<div class="flex flex-col gap-1 flex-1">
			<label for="" class="text-sm leading-[22px] text-[#24252B] font-bold">Last Name</label>
			<input
				bind:value={lastName}
				type="text"
				placeholder="e.g: Carter"
				class="border border-[#DBD8D7] rounded-md p-2 min-h-[22px] w-full"
			/>
		</div>
	</div>

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

	<div class="form-pwd flex flex-col gap-1 mt-3">
		<label for="password-field-create" class="text-sm leading-[22px] text-[#24252B] font-bold">
			Create Password
		</label>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="flex">
			{#if showPwd}
				<input
					id="password-field-create"
					type="text"
					bind:value={createPwd}
					placeholder="Enter your password"
					class="border border-[#DBD8D7] rounded-md p-2 w-full"
					style="border-color: {allRequirementsMet ? 'green' : 'red'}"
				/>
			{:else}
				<input
					id="password-field-create"
					type="password"
					bind:value={createPwd}
					placeholder="Enter your password"
					class="border border-[#DBD8D7] rounded-md p-2 w-full"
					style="border-color: {allRequirementsMet ? 'green' : 'red'}"
				/>
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span class="cursor-pointer" on:click={createTogglePassword}>
				<i
					class="fa fa-fw relative z-2 mt-3"
					style="margin-left: -35px;"
					class:fa-eye={!showPwd}
					class:fa-eye-slash={showPwd}
				/>
			</span>
		</div>
	</div>

	<!-- Password requirements list -->
	<ul
		class="requirement-pwd-list m-0 list-none text-[#ADB0BA] text-xs font-normal leading-5 p-0 flex gap-[70px]"
	>
		<div>
			{#each requirements.slice(0, 2) as { message }, index}
				<li>
					<i
						class="fa-solid fa"
						class:fa-check={validationResults[index]}
						class:fa-minus={!validationResults[index]}
					/>
					<span>{message}</span>
				</li>
			{/each}
		</div>
		<div>
			{#each requirements.slice(2) as { message }, index}
				<li>
					<i
						class="fa-solid fa"
						class:fa-check={validationResults[index + 2]}
						class:fa-minus={!validationResults[index + 2]}
					/>
					<span>{message}</span>
				</li>
			{/each}
		</div>
	</ul>

	<div class="form-pwd flex flex-col gap-1 mt-3">
		<label for="password-field-confirm" class="text-sm leading-[22px] text-[#24252B] font-bold">
			Confirm Password
		</label>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div class="flex">
			{#if showPwdConfirm}
				<input
					id="password-field-confirm"
					type="text"
					bind:value={confirmPwd}
					placeholder="Enter your password"
					class="border border-[#DBD8D7] rounded-md p-2 w-full"
				/>
			{:else}
				<input
					id="password-field-confirm"
					type="password"
					bind:value={confirmPwd}
					placeholder="Enter your password"
					class="border border-[#DBD8D7] rounded-md p-2 w-full"
				/>
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<span class="cursor-pointer" on:click={confirmTogglePassword}>
				<i
					class="fa fa-fw relative z-2 mt-3"
					style="margin-left: -35px;"
					class:fa-eye={!showPwdConfirm}
					class:fa-eye-slash={showPwdConfirm}
				></i>
			</span>
		</div>
		{#if error.passwordMatch}
			<p class="text-[#9F392D] text-[11px] mt-1">Passwords don't match</p>
		{/if}
	</div>

	<!-- <div class="mt-1 gap-2 flex flex-row justify-center items-center">
		<input
			type="checkbox"
			id="accepts-marketing"
			name="acceptsMarketing"
			class="w-3 h-3 m-0 outline-none"
		/>
		<label class="text-[12px] text-base leading-[22px]" for="accepts-marketing"
			>I’d like to be updated on latest news, events and exclusive offers from Luxehouze.</label
		>
	</div> -->

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
			type="submit">SIGN UP</button
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
