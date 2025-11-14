<script>
	import { onMount, afterUpdate } from 'svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import { WhatsappFillLogos, ArrowRightSLineArrows } from 'svelte-remix';
	import { ActiveTabSWU } from './ActiveTabStore';
	import SWUModal from '$lib/components/SWUModal/SWUModal.svelte';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	// import AuthenticationModal from '$lib/components/AuthenticationModal/AuthenticationModal.svelte';
	import { showAuthenticationModal } from '$lib/stores/authentication';

	const Image1 =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/SWU_How_it_Works_image_consignment.jpg?v=1732863099';
	const Image2 =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/SWU_How_it_Works_image_trade-in.jpg?v=1732862876';
	const Image3 =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/SWU_How_it_Works_image_direct-selling.jpg?v=1732862942';

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
		openModal();
	};

	const images = {
		Consignment: Image1,
		'Trade-in': Image2,
		'Direct Selling': Image3
	};

	const stepsData = {
		Consignment: [
			{
				id: 1,
				step: '1. Appraisal',
				desc: 'Contact our Client Advisor through our website, WhatsApp, Instagram, or Carousell (Singapore only), and complete our online form. Help us make a fair value assessment by providing detailed information of your item, including real, hi-res images.',
				buttonText: 'FILL FORM',
				image: Image1,
				hasIcon: true
			},
			{
				id: 2,
				step: '2. Pricing & Negotiation',
				desc: 'We will assess the value of the item based on the details you provide. Once the process is done, our Client Advisor will get back to you with a proposed price within 48 hours. Feel free to negotiate.',
				buttonText: 'CONTACT US',
				hasIcon: true,
				image: Image1
			},
			{
				id: 3,
				step: '3. Inspection',
				desc: 'Once we reach an agreement on the price, schedule a visit and bring your item to our boutique store to be inspected. Our team of expert authenticators will check its condition and authenticity.',
				buttonText: 'SCHEDULE INSPECTION',
				hasIcon: true,
				image: Image1
			},
			{
				id: 4,
				step: '4. Agreement & Listing',
				desc: "Once the inspection process is completed, sign the Consignment agreement. We'll then list your item on our online channels and actively offer it to our network of clients.",
				buttonText: 'GET STARTED',
				hasIcon: true,
				image: Image1
			},
			{
				id: 5,
				step: '5. Payment',
				desc: "Once your item is sold, we'll contact you and transfer your payment within 3 business days",
				buttonText: 'GET STARTED',
				hasIcon: true,
				image: Image1
			}
		],
		'Trade-in': [
			{
				id: 1,
				step: '1. Appraisal',
				desc: 'Contact our Client Advisor through our website, WhatsApp, Instagram, or Carousell (Singapore only) and complete our online form. Let us know which item you want to trade in for. Also, provide detailed information of your item, including real, hi-res images, to help us make a fair value assessment of it.',
				buttonText: 'CHECK NOW',
				image: Image2,
				hasIcon: true
			},
			{
				id: 2,
				step: '2. Pricing & Negotiation',
				desc: "We'll use the details you provide to assess the value of your item and the possibility for a Trade-In. Our Client Advisor will get back to you with a price offer within 48 hours if a Trade-In is deemed possible. Feel free to negotiate.",
				buttonText: 'CONTACT US',
				hasIcon: true,
				image: Image2
			},
			{
				id: 3,
				step: '3. Inspection',
				desc: 'Next, schedule a visit and bring your item to our boutique store to be inspected. Our team of expert authenticators will check its condition and authenticity. The final price for your item is subject to the inspection result.',
				buttonText: 'SCHEDULE INSPECTION',
				hasIcon: true,
				image: Image2
			},
			{
				id: 4,
				step: '4. Payment',
				desc: 'Once we reach an agreement on the price, hand your item over to us, pay the difference, and bring home your new item.',
				buttonText: 'GET STARTED',
				hasIcon: true,
				image: Image2
			}
		],
		'Direct Selling': [
			{
				id: 1,
				step: '1. Appraisal',
				desc: 'Contact our Client Advisor through our website, WhatsApp, Instagram, or Carousell (Singapore only) and complete our online form. To help us make a fair value assessment, provide detailed information of your item, including real, hi-res images of it.',
				buttonText: 'FILL FORM',
				image: Image3,
				hasIcon: true
			},
			{
				id: 2,
				step: '2. Pricing & Negotiation',
				desc: "We'll use the details you provide to assess the value of the item and the possibility for us to directly purchase it. Once the process is done, our Client Advisor will get back to you with a price offer within 48 hours or if we can't directly purchase the item, we'll offer you our Consignment service instead.",
				buttonText: 'CONTACT US',
				hasIcon: true,
				image: Image3
			},
			{
				id: 3,
				step: '3. Inspection',
				desc: 'Next, schedule a visit and bring your item to our boutique store to be inspected. Our team of expert authenticators will check its condition and authenticity. The final price is subject to the inspection result.',
				buttonText: 'SCHEDULE INSPECTION',
				hasIcon: true,
				image: Image3
			},
			{
				id: 4,
				step: '4. Payment',
				desc: "Once we reach an agreement on the price, sign the invoice and hand the item over to us. We'll transfer your payment within 24 hours.",
				buttonText: 'GET STARTED',
				hasIcon: true,
				image: Image3
			}
		]
	};

	let activeTab = 'Consignment';
	let activeIndex = null;
	let currentImage = images[activeTab];
	let currentAccordionImage = null;
	$: activeTab = $ActiveTabSWU;

	function changeTab(tab) {
		activeTab = tab;
		currentImage = images[activeTab];
		ActiveTabSWU.set(tab);
		activeIndex = null;
		currentAccordionImage = null;

		history.pushState(null, '', `/id/en/sell-with-us/${tab.replace(/\s+/g, '-').toLowerCase()}`);
	}
	function toggleAccordion(index, image) {
		activeIndex = activeIndex === index ? null : index;

		if (activeIndex === index) {
			currentAccordionImage = image;
		} else {
			currentAccordionImage = null;
		}
	}

	afterUpdate(() => {
		currentImage = images[activeTab];
	});

	onMount(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const tab = urlParams.get('tab');

		if (tab && ['Consignment', 'Trade-in', 'Direct Selling'].includes(tab)) {
			activeTab = tab;
		} else {
			activeTab = 'Consignment';
		}

		currentImage = images[activeTab];
	});
</script>

<div class="container max-w-[1600px] px-4 py-8 md:py-16">
	<div class="text-center text-3xl font-semibold mb-7">How It Works</div>
	<div class="flex justify-center mb-5 gap-4">
		{#each ['Consignment', 'Trade-in', 'Direct Selling'] as tab}
			<button
				class={`py-2 px-2 md:px-4 text-sm font-medium border border-[#E9EBF0] rounded ${activeTab === tab ? 'text-[#24252B] bg-[#EAE8E7] rounded border-b-2 !border-[#24252b]' : 'text-gray-600'}`}
				on:click={() => changeTab(tab)}
			>
				{tab}
			</button>
		{/each}
	</div>
	<div class="flex flex-col lg:flex-row lg:gap-24 mt-7">
		<div class="w-full lg:w-[65%] relative">
			{#each stepsData[activeTab] as stepItem, index}
				<div class="border-b border-black-1 last:border-b-0 ml-0 md:ml-4">
					<button
						class="w-full py-4 text-left font-medium text-gray-900 bg-transparent hover:bg-gray-200 focus:outline-none"
						on:click={() => toggleAccordion(index, stepItem.image)}
					>
						<div class="flex justify-between">
							<span>{stepItem.step}</span>
							{#if stepItem.hasIcon}
								<ArrowRightSLineArrows class="text-gray-600" />
							{/if}
						</div>
					</button>
					{#if activeIndex === index}
						<div class="py-2 px-0 md:px-5">
							<img
								src={currentAccordionImage || stepItem.image}
								alt={stepItem.step}
								class="mt-2 w-full rounded md:hidden"
							/>
							<div class="mt-4"><Text type="body-1">{stepItem.desc}</Text></div>
							<div class="mt-2 inline-block py-2 px-0 text-white rounded">
								<button
									class="border-2 rounded border-black-9 px-8 py-2 gap-2 flex"
									on:click={openModal}
								>
									{stepItem.buttonText}
									<WhatsappFillLogos />
								</button>
							</div>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<div class="w-full lg:w-[35%] flex justify-center items-center">
			<img
				src={currentAccordionImage || currentImage}
				alt={activeTab}
				class="object-cover hidden md:block"
			/>
		</div>
	</div>

	<!-- {#if $showAuthenticationModal}
		<AuthenticationModal
			credentialSoc={credential}
			on:close={closeAuthentication}
			on:close-success={closeAuthenticationSuccess}
		/>
	{/if} -->
</div>
{#if showModal}
	<SWUModal bind:isModalOpen={showModal} on:closeModal={closeModal} />
{/if}
