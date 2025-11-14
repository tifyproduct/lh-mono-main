<script lang="ts">
	import { navigating } from '$app/stores';

	import { Gallery, Spinner } from 'flowbite-svelte';

	import { Loader3LineSystem } from 'svelte-remix';

	import Modal from '$lib/components/Modal/Modal.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Divider from '$lib/components/Divider/Divider.svelte';
	import ProductBadge from '$lib/components/ProductBadge/ProductBadge.svelte';
	import ImageCarousel from '$lib/components/ImageCarousel/ImageCarousel.svelte';
	import Timer from '$lib/components/Timer/Timer.svelte';

	import { currencyFormat } from '$lib/utils/formatter';

	import type { ProductData } from '$lib/types/product';
	import { goto } from '$app/navigation';

	import { isTriggerShowCartAdded } from '$lib/stores/cart';
	import isShowNotifyWhenInStockModal, {
		openNotifyWhenInStockModal,
		closeNotifyWhenInStockModal
	} from '$lib/pages/BeautyProductDetailPage/store/isShowNotifyWhenInStockModalStore';
	import NotifyWhenInStockModal from '$lib/pages/BeautyProductDetailPage/components/NotifyWhenInStockModal/NotifyWhenInStockModal.svelte';

	export let isOpen: boolean;
	export let onClose: () => void;

	export let storeLocation = 'id';
	export let productHandle: string;
	export let productDetailData: Array<ProductData> = [];

	let isLoading = false;
	let isLoadingAddToCart = false;

	let selectedProductDetailDataIndex = productDetailData.findIndex(
		(product) => !product.outOfStock
	);
	selectedProductDetailDataIndex =
		selectedProductDetailDataIndex === -1 ? 0 : selectedProductDetailDataIndex;

	$: selectedProductDetailData =
		productDetailData?.length > 0 ? productDetailData[selectedProductDetailDataIndex] : undefined;

	// Images Data
	$: imagesData = productDetailData[0]?.thumbnails || [];
	$: focusedImage = imagesData?.find((image) => image.id === selectedProductDetailData?.image?.id);

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

	const onClickImage = (selectedImageId: string) => {
		focusedImage = imagesData?.find((image) => {
			return image.id === selectedImageId;
		});
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

	const fetchProductData = async () => {
		isLoading = true;

		await fetch(`/api/products/${productHandle}/variants`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(async (res) => {
			const response = await res.json();

			productDetailData = response;

			isLoading = false;
		});
	};

	$: {
		if (productHandle) {
			fetchProductData();
		}
	}

	const handleAddToCart = async () => {
		isLoadingAddToCart = true;
		if (selectedProductDetailData?.id) {
			$isTriggerShowCartAdded = true;

			const request = await fetch('/api/cart', {
				method: 'POST',
				body: JSON.stringify({
					variantId: selectedProductDetailData.id,
					quantity: 1
				})
			});

			const cartData = await request.json();

			if (cartData.id) {
				await goto('', {
					invalidateAll: true
				});

				onClose();
			}

			isLoadingAddToCart = false;
		}
	};
</script>

<div>
	<Modal title="Add to Cart" {isOpen} {onClose} hideCloseIcon={false} maxWidth={'w-[900px]'}>
		{#if isLoading}
			<div class="flex items-center justify-center">
				<Spinner color="gray" />
			</div>
		{:else}
			<div>
				<div>
					<div class="flex flex-col xl:flex-row gap-[20px] relative">
						<!-- Desktop -->
						<div class="hidden xl:flex flex-1 items-start gap-6 sticky top-4 max-h-[530px]">
							<div>
								<div class="flex flex-col gap-4 max-h-[530px] overflow-auto">
									{#each imagesData as item}
										<img
											src={item.src}
											alt={item.alt}
											class={`
													w-[50px] h-[50px]
													object-contain
													bg-white-2
													rounded
													cursor-pointer
												`}
											role="presentation"
											on:click={() => {
												if (item.id) {
													onClickImage(item.id);
												}
											}}
										/>
									{/each}
								</div>
							</div>

							<Gallery>
								<img
									src={focusedImage?.src}
									alt={focusedImage?.alt}
									class="w-[270px] h-[270px] object-contain rounded"
								/>

								<div class="absolute top-0">
									<ProductBadge
										discount={selectedProductDetailData?.discount}
										preOrder={selectedProductDetailData?.preOrder}
										outOfStock={selectedProductDetailData?.outOfStock}
										newArrival={selectedProductDetailData?.newArrival}
										isBeauty
									/>
								</div>
							</Gallery>
						</div>

						<div class="flex xl:hidden">
							<ImageCarousel data={imagesData} {focusedImage}>
								<div slot="imageOverlay">
									<div class="absolute top-0">
										<ProductBadge
											discount={selectedProductDetailData?.discount}
											preOrder={selectedProductDetailData?.preOrder}
											outOfStock={selectedProductDetailData?.outOfStock}
											newArrival={selectedProductDetailData?.newArrival}
											isBeauty
										/>
									</div>
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

								<Text type="subtitle-1" color="black-10" weight="semibold">
									{selectedProductDetailData?.vendor}
								</Text>
								<div class="mt-4">
									<Text type="subtitle-3" color="black-6">
										{selectedProductDetailData?.title}
									</Text>
								</div>

								{#if selectedProductDetailData?.expiredAt}
									<div class="mt-4">
										<Text type="caption-1" color="black-6">
											Expiry Date: {selectedProductDetailData?.expiredAt}
										</Text>
									</div>
								{/if}
							</div>

							<div class="mt-[20px]">
								{#if !selectedProductDetailData?.showPrice}
									<Text type="title-3" color="black-6" weight="semibold">Call for Price</Text>
								{:else if selectedProductDetailData?.discount}
									<div>
										<div>
											<Text type="body-2" color="black-4" class="line-through">
												{currencyFormat(
													parseInt(selectedProductDetailData?.normalPrice),
													storeLocation
												)}
											</Text>
										</div>
										<div class="mt-3">
											<Text type="subtitle-1" color="red-5" weight="semibold">
												{currencyFormat(
													parseInt(selectedProductDetailData?.salePrice),
													storeLocation
												)}
											</Text>
										</div>
									</div>
								{:else}
									<Text type="subtitle-1" color="black-10" weight="semibold">
										{currencyFormat(
											parseInt(selectedProductDetailData?.normalPrice),
											storeLocation
										)}
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
									<Text type="body-1" color="black-10">{selectedProductDetailData?.variant}</Text>

									<Gallery class="mt-3 flex gap-3 overflow-auto">
										{#each variantsData as item, index}
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
														cursor-pointer
													`}
												on:click={() => onClickVariant(index)}
												class:opacity-[0.5]={item.isOutOfStock}
											/>
										{/each}
									</Gallery>
								</div>
							{/if}

							<div class="block xl:hidden mx-[-15px] sm:mx-0">
								<Divider
									verticalMargin="my-7"
									borderHeight="border-t-8 sm:border-t"
									borderColor="border-white-2 sm:border-black-2"
								/>
							</div>

							<div class="flex flex-col mt-12">
								<div class="flex gap-3">
									{#if selectedProductDetailData?.outOfStock}
										<Button
											variant="primary"
											class="w-full h-[56px]"
											onClick={openNotifyWhenInStockModal}
										>
											<Text type="subtitle-2" color="white-1" weight="semibold">
												NOTIFY ME WHEN IN STOCK
											</Text>
										</Button>
									{:else if $navigating || isLoading}
										<Loader3LineSystem class="animate-spin" />
									{:else}
										<Button variant="primary" class="w-full h-[52px]" onClick={handleAddToCart}>
											{#if $navigating || isLoadingAddToCart}
												<Loader3LineSystem class="animate-spin" />
											{:else}
												<Text type="subtitle-2" color="white-1" weight="semibold">ADD TO CART</Text>
											{/if}
										</Button>
									{/if}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</Modal>
	<NotifyWhenInStockModal
		isOpen={$isShowNotifyWhenInStockModal}
		onClose={closeNotifyWhenInStockModal}
		productId={selectedProductDetailData?.id ?? ''}
	/>
</div>
