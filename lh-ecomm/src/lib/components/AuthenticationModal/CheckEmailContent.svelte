<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { registerCustomer, loginCustomer, customerRecovery } from '$lib/graphql.util';
	import Button from '$lib/components/Button/Button.svelte';
	import { initializeApp } from 'firebase/app';
	import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
	import { emailRegex } from '$lib/constants.util';
	import { STORE } from '$lib/constants.util';
	import { whatsappLogin } from '$lib/stores/authentication';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	const checkEmailFormSchema = customerRecovery();
	const checkEmailSchema = registerCustomer();
	const loginSchema = loginCustomer();
	const dispatch = createEventDispatcher();

	let email = '';
	let errorMessage = '';
	let showGoogle = true;
	export let credentialSoc;
	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const country = $page.params.store || STORE.id;

	const firebaseConfig = {
		apiKey: credentialSoc.API_KEY,
		authDomain: credentialSoc.AUTH_DOMAIN,
		projectId: credentialSoc.PROJECT_ID,
		storageBucket: credentialSoc.STORAGE_BUCKET,
		messagingSenderId: credentialSoc.MESSAGING_SENDER_ID,
		appId: credentialSoc.APP_ID
	};

	const app = initializeApp(firebaseConfig);

	async function logAuthFailure(errorMessage: string) {
		await fetch('/api/logs/auth/failure', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email,
				eventAction: 'social-login',
				errorMessage
			})
		});
	}

	const socialLogin = async () => {
		const auth = getAuth(app);

		let email = '';

		try {
			const res: any = await signInWithPopup(auth, new GoogleAuthProvider());
			email = res._tokenResponse.email;

			dispatch('loading-on');

			const checkingVerification = await fetch('/api/auths/checking-email', {
				method: 'POST',
				body: JSON.stringify({
					email: res._tokenResponse.email
				})
			});

			const resultChecking = await checkingVerification.json();

			if (!resultChecking) {
				await fetch('/api/auths/register/old', {
					method: 'POST',
					body: JSON.stringify({
						shopifyId: null,
						firstName: res._tokenResponse.firstName,
						lastName: res._tokenResponse.lastName,
						email: res._tokenResponse.email,
						password: res._tokenResponse.email,
						acceptsMarketing: true,
						method: 'social-login-google',
						token: null
					})
				});

				const response = await fetch('/api/auths/register-shopify', {
					method: 'POST',
					body: JSON.stringify({
						query: checkEmailSchema.schema,
						variables: {
							input: {
								firstName: res._tokenResponse.firstName,
								lastName: res._tokenResponse.lastName,
								email: res._tokenResponse.email,
								password: res._tokenResponse.email,
								acceptsMarketing: true
							}
						}
					})
				});

				const resultRegShopify = await response.json();

				if (resultRegShopify?.errors?.length > 0) {
					console.error(`Error from Register Shopify API for ${email}: `, resultRegShopify.errors);
					throw new Error('Internal Server Error, Try again later.');
				} else {
					const responseLogin = await fetch('/api/auths/login-shopify', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							query: loginSchema.schema,
							variables: {
								email: res._tokenResponse.email,
								password: res._tokenResponse.email
							}
						})
					});

					const result = await responseLogin.json();

					if (result.success) {
						dispatch('phone-update', { email: res._tokenResponse.email });
					} else {
						console.error(`Error response from Login Shopify API for ${email}: `, result);
						throw new Error(result.message);
					}
				}
			} else {
				const responseLogin = await fetch('/api/auths/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						email: res._tokenResponse.email,
						password: res._tokenResponse.email
					})
				});

				const result = await responseLogin.json();

				if (result.success && !result.token) {
					const responseLogin = await fetch('/api/auths/login-shopify', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							query: loginSchema.schema,
							variables: {
								email: res._tokenResponse.email,
								password: res._tokenResponse.email
							}
						})
					});

					const resultShop = await responseLogin.json();

					if (resultShop.success) {
						dispatch('success');
						dispatch('close-success');
					} else {
						throw new Error(resultShop.message);
					}
				} else {
					if (result.success) {
						dispatch('close-success');
					} else {
						throw new Error(result.message);
					}
				}
			}

			googleAnalClickedEvent('click_continue_with_google', {
				customer: {
					email: email
				},
				signIn: {
					result: 'success'
				}
			});
		} catch (err) {
			dispatch('error', {
				message: err instanceof Error ? err.message : 'Internal Server Error, Try again later.'
			});

			googleAnalClickedEvent('click_continue_with_google', {
				customer: {
					email: email
				},
				signIn: {
					result: 'failed',
					errorMessage: err.message || 'Internal Server Error'
				}
			});

			logAuthFailure(err.message || 'Unknown error');
		} finally {
			dispatch('loading-off');
		}
	};

	async function handleCheckingSubmit(event: any) {
		event.preventDefault();

		dispatch('loading-on');

		let errorMessage = '';

		if (!emailRegex.test(email)) {
			errorMessage = 'Email format is required!';
			dispatch('loading-off');
			return;
		}

		try {
			const checkingVerification = await fetch('/api/auths/checking-email', {
				method: 'POST',
				body: JSON.stringify({
					email
				})
			});

			const resultChecking = await checkingVerification.json();

			if (!resultChecking) {
				dispatch('signup', { email });
			} else {
				dispatch('signin', { email });
			}
		} catch (error) {
			errorMessage = 'Internal Server Error, Try again later.';
		} finally {
			dispatch('loading-off');
		}
	}
</script>

{#if showGoogle}
	<Button
		class="mt-6 mb-2 rounded-md flex justify-center items-center gap-5 text-[#302B29] leading-6 text-lg font-bold border border-black cursor-pointer py-4"
		onClick={(e) => socialLogin()}
		variant="secondary"
	>
		<img src="/icons/googleimg.svg" alt="" />
		CONTINUE WITH GOOGLE
	</Button>
{/if}

<!-- Hide for now -->

<!-- <div class="h-px bg-[#E9EBF0] w-full my-5"></div> -->

<!-- <form on:submit={handleCheckingSubmit} class="flex flex-col">
	<div class="form-email flex flex-col gap-2 mb-3">
		<label for="email" class="text-sm leading-[22px] text-[#24252B] font-bold">Email</label>
		<input
			id="email"
			type="text"
			bind:value={email}
			class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
			on:input={() => {
				errorMessage = '';
				showGoogle = true;
			}}
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

	<div class="button-form-sign-in mt-5">
		<button
			type="submit"
			class="w-full py-3 px-4 bg-[#302B29] text-white-1 text-lg leading-6 font-semibold rounded-md cursor-pointer"
		>
			NEXT
		</button>
	</div>
</form> -->
