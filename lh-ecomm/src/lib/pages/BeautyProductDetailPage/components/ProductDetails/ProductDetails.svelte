<script lang="ts">
	import { Gallery, Toast } from 'flowbite-svelte';
	import { ShoppingCart2LineFinance, Loader3LineSystem, QuestionFillSystem } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import Divider from '$lib/components/Divider/Divider.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import ImageCarousel from '$lib/components/ImageCarousel/ImageCarousel.svelte';
	import ProductBadge from '$lib/components/ProductBadge/ProductBadge.svelte';
	import Timer from '$lib/components/Timer/Timer.svelte';
	import watermarkLogo from '$lib/assets/static/watermark-logo.png';

	import { goto } from '$app/navigation';

	import WhyBuyFromUs from '../WhyBuyFromUs/WhyBuyFromUs.svelte';

	import { currencyFormat } from '$lib/utils/formatter';

	import ShippingFrom from '../ShippingFrom/ShippingFrom.svelte';
	import AvailablePromotions from '../AvailablePromotions/AvailablePromotions.svelte';
	import type { ProductData } from '$lib/types/product';

	import selectedProductStore from '$lib/stores/selectedProductStore';
	import NotifyWhenInStockModal from '$lib/pages/BeautyProductDetailPage/components/NotifyWhenInStockModal/NotifyWhenInStockModal.svelte';
	import { navigating, page } from '$app/stores';
	import { isTriggerShowCartAdded } from '$lib/stores/cart';

	import isShowNotifyWhenInStockModal, {
		openNotifyWhenInStockModal,
		closeNotifyWhenInStockModal
	} from '../../store/isShowNotifyWhenInStockModalStore';
	import type { CustomerProfile } from '$lib/types/customer';

	import { showAuthenticationModal, showErrorToast } from '$lib/stores/authentication';
	import type { Promotion } from '$lib/types/promotions';
	import WishlistButton from '$lib/components/WishlistButton/WishlistButton.svelte';
	import { breadcrumbStore } from '$lib/components/Breadcrumb/Breadcrumb';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';
	import { toast } from 'svelte-sonner';
	import { onDestroy } from 'svelte';
	import AuthenticationTab from '$lib/components/AuthenticationModal/AuthenticationTab.svelte';
	import AuthenticationModal from '$lib/components/AuthenticationModal/AuthenticationModal.svelte';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';
	import MagnifyModal from '$lib/components/MagnifyModal/MagnifyModal.svelte';
	import { writable } from 'svelte/store';
	import { error } from '@sveltejs/kit';

	export let productId: string;
	export let productDetailData: Array<ProductData>;
	export let storeLocation: string;
	export let customer: CustomerProfile;
	export let promotions: Promotion[];
	export let wishlisted: boolean;
	export let lang: string;
	export let credentialSoc;

	let isNewLoginEnabled: boolean;
	$: {
		isNewLoginEnabled = $featureFlagStore.isNewLoginEnabled;
	}

	let showModal = false;
	let showSocialModal = false;
	let showMagnifyModal = false;
	let selectedImageCarouselIndex = 0;

	const closeModal = () => {
		showModal = false;
	};

	type Breadcrumb = {
		label: string;
		href?: string;
	};
	let breadcrumbs: Breadcrumb[];
	$: breadcrumbs = $breadcrumbStore;

	let isMagnifyEnabled = false;
	$: {
		isMagnifyEnabled = $featureFlagStore.isMagnifyEnabled;
	}

	let selectedProductDetailDataIndex = productDetailData.findIndex(
		(product) => !product.outOfStock
	);

	let isLoading: boolean = false;

	$: selectedProductDetailDataIndex =
		selectedProductDetailDataIndex === -1 ? 0 : selectedProductDetailDataIndex;

	$: selectedProductDetailData =
		productDetailData[selectedProductDetailDataIndex] || productDetailData[0];

	$: if (selectedProductDetailData) {
		selectedProductStore.set(selectedProductDetailData);
	}

	// Images Data
	$: imagesData = productDetailData[0].thumbnails || [];
	$: focusedImage = imagesData?.find((image) => image.id === selectedProductDetailData.image.id);

	$: variantsData = productDetailData.map((item) => {
		return {
			src: item.image.src,
			alt: item.image.alt,
			isOutOfStock: item.outOfStock
		};
	});

	const onClickVariant = (selectedIndex: number) => {
		selectedProductDetailDataIndex = selectedIndex;
	};

	const onClickBuy = async () => {
		if (selectedProductDetailData.type?.toLocaleLowerCase() === 'beauty'.toLocaleLowerCase()) {
			if (!customer?.isLoggedIn) {
				if (isNewLoginEnabled) {
					showModal = true;
				} else {
					showSocialModal = true;
				}

				return;
			}

			if (isLoading) return;

			try {
				isLoading = true;

				const selectedVariant = productDetailData[selectedProductDetailDataIndex];

				const request = await fetch('/api/cart', {
					method: 'POST',
					body: JSON.stringify({
						variantId: selectedVariant.id,
						quantity: 1
					})
				});

				const cartData = await request.json();

				if (cartData.id) {
					googleAnalClickedEvent('add_to_cart', {
						locale: lang,
						product: {
							name: selectedProductDetailData.title,
							id: productId,
							variantId: selectedProductDetailData.id,
							category: selectedProductDetailData.type
						}
					});

					await goto(`/${$page.params.store}/${$page.params.lang}/cart`, {
						invalidateAll: true
					});
				}
			} catch (error) {
				toast.error(error + '');
			} finally {
				isLoading = false;
			}
		}
	};

	const onClickAtc = async () => {
		if (selectedProductDetailData.type?.toLocaleLowerCase() === 'beauty'.toLocaleLowerCase()) {
			if (!customer?.isLoggedIn) {
				if (isNewLoginEnabled) {
					showModal = true;
				} else {
					// $showAuthenticationModal = true;
					showSocialModal = true;
				}
				return;
			}

			if (isLoading) return;

			try {
				isLoading = true;

				$isTriggerShowCartAdded = true;

				const selectedVariant = productDetailData[selectedProductDetailDataIndex];

				const request = await fetch('/api/cart', {
					method: 'POST',
					body: JSON.stringify({
						variantId: selectedVariant.id,
						quantity: 1
					})
				});

				const cartData = await request.json();

				if (cartData.id) {
					googleAnalClickedEvent('add_to_cart', {
						locale: lang,
						product: {
							name: selectedProductDetailData.title,
							id: productId,
							variantId: selectedProductDetailData.id,
							category: selectedProductDetailData.type
						}
					});

					await goto('', {
						invalidateAll: true
					});
				}
			} catch (error) {
				toast.error(error + '');
			} finally {
				isLoading = false;
			}
		}
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

	onDestroy(() => {
		$selectedProductStore = undefined;
	});

	const closeAuthentication = () => {
		// $showAuthenticationModal = false;
		showSocialModal = false;
	};

	const closeAuthenticationSuccess = () => {
		// $showAuthenticationModal = false;
		showSocialModal = false;
		window.location.reload();
	};

	let authenticationErrorMessage: string | null = null;
	let errorToast = false;

	const handleAuthenticationError = (event: CustomEvent) => {
		authenticationErrorMessage = event.detail.message;
		errorToast = true;
	};

	$: if ($showErrorToast) {
		errorToast = true;
	}
</script>

<div>
	<div>
		<div class="flex flex-col xl:flex-row gap-[20px] relative">
			<!-- Desktop -->
			<div class="hidden xl:flex flex-1 items-start gap-6 sticky top-[150px] max-h-[530px]">
				<div>
					<div class="flex flex-col gap-4 max-h-[530px] overflow-auto">
						{#each imagesData as item, index}
							<span class="relative">
								<img
									src={watermarkLogo}
									class="absolute w-[10px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
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
									class="absolute w-[25px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
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
								isBeauty
							/>
						</div>

						<WishlistButton
							isWishlisted={wishlisted}
							{productId}
							size={32}
							class="absolute right-[24px] top-[24px]"
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
								isBeauty
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

					<Text type="title-3" color="black-10" weight="semibold">
						{selectedProductDetailData.vendor}
					</Text>
					<div class="mt-1 lg:mt-4">
						<Text type="subtitle-2" color="black-6">
							{selectedProductDetailData.title}
						</Text>
					</div>

					{#if selectedProductDetailData.expiredAt}
						<div class="mt-1 lg:mt-4">
							<Text type="subtitle-2" color="black-6">
								Expiry Date: {selectedProductDetailData.expiredAt}
							</Text>
						</div>
					{/if}
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

				<div class="block xl:hidden mx-[-15px] sm:mx-0">
					<Divider
						verticalMargin="my-7"
						borderHeight="border-t-8 sm:border-t"
						borderColor="border-white-2 sm:border-black-2"
					/>
				</div>

				{#if productDetailData.length > 1}
					<div class="mt-5 overflow-y-scroll">
						<Text type="body-1" color="black-10" weight="semibold">Variant:</Text>
						<Text type="body-1" color="black-10">{selectedProductDetailData.variant}</Text>

						<Gallery class="mt-3 flex gap-3 overflow-auto">
							{#each variantsData as item, index}
								<span class="relative">
									<img
										src={watermarkLogo}
										class="absolute w-[10px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
										alt="watermark"
									/>
									<img
										src={item.src}
										alt={item.alt}
										role="presentation"
										class={`
                                		w-[86px] h-[86px]
                                		object-contain
                                		bg-white-2
                                		rounded
                                		 ${index === selectedProductDetailDataIndex ? ' border border-brown-5' : ''}
										cursor-pointerz
										z-0
                            		`}
										loading="lazy"
										class:opacity-[0.5]={item.isOutOfStock}
										on:click={() => onClickVariant(index)}
									/>
								</span>
							{/each}
						</Gallery>
					</div>
				{/if}

				<div class="mt-3 mb-3 lg:mt-4 lg:mb-0">
					<WhyBuyFromUs />
				</div>

				<div class="block xl:hidden mx-[-15px] sm:mx-0">
					<Divider
						verticalMargin="my-7"
						borderHeight="border-t-8 sm:border-t"
						borderColor="border-white-2 sm:border-black-2"
					/>
				</div>

				<div class="flex flex-col gap-0 sm:gap-4 mt-4">
					<div class="order-4 lg:order-1">
						<ShippingFrom data={selectedProductDetailData.shippingDelivery} />
					</div>

					{#if !selectedProductDetailData.title.toLowerCase().includes('freebie')}
						<div class="order-2 hidden xl:flex gap-3">
							{#if selectedProductDetailData.outOfStock}
								<Button
									variant="primary"
									class="w-full h-[56px]"
									onClick={openNotifyWhenInStockModal}
								>
									<Text type="subtitle-2" color="white-1" weight="semibold">
										NOTIFY ME WHEN IN STOCK
									</Text>
								</Button>
							{:else}
								<Button variant="primary" class="w-10/12 h-[56px]" onClick={onClickBuy}>
									{#if $navigating || isLoading}
										<Loader3LineSystem class="animate-spin" />
									{:else}
										<Text type="subtitle-2" color="white-1" weight="semibold">BUY NOW</Text>
									{/if}
								</Button>
								<Button variant="secondary" class="w-2/12 h-[56px]" onClick={onClickAtc}>
									{#if $navigating || isLoading}
										<Loader3LineSystem class="animate-spin" />
									{:else}
										<ShoppingCart2LineFinance />
									{/if}
								</Button>
							{/if}
						</div>
					{/if}

					{#if $showErrorToast}
						<div class="hidden lg:block">
							<Toast
								align={false}
								color="none"
								defaultIconClass=""
								divClass="bg-brown-05 order-3 border border-brown-10 rounded-lg p-2 flex gap-3 relative"
								dismissable={false}
							>
								<div class="absolute left-0 top-0 h-full w-1 bg-brown-10 rounded-l-lg"></div>

								<div class="flex items-start gap-3 pl-3">
									<QuestionFillSystem width={16} height={16} class="mt-1 text-black-9" />
									<div class="flex flex-col">
										<Text type="body-2" color="black-9" weight="semibold">
											Can't access your account?
										</Text>
										<Text type="body-2" color="black-6">
											<a
												href="https://wa.link/9c0c2j"
												class="underline text-black-6 hover:text-black-7 font-bold"
												target="_blank"
											>
												<Text type="body-2" color="dark-brown-9" weight="semibold">Contact us</Text>
											</a>
											here to place your order manually
										</Text>
									</div>
								</div>
							</Toast>
						</div>
					{/if}

					{#if promotions?.length > 0}
						<div class="order-1 lg:order-4">
							<AvailablePromotions {promotions} />

							<div class="block sm:hidden mx-[-15px] sm:mx-0">
								<Divider
									verticalMargin="my-7"
									borderHeight="border-t-8 sm:border-t"
									borderColor="border-white-2 sm:border-black-2"
								/>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<NotifyWhenInStockModal
		isOpen={$isShowNotifyWhenInStockModal}
		onClose={closeNotifyWhenInStockModal}
		productId={selectedProductDetailData.id}
	/>
	{#if showModal && !customer?.isLoggedIn}
		<AuthenticationTab bind:isModalOpen={showModal} on:closeModal={closeModal} />
	{/if}
	{#if showSocialModal}
		<AuthenticationModal
			{credentialSoc}
			on:close={closeAuthentication}
			on:close-success={closeAuthenticationSuccess}
			on:error={handleAuthenticationError}
		/>
	{/if}
</div>

{#if showMagnifyModal}
	<MagnifyModal
		images={productDetailData[0].thumbnails}
		on:close-modal={toogleMagnify}
		{selectedImageCarouselIndex}
	/>
{/if}
