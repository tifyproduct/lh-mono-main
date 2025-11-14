<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { Gallery } from 'flowbite-svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Divider from '$lib/components/Divider/Divider.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import ImageCarousel from '$lib/components/ImageCarousel/ImageCarousel.svelte';
	import ProductBadge from '$lib/components/ProductBadge/ProductBadge.svelte';
	import Timer from '$lib/components/Timer/Timer.svelte';
	import WhyBuyFromUs from '../WhyBuyFromUs/WhyBuyFromUs.svelte';
	import SpecificationsAndDescriptions from '../SpecificationsAndDescriptions/SpecificationsAndDescriptions.svelte';
	import StoreAvailability from '../StoreAvailability/StoreAvailability.svelte';
	import { currencyFormat } from '$lib/utils/formatter';
	import { buySellWhatsappRedirect } from '$lib/utils/whatsappRedirect';
	import type { ProductData } from '$lib/types/product';
	import selectedProductStore from '$lib/stores/selectedProductStore';
	import WishlistButton from '$lib/components/WishlistButton/WishlistButton.svelte';
	import { breadcrumbStore } from '$lib/components/Breadcrumb/Breadcrumb';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';
	import { page } from '$app/stores';
	import SWUModal from '$lib/components/SWUModal/SWUModal.svelte';
	import { whatsappLogin, showAuthenticationModal } from '$lib/stores/authentication';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	import ContactUsModal from '$lib/components/ContactUsModal/ContactUsModal.svelte';
	import { get } from 'svelte/store';
	import { STORE, WA_MESSAGE } from '$lib/constants.util';
	import type { CustomerProfile } from '$lib/types/customer';
	import { redirectToWhatsapp, pdpWhatsappRedirect } from '$lib/utils/whatsappRedirect';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';
	import { WhatsappFillLogos, WhatsappLineLogos } from 'svelte-remix';
	import watermarkLogo from '$lib/assets/static/watermark-logo.png';
	import { phoneNumberTrimmer } from '$lib/utils/phoneNumber';
	import MagnifyModal from '$lib/components/MagnifyModal/MagnifyModal.svelte';

	export let productId: string;
	export let productType: string;
	export let productDetailData: Array<ProductData>;
	export let storeLocation: string;
	export let wishlisted: boolean;
	export let url: string;
	export let lang: string;
	export let customer: CustomerProfile | undefined;

	let selectedProductDetailDataIndex = 0;
	type Breadcrumb = {
		label: string;
		href?: string;
	};
	let breadcrumbs: Breadcrumb[];
	$: selectedProductDetailData = productDetailData[selectedProductDetailDataIndex];
	$: breadcrumbs = $breadcrumbStore;

	$: if (selectedProductDetailData) {
		selectedProductStore.set(selectedProductDetailData);
	}

	let isMagnifyEnabled = false;
	$: {
		isMagnifyEnabled = $featureFlagStore.isMagnifyEnabled;
	}

	// Images Data
	$: imagesData = productDetailData[0].thumbnails || [];
	$: focusedImage = imagesData?.find((image) => image.id === selectedProductDetailData.image.id);

	$: variantsData = productDetailData.map((item) => {
		return {
			src: item.image.src,
			alt: item.image.alt
		};
	});

	let eventNameAskViaWA = 'click_button_ask_via_WA';
	let eventNameSellWithUs = 'click_button_sell_with_us';
	let isAbTestVariantb = $page.data.ABVariants === 'variant_b';

	if ($page.data.ABVariants === 'variant_a'){
		eventNameAskViaWA = 'click_button_ask_via_WA_varA';
		eventNameSellWithUs = 'click_button_sell_with_us_varA';
	}else if($page.data.ABVariants === 'variant_a'){
		eventNameAskViaWA = 'click_button_ask_via_WA_varB_green';
		eventNameSellWithUs = 'click_button_sell_with_us_varB_green';
	}

	const onClickVariant = (selectedIndex: number) => {
		selectedProductDetailDataIndex = selectedIndex;
	};

	let showContactUsModal = false;
	let showMagnifyModal = false;
	let selectedImageCarouselIndex = 0;

	let isChatFormEnabled: boolean;
	$: {
		isChatFormEnabled = $featureFlagStore.isChatFormEnabled;
	}

	const onClickBuy = (buttonText: string) => {
		if (!$customerProfileStore?.isLoggedIn && false) {
			localStorage.setItem('pdpTransactionButtonText', buttonText);
			localStorage.setItem('transactionType', 'buy');

			$whatsappLogin = true;
			$showAuthenticationModal = true;
			return;
		}

		googleAnalClickedEvent(eventNameAskViaWA, {
			locale: lang,
			utm_campaign: $page.url.searchParams.get('utm_campaign') ?? '',
			utm_medium: $page.url.searchParams.get('utm_medium') ?? '',
			utm_source: $page.url.searchParams.get('utm_source') ?? '',
			utm_term: $page.url.searchParams.get('utm_term') ?? '',
			utm_content: $page.url.searchParams.get('utm_content') ?? '',
			product: {
				name: selectedProductDetailData.title,
				label: selectedProductDetailData.tags[0],
				category: selectedProductDetailData.type
			},
			customer: {
				email: $customerProfileStore?.email
			}
		});

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
					productTitle: selectedProductDetailData.title,
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
					productId: selectedProductDetailData.id
				});
			} else {
				showContactUsModal = true;
			}
		} else {
			buySellWhatsappRedirect({
				type: 'buy',
				storeLocation: storeLocation,
				productTitle: selectedProductDetailData.title,
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
				productId: selectedProductDetailData.id
			});
		}
	};

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
		if (!$customerProfileStore?.isLoggedIn && false) {
			localStorage.setItem('pdpTransactionButtonText', buttonText);
			localStorage.setItem('transactionType', 'sell');

			$whatsappLogin = true;
			$showAuthenticationModal = true;
			return;
		}

		googleAnalClickedEvent(eventNameSellWithUs, {
			locale: lang,
			utm_campaign: $page.url.searchParams.get('utm_campaign') ?? '',
			utm_medium: $page.url.searchParams.get('utm_medium') ?? '',
			utm_source: $page.url.searchParams.get('utm_source') ?? '',
			utm_term: $page.url.searchParams.get('utm_term') ?? '',
			utm_content: $page.url.searchParams.get('utm_content') ?? '',
			product: {
				name: selectedProductDetailData.title,
				label: selectedProductDetailData.tags[0],
				category: selectedProductDetailData.type
			}
		});

		openModal();
		modalData = {
			productTitle: selectedProductDetailData?.title,
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

	let isShowCountdown = false;
	let saleExpirationDate: Date | null = null;

	$: {
		if (selectedProductDetailData && selectedProductDetailData.saleExpiredAt) {
			saleExpirationDate = new Date(selectedProductDetailData.saleExpiredAt);
			isShowCountdown = saleExpirationDate.getTime() > Date.now();
		} else {
			isShowCountdown = false;
		}
	}

	const onClickImage = (selectedImageId: string) => {
		focusedImage = imagesData?.find((image) => {
			return image.id === selectedImageId;
		});
	};

	const toogleMagnify = () => {
		if (!isMagnifyEnabled) {
			return;
		}

		showMagnifyModal = !showMagnifyModal;

		if (showMagnifyModal) {
			window.scrollTo({ top: 0 });
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	};

	const onImageCarouselClicked = (e: CustomEvent) => {
		selectedImageCarouselIndex = e.detail ?? 0;
		toogleMagnify();
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

	onDestroy(() => {
		$selectedProductStore = undefined;
	});
	const baseUrl = 'https://luxehouze.com';
	$: canonicalUrl = `${baseUrl}${$page.url.pathname}`;
	$: hreflangUrl = `${baseUrl}${$page.url.pathname}`;
</script>

<svelte:head>
	<link rel="canonical" href={canonicalUrl} />
	<link rel="alternate" hreflang="x-default" href={hreflangUrl} />
	<link rel="alternate" hreflang="en-ID" href={hreflangUrl} />
	<link rel="alternate" hreflang="id-ID" href={hreflangUrl} />
	<link rel="alternate" hreflang="en-SG" href={hreflangUrl} />
</svelte:head>

<div>
	<div>
		<div class="flex flex-col xl:flex-row gap-[20px] relative">
			<!-- Desktop -->
			<div class="hidden xl:flex flex-1 items-start gap-6 sticky top-[150px] max-h-[530px]">
				<div>
					<div class="flex flex-col gap-4 max-h-[530px] overflow-auto">
						{#each imagesData as item}
							<span class="relative">
								<img
									src={watermarkLogo}
									class="absolute w-[8px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
									alt="watermark"
								/>
								<img
									src={item.src}
									alt={item.alt}
									class={`
										w-[90px] h-[90px]
										object-contain
										bg-white-2
										rounded
										cursor-pointer
										z-0
									`}
									role="presentation"
									loading="eager"
									on:click={() => {
										if (item.id) {
											onClickImage(item.id);
										}
									}}
								/>
							</span>
						{/each}
					</div>
				</div>

				<Gallery>
					<div class="relative">
						<div on:click={toogleMagnify} role="presentation">
							<div class="pointer-events-none">
								<img
									src={focusedImage?.src}
									alt={focusedImage?.alt}
									loading="eager"
									class="w-[550px] h-[520px] object-contain rounded"
								/>
								<img
									src={watermarkLogo}
									class="absolute w-[25px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0"
									alt="watermark"
								/>
							</div>
						</div>
						<div class="absolute top-0">
							<ProductBadge
								discount={selectedProductDetailData.discount}
								preOrder={selectedProductDetailData.preOrder}
								outOfStock={selectedProductDetailData.outOfStock}
								newArrival={selectedProductDetailData.newArrival}
							/>
						</div>

						<WishlistButton
							bind:isWishlisted={wishlisted}
							{productId}
							size={32}
							class="absolute right-[24px] top-[24px] z-10"
						/>
					</div>
				</Gallery>
			</div>

			<div class="flex xl:hidden">
				<ImageCarousel data={imagesData} {focusedImage} on:image-clicked={onImageCarouselClicked}>
					<div slot="imageOverlay">
						<img
							src={watermarkLogo}
							class="absolute w-[20px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
							alt="watermark"
						/>
						<div class="absolute top-0">
							<ProductBadge
								discount={selectedProductDetailData.discount}
								preOrder={selectedProductDetailData.preOrder}
								outOfStock={selectedProductDetailData.outOfStock}
								newArrival={selectedProductDetailData.newArrival}
							/>
						</div>
						<WishlistButton
							isWishlisted={wishlisted}
							{productId}
							size={24}
							class="absolute right-[20px] top-[20px] z-10"
						/>
					</div>
				</ImageCarousel>
			</div>

			<div class="flex-1">
				<div>
					{#if isShowCountdown}
						<div class="mb-4">
							<Timer dueDate={saleExpirationDate} size="small" includeDays />
						</div>
					{/if}

					<Text variant="h1" type="title-3" color="black-10" weight="semibold">
						{selectedProductDetailData.vendor}
					</Text>

					<div class="mt-1 lg:mt-4">
						<Text variant="h2" type="subtitle-2" color="black-7">
							{selectedProductDetailData.title}
						</Text>
					</div>
					<div class="mt-1 lg:mt-4 flex gap-6">
						{#if selectedProductDetailData.condition}
							<Text type="body-1" color="black-5">{selectedProductDetailData.condition}</Text>
						{/if}

						{#if selectedProductDetailData.completeness}
							<Text type="body-1" color="black-5">|</Text>
							<Text type="body-1" color="black-5">{selectedProductDetailData.completeness}</Text>
						{/if}

						{#if selectedProductDetailData.year}
							<Text type="body-1" color="black-5">|</Text>
							<Text type="body-1" color="black-5">{selectedProductDetailData.year}</Text>
						{/if}
					</div>
				</div>

				<div class="mt-3 lg:mt-[20px]">
					{#if !selectedProductDetailData.showPrice}
						<Text type="title-3" color="black-6" weight="semibold">Call for Price</Text>
					{:else if selectedProductDetailData.discount}
						<div>
							<div>
								<Text type="body-1" color="black-4" class="line-through">
									{currencyFormat(parseInt(selectedProductDetailData.normalPrice), storeLocation)}
								</Text>
							</div>
							<div class="mt-[9px] lg:mt-3">
								<Text type="title-3" color="red-5" weight="semibold">
									{currencyFormat(parseInt(selectedProductDetailData.salePrice), storeLocation)}
								</Text>
							</div>
						</div>
					{:else}
						<Text type="title-3" color="black-10" weight="semibold">
							{currencyFormat(parseInt(selectedProductDetailData.normalPrice), storeLocation)}
						</Text>
					{/if}
				</div>

				<div class="mx-[-15px] sm:mx-0">
					<Divider
						verticalMargin="my-7"
						borderHeight="border-t-8 sm:border-t"
						borderColor="border-white-2 sm:border-black-2"
					/>
				</div>

				{#if productDetailData.length > 1}
					<div>
						<Text type="body-1" color="black-10" weight="semibold">Variant:</Text>
						<Text type="body-1" color="black-10">{selectedProductDetailData.variant}</Text>

						<Gallery class="mt-3 flex gap-3 overflow-auto">
							{#each variantsData as item, index}
								<img
									src={item.src}
									alt={item.alt}
									role="presentation"
									loading="lazy"
									class={`
                                		w-[86px] h-[86px]
                                		object-contain
                                		bg-white-2
                                		rounded
                                		 ${index === selectedProductDetailDataIndex ? ' border border-brown-5' : ''}
										cursor-pointer
                            		`}
									on:click={() => onClickVariant(index)}
								/>
							{/each}
						</Gallery>
					</div>
				{/if}

				<div class="mt-3 mb-3 lg:mt-3 lg:mb-0">
					<WhyBuyFromUs />
				</div>

				<div class="hidden xl:flex mt-7 gap-6">
					{#if selectedProductDetailData.preOrder || selectedProductDetailData.outOfStock}
						<Button
							variant="primary"
							class="w-full h-[56px]"
							onClick={() => onClickBuy('PRE-ORDER NOW')}
						>
							<WhatsappLineLogos class="mr-1" />
							<Text type="subtitle-2" color="white-1" weight="semibold">PRE-ORDER NOW</Text>
						</Button>
					{:else}
						<Button
							variant={isAbTestVariantb ? "primary-abtest" : "primary"}
							class="w-full h-[56px]"
							onClick={() => onClickBuy('ASK AND SHOP')}
						>
							<WhatsappFillLogos class="mr-1" />
							<Text type="subtitle-2" color="white-1" weight="semibold">ASK AND SHOP</Text>
						</Button>
					{/if}
					<Button
						variant={isAbTestVariantb ? "secondary-abtest" : "secondary"}
						class="w-full h-[56px]"
						onClick={() => onClickSell(`SELL YOUR ${sellText()}`)}
					>
						<WhatsappLineLogos class="mr-1" />
						<Text type="subtitle-2" color={isAbTestVariantb? "green-whatsapp" : "black-10"} weight="semibold">
							SELL YOUR {sellText()}
						</Text>
					</Button>
				</div>

				<div class="flex flex-col">
					{#if selectedProductDetailData?.storeAvailability && selectedProductDetailData?.storeAvailability?.length > 0}
						<div class="mt-0 lg:mt-8 order-3 lg:order-1">
							<StoreAvailability
								storeAvailability={selectedProductDetailData.storeAvailability}
								{productId}
								{selectedProductDetailData}
							/>
						</div>
					{/if}

					<div class="order-2 mx-[-15px] sm:mx-0">
						<Divider
							verticalMargin="my-7"
							borderHeight="border-t-8 sm:border-t"
							borderColor="border-white-2 sm:border-black-2"
						/>
					</div>

					<div class="order-1 lg:order-3">
						<SpecificationsAndDescriptions productDetailData={selectedProductDetailData} />
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
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

{#if showMagnifyModal}
	<MagnifyModal
		images={productDetailData[0].thumbnails}
		on:close-modal={toogleMagnify}
		{selectedImageCarouselIndex}
	/>
{/if}
