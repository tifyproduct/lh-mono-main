<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { customerRecovery } from '$lib/graphql.util';

	const checkEmailSchema = customerRecovery();
	const dispatch = createEventDispatcher();

	let showSuccessEmail = false;
	let email = '';
	let errorMessage = '';

	async function handleSubmit(event: any) {
		event.preventDefault();

		dispatch('loading-on');

		try {
			const response = await fetch('/api/auths/forgot-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					query: checkEmailSchema.schema,
					variables: { email }
				})
			});

			const result = await response.json();

			if (result.data.customerRecover?.userErrors.length < 1) {
				showSuccessEmail = true;
			} else {
				errorMessage = 'Your email is not registered!';
			}
		} catch (error) {
			errorMessage = 'Internal Server Error, Try again later.';
		} finally {
			dispatch('loading-off');
		}
	}

	function returnSignIn() {
		dispatch('return-signin');
	}
</script>

{#if !showSuccessEmail}
	<form on:submit={handleSubmit} class="flex flex-col">
        <div class="my-6">
            <div class="mb-4 text-2xl font-semibold leading-8 text-[#24252B] text-center">
                Forgot Password?
            </div>
    
            <div class="text-base font-normal leading-6 text-[#24252B] text-center">
                Don’t worry! Fill in your email and we’ll send you a link to reset your password.
            </div>
        </div>

		<div class="form-email flex flex-col gap-1 mb-5">
			<label for="email" class="text-sm leading-[22px] text-[#24252B] font-bold">Email</label>
			<input
				id="email"
				type="text"
				bind:value={email}
				class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
			/>
		</div>

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
				type="submit"
				class="w-full py-3 px-4 bg-[#302B29] text-white-1 text-lg leading-6 font-semibold rounded-md cursor-pointer"
			>
				SEND RESET LINK
			</button>
		</div>
	</form>
	<div class="mt-3 flex justify-center">
		<button
			class="cursor-pointer no-underline text-[#302B29] font-semibold leading-[22px] text-sm"
			on:click={returnSignIn}
		>
			RETURN TO SIGN IN
		</button>
	</div>
{/if}
<!-- end of container signin -->

<!-- container for success sent email  -->
{#if showSuccessEmail}
	<div class="my-8">
		<div class="mb-2 text-2xl font-semibold leading-8 text-[#24252B] text-center">
			Email Verification Sent!
		</div>
		<div class="text-base font-normal leading-6 text-[#24252B] text-center">
			We’ve sent a reset password link to <strong>{email}.</strong> Check your email and click the link
			we’ve sent to continue. If it doesn’t show up, kindly check your spam folder.
		</div>
	</div>

	<div class="button-form-sign-in mt-5">
		<button
			type="submit"
			class="w-full py-3 px-4 bg-[#302B29] text-white-1 text-lg leading-6 font-semibold rounded-md cursor-pointer"
			on:click={returnSignIn}
		>
			RETURN TO SIGN IN
		</button>
	</div>
{/if}
