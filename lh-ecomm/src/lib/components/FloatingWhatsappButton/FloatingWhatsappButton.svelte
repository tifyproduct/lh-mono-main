<script lang="ts">
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { WhatsappLineLogos } from 'svelte-remix';
	import Text from '$lib/components/Text/Text.svelte';
	import { STORE, WA_MESSAGE } from '$lib/constants.util';
	import {
		redirectToWhatsapp,
		pdpWhatsappRedirect,
		redirectToWhatsappSWU
	} from '$lib/utils/whatsappRedirect';
	import selectedProductStore from '$lib/stores/selectedProductStore';
	import type { CustomerProfile } from '$lib/types/customer';
	import { whatsappLogin, showAuthenticationModal } from '$lib/stores/authentication';
	import { breadcrumbStore } from '$lib/components/Breadcrumb/Breadcrumb';
	import { ActiveTabSWU } from '$lib/pages/SellWithUsPage/components/HowItWorks/ActiveTabStore';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';
	import SWUModal from '$lib/components/SWUModal/SWUModal.svelte';
	import ContactUsModal from '../ContactUsModal/ContactUsModal.svelte';
	import type { ProductData } from '$lib/types/product';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';

	const currentPage = get(page);
	let isChatFormEnabled: boolean;
	let isAbTestEnabled: boolean;

	export let customer: CustomerProfile | undefined;
	
	$: {
		isChatFormEnabled = $featureFlagStore.isChatFormEnabled;
		isAbTestEnabled = $featureFlagStore.isAbTestEnabled;
	}
	
	type Breadcrumb = {
		label: string;
		href?: string;
	};
	let breadcrumbs: Breadcrumb[] = [];
	let currentTabSWU: string;
	let selectedProductDetailData: ProductData | undefined;
	let currentPageLabel = 'Contact us';
	let buyLabel = 'Inquire or Buy';
	let sellLabel = 'Sell or Consign';
	let isPagePDP = $page.url.pathname.includes('/product')
	let currentAbTestValue = $page.data.ABVariants;
	let eventNameFloatingWhatsapp = 'floating_whatsapp_contact_us';

	if (currentAbTestValue === 'variant_a'){
		eventNameFloatingWhatsapp = 'floating_whatsapp_contact_us_green';
	}else if(currentAbTestValue === 'variant_b'){
		eventNameFloatingWhatsapp = 'floating_whatsapp_inquire';
	}

	$: breadcrumbs = $breadcrumbStore;
	$: currentTabSWU = $ActiveTabSWU;
	$: selectedProductDetailData = $selectedProductStore;

	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;
	const country = $page.params.store || STORE.id;

	const handleSignIn = () => {
		$showAuthenticationModal = true;
	};

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

	let showSWUModal = false;
	let showContactUsModal = false;

	const openSWUModal = () => {
		showSWUModal = true;
		if(currentAbTestValue === 'variant_b') {
			googleAnalClickedEvent('floating_whatsapp_sell', {
				customer: {
					email: customer?.email
				}
			});
		}
	};

	const closeSWUModal = () => {
		showSWUModal = false;
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

		googleAnalClickedEvent(eventNameFloatingWhatsapp, {
			customer: {
				email: customer?.email
			}
		});

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
			} else if ($page.url.pathname.includes('/sell-with-us') && currentTabSWU) {
				openSWUModal();
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

	const toogleContactUsModal = () => {
		if (
			(($page.url.pathname.includes('/product') && !customer?.isLoggedIn) ||
				breadcrumbs.length > 0 ||
				location.pathname == `/${$page.params.store}/${$page.params.lang}` ||
				$page.params.handle) &&
			isChatFormEnabled
		) {
			showContactUsModal = !showContactUsModal;
			return;
		}

		onSubmit();
	};

	const redirect = () => {
		localStorage.removeItem('whatsappLogin');

		const utmCampaign = $page.url.searchParams.get('utm_campaign') || '';
		const utmMedium = $page.url.searchParams.get('utm_medium') || '';
		const utmSource = $page.url.searchParams.get('utm_source') || '';
		const utmTerm = $page.url.searchParams.get('utm_term') || '';
		const utmContent = $page.url.searchParams.get('utm_content') || '';
		const referrer = $page.url.searchParams.get('referrer') || '';
		const leadSrc = $page.url.searchParams.get('lead_src') || 'Website';
		const salesCode = $page.url.searchParams.get('sales_code') || '';

		if ($page.url.pathname.includes('/product') && selectedProductDetailData?.type) {
			const { productId, productTitle, productVendor, collection, brand, subbrand } =
				getProductData();

			const message = WA_MESSAGE.PDP.replace(/{collection}/g, collection)
				.replace(/{ProductVendor}/g, productVendor || '')
				.replace(/{ProductTitle}/g, productTitle || '');

			pdpWhatsappRedirect({
				country,
				message,
				brand,
				subbrand,
				utmCampaign,
				utmMedium,
				utmSource,
				utmTerm,
				utmContent,
				referrer,
				leadSrc,
				firstname: customer?.firstName ?? '',
				lastname: customer?.lastName ?? '',
				email: customer?.email ?? '',
				productId,
				customerId: customer?.id ?? '',
				phoneNumber: customer?.phone ?? '',
				productName: productTitle,
				productCategory: collection
			});
		} else if ($page.url.pathname.includes('/sell-with-us') && currentTabSWU) {
			redirectToWhatsappSWU({
				country,
				type: currentTabSWU,
				customer,
				utmCampaign,
				utmMedium,
				utmSource,
				utmTerm,
				utmContent,
				referrer,
				leadSrc
			});
		} else {
			const { collection, brand, subbrand } = getProductData();
			redirectToWhatsapp({
				customer,
				country,
				firstName: customer?.firstName ?? '',
				lastName: customer?.lastName ?? '',
				phoneNumber: customer?.phone ?? '',
				email: customer?.email ?? '',
				baseParams,
				pathname: $page.url.pathname,
				collection,
				brand,
				subbrand,
				productId: '',
				utmCampaign,
				utmMedium,
				utmSource,
				utmTerm,
				utmContent,
				referrer,
				leadSrc,
				salesCode,
				productName: ''
			});
		}
	};

	onMount(() => {
		const isWhatsappLogin = localStorage.getItem('whatsappLogin');
		if (isWhatsappLogin) {
			redirect();
		}

		// for url
		if ($page.url.searchParams.get('page') === 'order-history') {
			if (!$page.url.pathname.includes('/profile')) {
				const url = new URL(window.location.href);
				url.searchParams.delete('page');
				window.history.replaceState({}, '', url);
			}
		}
	});
</script>

<!-- abtest -->

{#if currentAbTestValue === 'control'}
	<div
		class="fixed !z-10 bottom-20 xl:bottom-10 right-5 xl:right-10 flex items-center space-x-2 p-3 bg-black-10 text-white rounded-full lg:rounded cursor-pointer"
		role="presentation"
		on:click={toogleContactUsModal}
	>
		<div class="flex gap-2">
			<WhatsappLineLogos size="24" class="text-white-1" />
			<Text type="body-1" color="white-1" weight="semibold" class="hidden lg:block">
				{currentPageLabel}
			</Text>
		</div>
	</div>
{/if}

{#if currentAbTestValue === 'variant_a'}
	<div
		class="fixed !z-10 bottom-20 xl:bottom-10 right-5 xl:right-10 flex items-center space-x-2 p-3 bg-green-whatsapp text-white rounded-full lg:rounded cursor-pointer"
		role="presentation"
		on:click={toogleContactUsModal}
	>
		<div class="flex gap-2">
			<WhatsappLineLogos size="24" class="text-white-1" />
			<Text type="body-1" color="white-1" weight="semibold" class="hidden lg:block">
				{currentPageLabel}
			</Text>
		</div>
	</div>
{/if}

{#if currentAbTestValue === 'variant_b'}
		<div
			class={`${isPagePDP? "hidden" : "fixed"} w-[160px] md:w-[180px] !z-10 bottom-20 md:bottom-20 lg:bottom-10 left-[51%] md:left-auto md:right-5 items-center space-x-2 p-3 bg-green-whatsapp text-white rounded cursor-pointer`}
			role="presentation"
			on:click={openSWUModal}
		>
			<div class="flex gap-2">
				<WhatsappLineLogos size="24" class="text-white-1" />
				<Text type="body-1" color="white-1" weight="semibold" class="block">
					{sellLabel}
				</Text>
			</div>
		</div>

		<div
			class={`${isPagePDP? "hidden" : "fixed"} w-[160px] md:w-[180px] !z-10 bottom-20 md:bottom-[140px] lg:bottom-[100px] right-[51%] md:right-5 items-center space-x-2 p-3 bg-green-whatsapp text-white rounded cursor-pointer`}
			role="presentation"
			on:click={toogleContactUsModal}
		>
			<div class="flex gap-2">
				<WhatsappLineLogos size="24" class="text-white-1" />
				<Text type="body-1" color="white-1" weight="semibold" class="block">
					{buyLabel}
				</Text>
			</div>
		</div>
{/if}
{#if showSWUModal}
	<SWUModal bind:isModalOpen={showSWUModal} on:closeSWUModal={closeSWUModal} />
{/if}

{#if showContactUsModal && isChatFormEnabled}
	<ContactUsModal
		isOpen={showContactUsModal}
		on:close-modal={() => {
			showContactUsModal = !showContactUsModal;
		}}
		on:submit={onSubmit}
	/>
{/if}
