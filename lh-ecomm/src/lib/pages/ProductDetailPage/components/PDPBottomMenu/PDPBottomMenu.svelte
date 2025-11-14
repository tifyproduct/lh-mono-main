<script lang="ts">
	import { BottomNav, BottomNavItem } from 'flowbite-svelte';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import SWUModal from '$lib/components/SWUModal/SWUModal.svelte';
	import { buySellWhatsappRedirect } from '$lib/utils/whatsappRedirect';
	import selectedProductStore from '$lib/stores/selectedProductStore';
	import { breadcrumbStore } from '$lib/components/Breadcrumb/Breadcrumb';
	import type { CustomerProfile } from '$lib/types/customer';
	import { whatsappLogin, showAuthenticationModal } from '$lib/stores/authentication';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import ContactUsModal from '$lib/components/ContactUsModal/ContactUsModal.svelte';
	import type { BreadcrumbProps } from '$lib/types/breadcrumb';
	import { redirectToWhatsapp, pdpWhatsappRedirect } from '$lib/utils/whatsappRedirect';
	import { get } from 'svelte/store';
	import { STORE, WA_MESSAGE } from '$lib/constants.util';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';
	import { WhatsappFillLogos, WhatsappLineLogos } from 'svelte-remix';
	import { phoneNumberTrimmer } from '$lib/utils/phoneNumber';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let title: string;
	export let productType: string;
	export let storeLocation: string;
	export let customer: CustomerProfile | undefined;

	let breadcrumbs: BreadcrumbProps[];

	$: selectedProductData = $selectedProductStore;
	$: breadcrumbs = $breadcrumbStore;

	let showContactUsModal = false;
	const isAbTestVariantb = $page.data.ABVariants === 'variant_b'

	let isChatFormEnabled: boolean;
	$: {
		isChatFormEnabled = $featureFlagStore.isChatFormEnabled;
	}

	let eventNameAskViaWA = 'click_button_ask_via_WA';
	let eventNameSellWithUs = 'click_button_sell_with_us';

	if ($page.data.ABVariants === 'variant_a'){
		eventNameAskViaWA = 'click_button_ask_via_WA_varA';
		eventNameSellWithUs = 'click_button_sell_with_us_varA';
	}else if($page.data.ABVariants === 'variant_b'){
		eventNameAskViaWA = 'click_button_ask_via_WA_varB_green';
		eventNameSellWithUs = 'click_button_sell_with_us_varB_green';
	}

	const onClickBuy = (buttonText: string) => {
		googleAnalClickedEvent(eventNameAskViaWA, {
			locale: $page.params.lang,
			utm_campaign: $page.url.searchParams.get('utm_campaign') ?? '',
			utm_medium: $page.url.searchParams.get('utm_medium') ?? '',
			utm_source: $page.url.searchParams.get('utm_source') ?? '',
			utm_term: $page.url.searchParams.get('utm_term') ?? '',
			utm_content: $page.url.searchParams.get('utm_content') ?? '',
			product: {
				name: title,
				label: breadcrumbs[1].label,
				category: breadcrumbs[0].label
			},
			customer: {
				email: $customerProfileStore?.email
			}
		});
		if (!$customerProfileStore?.isLoggedIn && false) {
			localStorage.setItem('pdpTransactionButtonText', buttonText);
			localStorage.setItem('transactionType', 'buy');

			$whatsappLogin = true;
			$showAuthenticationModal = true;
			return;
		}

		const storedCustomerData = localStorage.getItem('customer')
			? JSON.parse(localStorage.getItem('customer') ?? '{}')
			: undefined;

		if (isChatFormEnabled) {
			if ($customerProfileStore?.isLoggedIn) {
				const customerData = {
					firstName: $customerProfileStore.firstName,
					lastName: $customerProfileStore.lastName,
					email: $customerProfileStore.email,
					phone: phoneNumberTrimmer($customerProfileStore?.phone ?? '')
				};

				const existingCustomerData = localStorage.getItem('customer')
					? JSON.parse(localStorage.getItem('customer'))
					: {};

				const updatedCustomerData = {
					...existingCustomerData,
					...customerData
				};

				localStorage.setItem('customer', JSON.stringify(updatedCustomerData));

				buySellWhatsappRedirect({
					type: 'buy',
					storeLocation: storeLocation,
					productTitle: title,
					collection: breadcrumbs[0].label,
					brand: breadcrumbs[1].label,
					subBrand: breadcrumbs.length === 3 ? breadcrumbs[2]?.label : '',
					customer: $customerProfileStore,
					utmCampaign: $page.url.searchParams.get('utm_campaign') || '',
					utmMedium: $page.url.searchParams.get('utm_medium') || '',
					utmSource: $page.url.searchParams.get('utm_source') || '',
					utmTerm: $page.url.searchParams.get('utm_term') || '',
					utmContent: $page.url.searchParams.get('utm_content') || '',
					referrer: $page.url.searchParams.get('referrer') || '',
					leadSrc: $page.url.searchParams.get('lead_src') || 'Website',
					salesCode: $page.url.searchParams.get('sales_code') || '',
					productId: selectedProductData?.id || ''
				});
			} else if (!$customerProfileStore?.isLoggedIn && storedCustomerData) {
				buySellWhatsappRedirect({
					type: 'buy',
					storeLocation: storeLocation,
					productTitle: title,
					collection: breadcrumbs[0].label,
					brand: breadcrumbs[1].label,
					subBrand: breadcrumbs.length === 3 ? breadcrumbs[2]?.label : '',
					customer: $customerProfileStore,
					utmCampaign: $page.url.searchParams.get('utm_campaign') || '',
					utmMedium: $page.url.searchParams.get('utm_medium') || '',
					utmSource: $page.url.searchParams.get('utm_source') || '',
					utmTerm: $page.url.searchParams.get('utm_term') || '',
					utmContent: $page.url.searchParams.get('utm_content') || '',
					referrer: $page.url.searchParams.get('referrer') || '',
					leadSrc: $page.url.searchParams.get('lead_src') || 'Website',
					salesCode: $page.url.searchParams.get('sales_code') || '',
					productId: selectedProductData?.id || ''
				});
			} else {
				showContactUsModal = true;
			}
		} else {
			buySellWhatsappRedirect({
				type: 'buy',
				storeLocation: storeLocation,
				productTitle: title,
				collection: breadcrumbs[0].label,
				brand: breadcrumbs[1].label,
				subBrand: breadcrumbs.length === 3 ? breadcrumbs[2]?.label : '',
				customer: $customerProfileStore,
				utmCampaign: $page.url.searchParams.get('utm_campaign') || '',
				utmMedium: $page.url.searchParams.get('utm_medium') || '',
				utmSource: $page.url.searchParams.get('utm_source') || '',
				utmTerm: $page.url.searchParams.get('utm_term') || '',
				utmContent: $page.url.searchParams.get('utm_content') || '',
				referrer: $page.url.searchParams.get('referrer') || '',
				leadSrc: $page.url.searchParams.get('lead_src') || 'Website',
				salesCode: $page.url.searchParams.get('sales_code') || '',
				productId: selectedProductData?.id || ''
			});
		}
	};

	let showModal = false;
	let modalData = {
		productTitle: '',
		collection: '',
		brand: ''
	};
	const openModal = () => {
		showModal = true;
	};

	const closeModal = () => {
		showModal = false;
	};

	const onClickSell = (buttonText: string) => {
		googleAnalClickedEvent(eventNameSellWithUs, {
			locale: $page.params.lang,
			utm_campaign: $page.url.searchParams.get('utm_campaign') ?? '',
			utm_medium: $page.url.searchParams.get('utm_medium') ?? '',
			utm_source: $page.url.searchParams.get('utm_source') ?? '',
			utm_term: $page.url.searchParams.get('utm_term') ?? '',
			utm_content: $page.url.searchParams.get('utm_content') ?? '',
			product: {
				name: title,
				label: breadcrumbs[1].label,
				category: breadcrumbs[0].label
			}
		});
		if (!$customerProfileStore?.isLoggedIn && false) {
			localStorage.setItem('pdpTransactionButtonText', buttonText);
			localStorage.setItem('transactionType', 'sell');

			$whatsappLogin = true;
			$showAuthenticationModal = true;
			return;
		}
		openModal();
		modalData = {
			productTitle: title,
			collection: breadcrumbs[0]?.label,
			brand: breadcrumbs[1]?.label
		};
	};

	const sellText = () => {
		if (productType === 'Handbags') {
			return 'BAGS';
		}
		return 'WATCH';
	};

	onMount(() => {
		const isWhatsappLogin = localStorage.getItem('whatsappLogin');

		if (isWhatsappLogin) {
			if (localStorage.getItem('transactionType') === 'sell') {
				setTimeout(() => {
					onClickSell(localStorage.getItem('pdpTransactionButtonText') ?? '');
				}, 0);
			} else if (localStorage.getItem('transactionType') === 'buy') {
				setTimeout(() => {
					onClickBuy(localStorage.getItem('pdpTransactionButtonText') ?? '');
				}, 0);
			}
			localStorage.removeItem('whatsappLogin');
		}

		localStorage.removeItem('pdpTransactionButtonText');
		localStorage.removeItem('transactionType');
	});

	$: selectedProductDetailData = $selectedProductStore;

	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;
	const country = $page.params.store || STORE.id;

	const getOrderHistoryNumber = (): string | null => {
		const orderNumber = sessionStorage.getItem('orderHistoryNumber');
		return orderNumber;
	};

	const getProductData = () => {
		const productId = selectedProductDetailData?.id;
		const productTitle = selectedProductDetailData?.title;
		const productVendor = selectedProductDetailData?.vendor;
		const collection = breadcrumbs[0]?.label || '';
		const brand = breadcrumbs[1]?.label || '';
		const subbrand = breadcrumbs.length === 3 ? breadcrumbs[2]?.label : '';

		return { productId, productTitle, productVendor, collection, brand, subbrand };
	};

	const handleSignIn = () => {
		$showAuthenticationModal = true;
	};

	const onSubmit = async (e?: CustomEvent | undefined) => {
		const {
			firstName: filledFirstName = customer?.firstName ?? '',
			lastName: filledLastName = customer?.lastName ?? '',
			phoneNumber: filledPhoneNumber = customer?.phone ?? '',
			email: filledEmail = customer?.email ?? '',
			productCategory: filledProductCategory = '',
			brand: filledBrand = '',
			productName: filledProductName = ''
		} = e?.detail ?? {};

		const orderID = getOrderHistoryNumber();

		if (!customer?.firstName && false) {
			$whatsappLogin = true;
			handleSignIn();
			return;
		} else {
			const utmCampaign = $page.url.searchParams.get('utm_campaign') ?? '';
			const utmMedium = $page.url.searchParams.get('utm_medium') ?? '';
			const utmSource = $page.url.searchParams.get('utm_source') ?? '';
			const utmTerm = $page.url.searchParams.get('utm_term') ?? '';
			const utmContent = $page.url.searchParams.get('utm_content') ?? '';
			const referrer = $page.url.searchParams.get('referrer') ?? '';
			const leadSrc = $page.url.searchParams.get('lead_src') ?? 'Website';
			const salesCode = $page.url.searchParams.get('sales_code') ?? '';

			const { productId, productTitle, productVendor, collection, brand, subbrand } =
				getProductData();

			if (
				(($page.url.pathname.includes('/product') && selectedProductDetailData?.type) ||
					breadcrumbs.length > 0 ||
					location.pathname == `/${$page.params.store}/${$page.params.lang}` ||
					$page.params.handle) &&
				isChatFormEnabled
			) {
				const message = WA_MESSAGE.PDP.replace(/{collection}/g, filledProductCategory || collection)
					.replace(/{ProductVendor}/g, filledBrand || productVendor)
					.replace(/{ProductTitle}/g, filledProductName || productTitle || '');

				pdpWhatsappRedirect({
					country,
					message,
					brand: filledBrand || brand,
					subbrand,
					utmCampaign,
					utmMedium,
					utmSource,
					utmTerm,
					utmContent,
					referrer,
					leadSrc,
					firstname: filledFirstName || customer?.firstName || '',
					lastname: filledLastName || customer?.lastName || '',
					email: filledEmail || customer?.email || '',
					phoneNumber: filledPhoneNumber || customer?.phone || '',
					productId,
					customerId: customer?.id || '',
					salesCode,
					productCategory: filledProductCategory || collection,
					productName: filledProductName || productTitle
				});
			} else if ($page.url.pathname.includes('/sell-with-us')) {
				showContactUsModal = true;
			} else {
				redirectToWhatsapp({
					customer,
					firstName: filledFirstName,
					lastName: filledLastName,
					phoneNumber: filledPhoneNumber,
					email: filledEmail,
					country,
					baseParams,
					pathname: $page.url.pathname,
					collection: filledProductCategory,
					orderID: orderID ?? '',
					brand: filledBrand,
					subbrand: subbrand,
					productId: '',
					utmCampaign,
					utmMedium,
					utmSource,
					utmTerm,
					utmContent,
					referrer,
					leadSrc,
					salesCode,
					productName: filledProductName
				});
			}
			showContactUsModal = false;
		}
	};
</script>
<!-- abtest -->
<BottomNav
	position="sticky"
	classInner="grid-cols-2 bg-white h-full max-w-none"
	classOuter="w-full z-20 border-gray-200 bg-white-1 block min-h-[64px]"
>
	<BottomNavItem btnClass="p-2 pr-0">
		<Button
			variant={isAbTestVariantb ? 'secondary-abtest' : 'secondary'}
			class="w-full h-full"
			onClick={() => onClickSell(`SELL YOUR ${sellText()}`)}
		>
			<WhatsappLineLogos class="mr-2" size="20" />
			<Text
				type="body-1"
				color={isAbTestVariantb ? 'green-whatsapp' : 'dark-brown-10'}
				weight="semibold"
				class="text-left"
			>
				SELL YOUR {sellText()}
			</Text>
		</Button>
	</BottomNavItem>

	<BottomNavItem btnClass="p-2">
		<Button
			variant={isAbTestVariantb ? 'primary-abtest' : 'primary'}
			class="w-full h-full"
			onClick={() =>
				onClickBuy(
					selectedProductData?.preOrder || selectedProductData?.outOfStock
						? 'PRE-ORDER NOW'
						: 'ASK AND SHOP'
				)}
		>
			<WhatsappFillLogos class="mr-2" size="20" />
			{#if selectedProductData?.preOrder}
				<Text type="body-1" color="white-1" weight="semibold" class="text-left">PRE-ORDER NOW</Text>
			{:else if selectedProductData?.outOfStock}
				<Text type="body-1" color="white-1" weight="semibold" class="text-left">PRE-ORDER NOW</Text>
			{:else}
				<Text type="body-1" color="white-1" weight="semibold" class="text-left">ASK AND SHOP</Text>
			{/if}
		</Button>
	</BottomNavItem>
</BottomNav>
{#if showModal}
	<SWUModal
		bind:isModalOpen={showModal}
		on:closeModal={closeModal}
		productTitle={modalData.productTitle}
		collection={modalData.collection}
		brand={modalData.brand}
		activeTab=""
	/>
{/if}

{#if showContactUsModal}
	<ContactUsModal
		isOpen={showContactUsModal}
		on:close-modal={() => {
			showContactUsModal = !showContactUsModal;
		}}
		on:submit={onSubmit}
	/>
{/if}
