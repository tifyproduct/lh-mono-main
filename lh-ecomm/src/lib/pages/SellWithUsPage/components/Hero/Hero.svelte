<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { WhatsappLineLogos, WhatsappFillLogos } from 'svelte-remix';
	import SWUModal from '$lib/components/SWUModal/SWUModal.svelte';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	// import AuthenticationModal from '$lib/components/AuthenticationModal/AuthenticationModal.svelte';
	import { showAuthenticationModal } from '$lib/stores/authentication';

	const HeroImage =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/SWU_Hero_Banner_-_Desktop_1_807f0e78-f468-40a2-926f-14d50db6c537.jpg?v=1732862460';

	const HeroImageMobile =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/SWU_Hero_Banner_-_Mobile_1.jpg?v=1732862567';

	export let credential;

	$: isLoggedIn = $customerProfileStore?.isLoggedIn;
	let showModal = false;

	const openModal = () => {
		// if (isLoggedIn) {
		// 	showModal = true;
		// } else {
		// 	handleSignIn();
		// }
		showModal = true;
	};

	const handleSignIn = () => {
		$showAuthenticationModal = true;
	};
	const closeModal = () => {
		showModal = false;
	};
	const closeAuthentication = () => {
		$showAuthenticationModal = false;
	};

	const closeAuthenticationSuccess = () => {
		$showAuthenticationModal = false;
		customerProfileStore.set({ ...$customerProfileStore, isLoggedIn: true });
	};
</script>

<div
	class="container max-w-[1600px] bg-cover bg-center bg-no-repeat h-auto grid justify-center items-center text-center px-4 py-40 hidden md:grid"
	style="background-image: url('{HeroImage}')"
>
	<Text type="subtitle-1" color="white-1" class="text-xl !font-semibold md:text-2xl lg:text-3xl">
		SELL YOUR LUXURY GOODS WITH US
	</Text>
	<Text
		color="white-1"
		type="title-2"
		class="text-base md:text-2xl lg:text-5xl mx-4 md:mx-8 lg:mx-32 mt-4 font-playfair md:font-playfair leading-6 md:leading-8 lg:leading-[54px]"
	>
		Fast. Easy. Secure.
	</Text>
	<a class="flex justify-center mt-8" target="_blank" on:click={openModal}>
		<Button
			variant="secondary"
			class="flex gap-2 px-4 py-2 border-2 border-white-1 bg-white-1 text-black-9 md:bg-transparent md:text-white-1 md:border-white-1 relative"
		>
			START SELLING

			<WhatsappFillLogos alt="" class="inline-block md:hidden" />
			<WhatsappLineLogos class="hidden md:inline-block" />
		</Button>
	</a>
</div>

<div
	class="container max-w-[1600px] bg-cover bg-center bg-no-repeat h-auto grid justify-center items-center text-center px-4 py-40 md:hidden"
	style="background-image: url('{HeroImageMobile}')"
>
	<Text type="subtitle-1" color="white-1" class="text-xl !font-semibold md:text-2xl lg:text-3xl">
		SELL YOUR LUXURY GOODS WITH US
	</Text>
	<Text
		color="white-1"
		type="title-2"
		class="text-base md:text-2xl lg:text-5xl mx-4 md:mx-8 lg:mx-32 mt-4 font-playfair md:font-playfair leading-6 md:leading-8 lg:leading-[54px]"
	>
		Fast. Easy. Secure.
	</Text>
	<a class="flex justify-center mt-8" target="_blank" on:click={openModal}>
		<Button
			variant="secondary"
			class="flex gap-2 px-4 py-2 border-2 border-white-1 bg-white-1 text-black-9 md:bg-transparent md:text-white-1 md:border-white-1 relative"
		>
			START SELLING

			<WhatsappFillLogos alt="" class="inline-block md:hidden" />
			<WhatsappLineLogos class="hidden md:inline-block" />
		</Button>
	</a>
</div>

<!-- {#if $showAuthenticationModal}
		<AuthenticationModal
			credentialSoc={credential}
			on:close={closeAuthentication}
			on:close-success={closeAuthenticationSuccess}
		/>
	{/if} -->
{#if showModal}
	<SWUModal bind:isModalOpen={showModal} on:closeModal={closeModal} />
{/if}
