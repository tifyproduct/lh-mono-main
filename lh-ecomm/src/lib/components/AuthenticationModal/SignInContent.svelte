<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { loginCustomer } from '$lib/graphql.util';
	import { whatsappLogin } from '$lib/stores/authentication';
	import { STORE } from '$lib/constants.util';

	const loginSchema = loginCustomer();
	const dispatch = createEventDispatcher();
	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const country = $page.params.store || STORE.id;

	export let email = '';
	let password = '';
	let errorMessage = '';
	let showPassword = false;
	let passwordInput: HTMLInputElement;

	const forgotPassword = () => {
		dispatch('forgot-show');
	};

	const togglePassword = () => {
		showPassword = !showPassword;
		if (passwordInput) {
			passwordInput.type = showPassword ? 'text' : 'password';
		}
	};

	async function logAuthFailure(errorMessage: string) {
		await fetch('/api/logs/auth/failure', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				eventAction: 'login',
				errorMessage
			})
		})
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		dispatch('loading-on');
		errorMessage = '';

		try {
			const res = await fetch('/api/auths/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					email,
					password
				})
			});

			const resLog = await res.json();

			if (resLog.success && !resLog.token) {
				const responseLogin = await fetch('/api/auths/login-shopify', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						query: loginSchema.schema,
						variables: { email, password }
					})
				});

				const result = await responseLogin.json();

				if (result.success) {
					if ($whatsappLogin) {
						localStorage.setItem('whatsappLogin', 'true');
						localStorage.setItem(
							'floatingWhatsappData',
							JSON.stringify({
								country,
								baseParams,
								pathname: $page.url.pathname
							})
						);
					}
					dispatch('close-success');
				} else {
					throw new Error(result.message);
				}
			} else if (!resLog.success) {
				throw new Error(resLog.message)
			}
		} catch (error) {
			console.error(`Login error for ${email}: `, error);
			errorMessage = error instanceof Error ? error.message : 'Internal Server Error, Try again later.';
			logAuthFailure(errorMessage)
		} finally {
			dispatch('loading-off');
		}
	};
</script>

<form on:submit={handleSubmit} class="flex flex-col mt-6">
	<div class="form-email flex flex-col gap-2 mb-3">
		<label for="email" class="text-sm leading-[22px] text-[#24252B] font-bold">Email</label>
		<input
			id="email"
			type="text"
			bind:value={email}
			class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
			on:input={() => {
				errorMessage = '';
			}}
		/>
	</div>
	<div class="form-pwd flex flex-col gap-2">
		<label for="password-field" class="text-sm leading-[22px] text-[#24252B] font-bold">
			Password
		</label>
		<div class="flex flex-row">
			<input
				id="password-field"
				bind:this={passwordInput}
				type="password"
				bind:value={password}
				placeholder="Enter your password"
				class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
			/>
			<div class="cursor-pointer" on:click={togglePassword}>
				<i
					class="fa fa-fw relative z-2 mt-4"
					style="margin-left: -35px;"
					class:fa-eye={!showPassword}
					class:fa-eye-slash={showPassword}
				/>
			</div>
		</div>
	</div>

	<div
		class="text-[#6C6663] text-xs mt-2 font-semibold inline-block cursor-pointer"
		on:click={forgotPassword}
	>
		Forgot password?
	</div>

	{#if errorMessage}
		<p
			class="text-[#9F392D] text-sm leading-6 font-medium mt-10 text-center"
			style="margin-bottom: -12px;"
		>
			{errorMessage}
		</p>
	{/if}

	<div class="button-form-sign-in mt-5">
		<button
			type="submit"
			class="w-full py-3 px-4 bg-[#302B29] text-white-1 text-lg leading-6 font-semibold rounded-md cursor-pointer"
		>
			NEXT
		</button>
	</div>
</form>
