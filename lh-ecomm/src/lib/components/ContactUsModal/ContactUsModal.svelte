<script lang="ts">
	import { Label, Select } from 'flowbite-svelte';
	import Modal from '../Modal/Modal.svelte';
	import Text from '../Text/Text.svelte';

	import {
		BAG_BRAND_DROPDOWN_LIST,
		BEAUTY_BRAND_DROPDOWN_LIST,
		BUYER_PRODUCT_CATEGORY_DROPDOWN_LIST,
		JEWELRY_BRAND_DROPDOWN_LIST,
		WATCH_BRAND_DROPDOWN_LIST
	} from '$lib/constant/zoho';

	import selectedProductStore from '$lib/stores/selectedProductStore';

	import Button from '../Button/Button.svelte';
	import { isEmail, isEmpty, isNumber } from '$lib/utils/inputValidator';
	import type { CustomerProfile } from '$lib/types/customer';
	import { breadcrumbStore } from '$lib/components/Breadcrumb/Breadcrumb';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	import { createEventDispatcher, onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { DropDownItem } from '$lib/types/input/select';
	import InputPhone from '../Input/InputPhone.svelte';
	import { phoneNumberTrimmer } from '$lib/utils/phoneNumber';

	export let isOpen;

	const dispatch = createEventDispatcher();

	let customer: CustomerProfile | undefined = $customerProfileStore;
	let name: string;
	let nameError: string;
	let phoneCode: string = '+62';
	let phoneNumber: string;
	let phoneNumberError: string;
	let email: string;
	let emailError: string;
	let productCategory: string;
	let brand: string | undefined;
	let productName: string = $selectedProductStore?.title ?? '';
	let productNameError: string;
	let hasError: boolean = true;
	let mappedBrand: DropDownItem[];

	const storedCustomerData = localStorage.getItem('customer')
		? JSON.parse(localStorage.getItem('customer') ?? '{}')
		: undefined;

	onMount(() => {
		name =
			!customer?.isLoggedIn && storedCustomerData
				? `${storedCustomerData?.firstName ?? ''}${storedCustomerData?.lastName ? ` ${storedCustomerData?.lastName}` : ''}`
				: `${customer?.firstName ?? ''}${customer?.lastName ? ` ${customer?.lastName}` : ''}`;
		phoneNumber =
			!customer?.isLoggedIn && storedCustomerData
				? phoneNumberTrimmer(storedCustomerData.phone)
				: phoneNumberTrimmer(customer?.phone ?? '');
		email =
			!customer?.isLoggedIn && storedCustomerData
				? storedCustomerData.email
				: (customer?.email ?? '');
	});
	$: {
		const collectionHandle = $page.params.type ?? $page.params.handle;
		const capitalizedCollectionHandle =
			String(collectionHandle).charAt(0).toUpperCase() + String(collectionHandle).slice(1);
		customer = $customerProfileStore;

		if (!productCategory) {
			productCategory = collectionHandle
				? capitalizedCollectionHandle
				: ($breadcrumbStore[0]?.label ?? '');
		}

		if (!brand) {
			brand = (
				$breadcrumbStore[1]?.label?.toUpperCase() == '-' && $breadcrumbStore.length > 1
					? $breadcrumbStore[2]?.label?.toUpperCase()
					: ($breadcrumbStore[1]?.label?.toUpperCase() ?? '')
			)
				.normalize('NFD')
				.replace(/[\u0300-\u036f]/g, '');
		}
	}

	const handleCategoryChange = (event: Event) => {
		productCategory = (event.target as HTMLInputElement).value;

		brand = undefined;

		switch (productCategory) {
			case 'Watch':
				mappedBrand = WATCH_BRAND_DROPDOWN_LIST;
				break;
			case 'Bag':
				mappedBrand = BAG_BRAND_DROPDOWN_LIST;
				break;
			case 'Jewelry':
				mappedBrand = JEWELRY_BRAND_DROPDOWN_LIST;
				break;
			case 'Beauty':
				mappedBrand = BEAUTY_BRAND_DROPDOWN_LIST;
				break;
		}
	};

	$: {
		if (!customer?.isLoggedIn) {
			hasError =
				!!nameError ||
				!!phoneNumberError ||
				!!emailError ||
				!!productNameError ||
				!name ||
				!phoneNumber ||
				!email ||
				!productCategory ||
				!brand ||
				!productName;
		} else {
			hasError = !productCategory || !brand || !productName;
		}
	}

	onMount(() => {
		switch (productCategory) {
			case 'Watch':
				mappedBrand = WATCH_BRAND_DROPDOWN_LIST;
				break;
			case 'Bag':
				mappedBrand = BAG_BRAND_DROPDOWN_LIST;
				break;
			case 'Jewelry':
				mappedBrand = JEWELRY_BRAND_DROPDOWN_LIST;
				break;
			case 'Beauty':
				mappedBrand = BEAUTY_BRAND_DROPDOWN_LIST;
				break;
		}
	});

	const validateName = () => {
		nameError = '';

		if (isEmpty(name)) {
			nameError = 'Please insert your name';
		}
	};

	const validatePhoneNumber = () => {
		phoneNumberError = '';

		if (isEmpty(phoneNumber)) {
			phoneNumberError = 'Please insert your phone number';
			return;
		}

		if (!isNumber(phoneNumber)) {
			phoneNumberError = 'Plese insert corrent format';
			return;
		}
	};

	const validateEmail = () => {
		emailError = '';

		if (isEmpty(email)) {
			emailError = 'Please insert your email';
			return;
		}

		if (!isEmail(email)) {
			emailError = 'Please insert correct email format';
			return;
		}
	};

	const validateProductName = () => {
		productNameError = '';

		if (isEmpty(productName)) {
			productNameError = 'Please insert product name';
			return;
		}
	};

	const handleOnClose = () => {
		dispatch('close-modal');
	};

	const handleSubmitModal = () => {
		if (hasError) return;

		const splittedName = name.split(' ');
		const firstName: string = splittedName[0];
		const lastName: string =
			splittedName.length > 1 ? splittedName.slice(1, splittedName.length).join(' ').trim() : '';

		const customerData = {
			firstName: firstName,
			lastName: lastName,
			email: email,
			phone: phoneNumberTrimmer(phoneNumber)
		};

		const existingCustomerData = localStorage.getItem('customer')
			? JSON.parse(localStorage.getItem('customer'))
			: {};

		const updatedCustomerData = {
			...existingCustomerData,
			...existingCustomerData
		};

		localStorage.setItem('customer', JSON.stringify(updatedCustomerData));

		dispatch('submit', {
			firstName,
			lastName,
			phoneNumber: `${phoneCode}${phoneNumber}`,
			email,
			productCategory,
			brand,
			productName
		});
	};
</script>

<Modal {isOpen} title=" " onClose={handleOnClose} padding="p-4 lg:p-7" fullScreenMobile>
	<div class="flex flex-col item-center justify-center text-center mb-4">
		<Text type="subtitle-2" color="black-9" weight="semibold" class="mb-2"
			>How Can We Assist You?
		</Text>
		<Text type="body-1" color="black-9">Share your details to get started.</Text>
	</div>
	<div class="max-lg:min-h-[88vh]">
		{#if !customer?.isLoggedIn}
			<div class="mb-4">
				<Label for="name">
					<Text type="body-2" weight="semibold">Your Name</Text>
					<Text type="body-2" weight="semibold" color="red-6">*</Text>
				</Label>
				<input
					type="text"
					id="name"
					bind:value={name}
					class={`border border-dark-brown-1 rounded-md p-3 min-h-[22px] w-full mt-2 placeholder-black-4 ${nameError ? 'border-2 border-red-6' : ''}`}
					placeholder="John Doe"
					on:blur={validateName}
				/>
				{#if nameError}
					<Text type="caption-1" color="red-6" class="mt-2">{nameError}</Text>
				{/if}
			</div>
			<div class="mb-4">
				<Label for="phoneNumber">
					<Text type="body-2" weight="semibold">Phone Number</Text>
					<Text type="body-2" weight="semibold" color="red-6">*</Text>
				</Label>
				<InputPhone
					bind:value={phoneNumber}
					id="phoneNumber"
					onBlur={validatePhoneNumber}
					classCustom={`${phoneNumberError ? 'border-2 border-red-6' : ''}`}
					on:code-change={(e) => (phoneCode = e.detail)}
				/>
				{#if phoneNumberError}
					<Text type="caption-1" color="red-6" class="mt-2">{phoneNumberError}</Text>
				{/if}
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
					on:blur={validateEmail}
					class={`border border-dark-brown-1 rounded-md p-3 min-h-[22px] w-full mt-2 placeholder-black-4 ${emailError ? 'border-2 border-red-6' : ''}`}
					placeholder="Insert email"
				/>
				{#if emailError}
					<Text type="caption-1" color="red-6" class="mt-2">{emailError}</Text>
				{/if}
			</div>
		{/if}
		<div class="mb-4">
			<Label for="productCategory">
				<Text type="body-2" weight="semibold">Product Category</Text>
				<Text type="body-2" weight="semibold" color="red-6">*</Text>
			</Label>
			<Select
				id="productCategory"
				items={BUYER_PRODUCT_CATEGORY_DROPDOWN_LIST}
				bind:value={productCategory}
				on:change={handleCategoryChange}
				class={`border border-dark-brown-1 rounded-md p-3 min-h-[22px] w-full mt-2`}
			/>
		</div>
		<div class="mb-4">
			<Label for="brand">
				<Text type="body-2" weight="semibold">Brand</Text>
				<Text type="body-2" weight="semibold" color="red-6">*</Text>
			</Label>
			<Select
				id="brand"
				class={`border border-dark-brown-1 rounded-md p-3 min-h-[22px] w-full mt-2`}
				bind:value={brand}
				items={mappedBrand}
			/>
		</div>
		<div class="mb-4">
			<Label for="productName">
				<Text type="body-2" weight="semibold">Product Name</Text>
				<Text type="body-2" weight="semibold" color="red-6">*</Text>
			</Label>
			<input
				type="text"
				id="productName"
				bind:value={productName}
				on:blur={validateProductName}
				class={`border border-dark-brown-1 rounded-md p-3 min-h-[22px] w-full mt-2 placeholder-black-4 ${productNameError ? 'border-2 border-red-6' : ''}`}
				placeholder="Insert product name"
			/>
			{#if productNameError}
				<Text type="caption-1" color="red-6" class="mt-2">{productNameError}</Text>
			{/if}
		</div>
		<div
			class="mt-8 max-lg:fixed max-lg:w-full max-lg:left-0 max-lg:bottom-0 max-lg:p-4 z-10 bg-white-1"
		>
			<Button
				variant="primary"
				class="w-full"
				type="submit"
				disabled={hasError}
				onClick={handleSubmitModal}
			>
				{'SUBMIT AND CHAT'}
			</Button>
		</div>
	</div>
</Modal>
