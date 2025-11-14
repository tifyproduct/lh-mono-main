<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import { Label, Select } from 'flowbite-svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import {
		SERVICES_DROPDOWN_LIST,
		SWU_PRODUCT_DROPDOWN_LIST,
		MODEL_DROPDOWN_LIST,
		CONSIGNMENT_BRAND_DROPDOWN_LIST,
		TRADE_IN_BRAND_DROPDOWN_LIST
	} from '$lib/constant/zoho';
	import { WA_NUMBER } from '$lib/constants.util';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	import { breadcrumbStore } from '$lib/components/Breadcrumb/Breadcrumb';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import type { ZohoSwuBodyRequest } from '$lib/types/zoho';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';
	import InputPhone from '../Input/InputPhone.svelte';
	import Modal from '../Modal/Modal.svelte';
	import { onMount } from 'svelte';
	import { phoneNumberTrimmer } from '$lib/utils/phoneNumber';

	const currentPage = get(page);
	export let productTitle: string | undefined = '';
	export let collection: string | undefined = '';
	export let brand: string | undefined = '';
	export let activeTab: string | undefined = '';

	type Breadcrumb = {
		label: string;
		href?: string;
	};
	let breadcrumbs: Breadcrumb[];
	$: breadcrumbs = $breadcrumbStore;
	let location = '';
	if (currentPage.params.store === 'id') {
		location = 'Indonesia';
	} else {
		location = 'Singapore';
	}

	export let isModalOpen: boolean = false;

	const closeModal = () => {
		isModalOpen = false;
	};

	$: storedCustomerData = localStorage.getItem('customer')
		? JSON.parse(localStorage.getItem('customer') ?? '{}')
		: undefined;

	let customer_name = '';
	let phone_no = '';
	let phoneCode = '+62';
	let email = '';

	let isChatFormSWUEnabled: boolean;

	onMount(() => {
		customer_name =
			!$customerProfileStore?.isLoggedIn && storedCustomerData
				? `${storedCustomerData?.firstName || ''} ${storedCustomerData?.lastName || ''}`.trim()
				: `${$customerProfileStore?.firstName || ''} ${$customerProfileStore?.lastName || ''}`.trim();
		phone_no =
			!$customerProfileStore?.isLoggedIn && storedCustomerData
				? phoneNumberTrimmer(storedCustomerData.phone)
				: phoneNumberTrimmer($customerProfileStore?.phone ?? '');

		email =
			!$customerProfileStore?.isLoggedIn && storedCustomerData
				? storedCustomerData.email
				: ($customerProfileStore?.email ?? '');
	});

	$: {
		isChatFormSWUEnabled = $featureFlagStore.isChatFormSWUEnabled;
	}

	const leadSrc = $page.url.searchParams.get('lead_src') ?? 'Website';
	const utmCampaign = $page.url.searchParams.get('utm_campaign') ?? '';
	const utmMedium = $page.url.searchParams.get('utm_medium') ?? '';
	const utmSource = $page.url.searchParams.get('utm_source') ?? '';
	const utmTerm = $page.url.searchParams.get('utm_term') ?? '';
	const utmContent = $page.url.searchParams.get('utm_content') ?? '';
	const salesCode = $page.url.searchParams.get('sales_code') ?? '';
	const referrer = $page.url.searchParams.get('referrer') ?? '';
	const first_page_visited = window.location.href ?? '';
	const chat_entry_point = window.location.href ?? '';

	let selectedProduct = '';
	let filteredProducts = SWU_PRODUCT_DROPDOWN_LIST;
	if (
		window.location.pathname.includes('/trade-in') ||
		window.location.pathname.includes('/direct-sell')
	) {
		selectedProduct = 'Watch';
		filteredProducts = SWU_PRODUCT_DROPDOWN_LIST.filter((product) => product.value === 'Watch');
	} else if (activeTab === 'watch') {
		selectedProduct = 'Watch';
	} else if (activeTab === 'bags' || window.location.pathname.includes('/bag')) {
		selectedProduct = 'Hermes';
	} else {
		selectedProduct = '';
	}

	$: if (collection && !selectedProduct) {
		selectedProduct = collection;
	}

	let prefilledService = '';
	if (
		window.location.pathname.includes('/consignment') ||
		window.location.pathname.includes('/product')
	) {
		prefilledService = 'consignment';
	} else if (window.location.pathname.includes('/direct-selling')) {
		prefilledService = 'direct-sell';
	} else if (window.location.pathname.includes('trade-in')) {
		prefilledService = 'trade-in';
	}

	let selectedService = prefilledService;

	let availableServices = SERVICES_DROPDOWN_LIST;
	$: if (selectedProduct === 'Hermes') {
		availableServices = SERVICES_DROPDOWN_LIST.filter((service) => service.value === 'consignment');
		selectedService = 'consignment';
	} else {
		availableServices = SERVICES_DROPDOWN_LIST;
	}

	$: if (selectedService === 'trade-in' || selectedService === 'direct-sell') {
		filteredProducts = SWU_PRODUCT_DROPDOWN_LIST.filter((product) => product.value === 'Watch');
	} else {
		filteredProducts = SWU_PRODUCT_DROPDOWN_LIST;
	}

	let selectedBrand = '';
	$: if (brand && !selectedBrand) {
		selectedBrand = brand;
	}

	let otherBrand = '';

	let productName = productTitle;
	let selectedModel = '';

	$: allFieldsFilled =
		selectedProduct === 'Watch'
			? isChatFormSWUEnabled
				? !!customer_name &&
					!!phone_no &&
					!!email &&
					!!selectedBrand &&
					(selectedBrand !== 'OTHERS' || !!otherBrand)
				: !!selectedBrand && (selectedBrand !== 'OTHERS' || !!otherBrand) && !!productName
			: selectedProduct === 'Hermes'
				? isChatFormSWUEnabled
					? !!customer_name && !!phone_no && !!email && !!selectedModel
					: !!selectedModel
				: false;

	let isLoading = false;

	async function submitForm() {
		const formData: ZohoSwuBodyRequest = {
			customer_name: customer_name,
			no_telp: `${phoneCode}${phone_no}`,
			email: email,
			country: location,
			lead_src: leadSrc ?? 'Website',
			utm_campaign: utmCampaign,
			utm_medium: utmMedium,
			utm_source: utmSource,
			utm_term: utmTerm,
			utm_content: utmContent,
			prod_cat: selectedProduct,
			sell_type: selectedService,
			sales_code: salesCode,
			referrer: referrer,
			first_page_visited: first_page_visited,
			chat_entry_point: chat_entry_point,
			watch_data: {
				brand_name: selectedBrand === 'OTHERS' ? otherBrand : selectedBrand
			},
			hermes_data: {
				model: selectedModel || ''
			}
		};

		if (isChatFormSWUEnabled) {
			const splittedName = customer_name.split(' ');
			const firstName: string = splittedName[0];
			const lastName: string =
				splittedName.length > 1 ? splittedName.slice(1, splittedName.length).join(' ').trim() : '';

			const customerData = {
				firstName: firstName,
				lastName: lastName,
				email: email,
				phone: phoneNumberTrimmer(phone_no)
			};

			localStorage.setItem('customer', JSON.stringify(customerData));

			isLoading = true;
			try {
				const response = await fetch('/api/webhooks/zoho-swu', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(formData)
				});

				const result = await response.json();

				if (response.ok) {
					closeModal();
					const phoneNumber = location === 'Indonesia' ? WA_NUMBER.ID_PHONE : WA_NUMBER.SG_BUY;

					const message = encodeURIComponent(
						`Hi Luxehouze! My name is ${formData.customer_name}, I'm interested in ${formData.sell_type} for my ${formData.watch_data.brand_name || formData.hermes_data.model} ${formData.prod_cat}. Could you please help me with the process?`
					);

					const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
					window.open(whatsappURL, '_blank');
				} else {
					console.error('Form submission failed:', result);
				}
			} catch (error) {
				console.error('Error submitting form:', error);
			} finally {
				isLoading = false;
			}
		} else {
			closeModal();
			const phoneNumber = location === 'Indonesia' ? WA_NUMBER.ID_PHONE : WA_NUMBER.SG_BUY;

			const message = encodeURIComponent(
				`Hi Luxehouze! My name is ${formData.customer_name}, I'm interested in ${formData.sell_type} for my ${formData.watch_data.brand_name || formData.hermes_data.model} ${formData.prod_cat}. Could you please help me with the process?`
			);

			const whatsappURL = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;
			window.open(whatsappURL, '_blank');
		}
	}
</script>

<Modal isOpen={isModalOpen} title=" " onClose={closeModal} padding="p-4 lg:p-7" fullScreenMobile>
	<div class="text-center">
		<div class="flex flex-col item-center justify-center text-left lg:text-center">
			<Text type="subtitle-2" color="black-9" weight="semibold" class="mb-2">
				Prefill question for WhatsApp
			</Text>
			<Text type="body-1" color="black-9">Make sure you've entered the right credentials</Text>
		</div>
	</div>
	<div>
		<form on:submit|preventDefault={submitForm} class="mt-8 max-h-[70vh]">
			{#if !$customerProfileStore?.isLoggedIn && isChatFormSWUEnabled && !storedCustomerData}
				<div class="mb-4">
					<Label for="name">
						<Text type="body-2" weight="semibold">Your Name</Text>
						<Text type="body-2" weight="semibold" color="red-6">*</Text>
					</Label>
					<input
						type="text"
						id="name"
						bind:value={customer_name}
						class={`border border-dark-brown-1 rounded-md p-3 min-h-[22px] w-full mt-2 placeholder-black-4`}
						placeholder="John Doe"
					/>
				</div>
				<div class="mb-4">
					<Label for="phoneNumber">
						<Text type="body-2" weight="semibold">Phone Number</Text>
						<Text type="body-2" weight="semibold" color="red-6">*</Text>
					</Label>
					<InputPhone
						bind:value={phone_no}
						id="phoneNumber"
						on:code-change={(e) => (phoneCode = e.detail)}
					/>
				</div>
				<div class="mb-4">
					<Label for="email">
						<Text type="body-2" weight="semibold">Email</Text>
						<Text type="body-2" weight="semibold" color="red-6">*</Text>
					</Label>
					<input
						type="email"
						id="email"
						bind:value={email}
						class={`border border-dark-brown-1 rounded-md p-3 min-h-[22px] w-full mt-2 placeholder-black-4 `}
						placeholder="Insert email"
					/>
				</div>
			{/if}
			<div class="form-product flex flex-col gap-2 mb-4">
				<Label for="product">
					<Text type="body-2" weight="semibold">Product</Text>
					<Text type="body-2" weight="semibold" color="red-6">*</Text>
				</Label>
				<Select
					id="product"
					class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
					items={filteredProducts}
					bind:value={selectedProduct}
					placeholder={'Select Product'}
				/>
			</div>
			<div class="form-product flex flex-col gap-2 mb-4">
				<Label for="service">
					<Text type="body-2" weight="semibold">Service Type</Text>
					<Text type="body-2" weight="semibold" color="red-6">*</Text>
				</Label>
				<Select
					id="service"
					class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
					items={availableServices}
					bind:value={selectedService}
					placeholder={'Service Type'}
				/>
			</div>

			{#if selectedProduct === 'Watch'}
				<div class="form-product flex flex-col gap-2 mb-4">
					<Label for="productBrand">
						<Text type="body-2" weight="semibold">Brand</Text>
						<Text type="body-2" weight="semibold" color="red-6">*</Text>
					</Label>
					<Select
						id="productBrand"
						class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
						items={selectedService === 'consignment'
							? CONSIGNMENT_BRAND_DROPDOWN_LIST
							: TRADE_IN_BRAND_DROPDOWN_LIST}
						bind:value={selectedBrand}
						itemLabelKey="name"
						itemValueKey="value"
						placeholder={'Select a Brand'}
					/>
				</div>
			{/if}
			{#if selectedProduct === 'Hermes'}
				<div class="form-product flex flex-col gap-2 mb-4">
					<label for="hermesModel" class="text-sm text-left leading-[22px] text-[#24252B] font-bold"
						>Model
					</label>
					<Select
						id="hermesModel"
						class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full"
						items={MODEL_DROPDOWN_LIST}
						bind:value={selectedModel}
						placeholder={'Select a Model'}
					/>
				</div>
			{/if}

			{#if selectedBrand === 'OTHERS'}
				<div class="form-product flex flex-col gap-2 mb-4">
					<Label for="otherBrand">
						<Text type="body-2" weight="semibold">Your Brand</Text>
						<Text type="body-2" weight="semibold" color="red-6">*</Text>
					</Label>
					<input
						type="text"
						id="otherBrand"
						bind:value={otherBrand}
						class="border border-[#DBD8D7] rounded-md p-3 min-h-[22px] w-full placeholder-black-4 bg-gray-50"
						placeholder="Enter brand name"
					/>
				</div>
			{/if}

			<div class="pb-4">
				<Button
					variant="primary"
					class="w-full"
					type="submit"
					disabled={!allFieldsFilled || isLoading}
				>
					{isLoading ? 'Loading...' : 'SUBMIT AND CHAT'}
				</Button>
			</div>
		</form>
	</div>
</Modal>
