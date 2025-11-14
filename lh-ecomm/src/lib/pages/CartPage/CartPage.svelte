<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb/Breadcrumb.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import CartItemCard from '$lib/pages/CartPage/CartItemCard/CartItemCard.svelte';
	import { Hr, Toast } from 'flowbite-svelte';
	import {
		Gift2LineFinance,
		ArrowRightSLineArrows,
		ArrowLeftSLineArrows,
		HeartLineHealthMedical,
		ShoppingCart2LineFinance,
		CheckboxCircleFillSystem,
		Loader3LineSystem,
		CloseFillSystem
	} from 'svelte-remix';
	import Button from '$lib/components/Button/Button.svelte';
	import { onMount } from 'svelte';
	import PromotionListPopup from '$lib/components/PromotionListPopup/PromotionListPopup.svelte';
	import type { CartToastState, DiscountedAmount } from './CartItemCard/type';
	import { currencyFormat } from '$lib/utils/formatter';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let data;

	$: breadcrumbData = [
		{
			href: '/cart',
			label: 'Cart'
		}
	];

	let isMobile: boolean = false;
	let isShowPromotionModal: boolean = false;
	let voucherApplied: number = 0;
	let isShowToast: boolean = false;
	let toastCopy: string = '';
	let discountAmount: number = 0;
	let isVoucheApplicable: boolean = false;
	let toastState: CartToastState;
	let isRemovingVoucher: boolean = false;
	let promoCode: string;

	const togglePromotionModal = () => {
		isShowPromotionModal = !isShowPromotionModal;

		googleAnalClickedEvent('click_shop_with_promo', {});
	};

	onMount(() => {
		const updateScreenSize = () => {
			isMobile = window.innerWidth <= 765;
		};

		updateScreenSize();
		window.addEventListener('resize', updateScreenSize);

		return () => {
			window.removeEventListener('resize', updateScreenSize);
		};
	});

	const showToast = () => {
		isShowToast = true;

		setTimeout(() => {
			isShowToast = false;
		}, 3000);
	};

	$: {
		discountAmount = (data?.cart?.discountAllocations ?? []).reduce(
			(acc: number, item: DiscountedAmount) => {
				return acc + parseFloat(item.discountedAmount.amount);
			},
			0
		);

		setTimeout(() => {
			voucherApplied = data?.cart?.discountCodes?.filter((item) => {
				return item.applicable;
			}).length;
		}, 0);
	}

	const handleVoucherApplied = () => {
		isVoucheApplicable = data?.cart?.discountCodes[0].applicable;

		if (isVoucheApplicable) {
			toastState = 'success';
			toastCopy = 'Voucher applied successfully';
			showToast();
		} else {
			toastState = 'warning';
			toastCopy = 'Voucher cannot be used.';
			showToast();
		}
	};

	function nav_back() {
		if (browser) window.history.back();
	}

	const handleOnRemoveSucceed = () => {
		toastState = 'info';
		toastCopy = 'Product removed';
		showToast();
	};

	const handleRemoveVoucher = async () => {
		try {
			isRemovingVoucher = true;
			const verifyDiscountCode = await fetch('/api/cart/discount-code', {
				method: 'POST',
				body: JSON.stringify({
					code: ''
				})
			});

			const verifyDiscountCodeRes = await verifyDiscountCode.json();

			if (verifyDiscountCodeRes?.data?.cartDiscountCodesUpdate?.cart?.id) {
				await goto('', {
					invalidateAll: true
				});
				voucherApplied = 0;
				toastState = 'success';
				toastCopy = 'Voucher removed successfully';
				showToast();
			}
		} finally {
			isRemovingVoucher = false;
		}
	};

	const cancelVoucher = () => {
		if (isRemovingVoucher) return;

		handleRemoveVoucher();
	};

	const handlePreApplyVoucher = async (promoCode: string) => {
		try {
			isRemovingVoucher = true;
			const verifyDiscountCode = await fetch('/api/cart/discount-code', {
				method: 'POST',
				body: JSON.stringify({
					code: promoCode
				})
			});

			const verifyDiscountCodeRes = await verifyDiscountCode.json();

			if (verifyDiscountCodeRes?.data?.cartDiscountCodesUpdate?.cart?.id) {
				await goto('', {
					invalidateAll: true
				});
			}
			handleVoucherApplied();
		} catch (error) {
			toastState = 'warning';
			toastCopy = 'Error applying Voucher';
			showToast();
		} finally {
			isRemovingVoucher = false;
		}
	};

	onMount(() => {
		const urlParams = $page.url.searchParams;

		promoCode = urlParams.get('promoCode') ?? '';

		if (promoCode) {
			handlePreApplyVoucher(promoCode);
		}
	});

	const onClickCheckout = () => {
		googleAnalClickedEvent('begin_checkout', {});
	};
</script>

<div class="flex items-center p-4 lg:hidden shadow-md mb-4">
	<ArrowLeftSLineArrows size={24} on:click={nav_back} />
	<Text type="body-1" weight="semibold">Shopping Cart</Text>
	<HeartLineHealthMedical class="ml-auto" size={20} />
</div>
<div class="container relative lg:pt-10 pb-20">
	<div class="fixed w-full flex justify-center max-lg:bottom-10 z-30 left-0">
		<Toast dismissable={false} toastStatus={isShowToast} divClass="">
			<div
				class="p-4 flex w-full items-center max-w-xs rounded border border-l-4 bg-white shadow dark:text-gray-400 dark:bg-gray-800 gap-3 {toastState ==
				'warning'
					? 'text-white-1 bg-red-5 border-red-8'
					: toastState == 'success'
						? 'text-white-1 bg-green-5 border-green-8'
						: toastState == 'info'
							? 'bg-brown-05 text-gray-500 border-brown-10'
							: ''} "
			>
				<CheckboxCircleFillSystem size={16} class="mr-2" />
				<Text type="body-2" color={toastState == 'info' ? 'black-6' : 'white-1'}>
					{toastCopy}
				</Text>
			</div>
		</Toast>
	</div>
	<div class="pb-4 px-4">
		<Breadcrumb items={breadcrumbData} />
	</div>
	{#if (data?.cart?.lines?.nodes ?? []).length > 0}
		<div class="max-lg:flex-col flex max-lg:h-full max-lg:mb-9">
			<div class="lg:mr-14 basis-3/4">
				<Text class="hidden lg:block px-4" type="subtitle-3" weight="semibold">Shopping Cart</Text>
				<Hr hrClass="lg:mx-4 my-5 hidden lg:block" />
				{#each data?.cart?.lines?.nodes ?? [] as item (item?.id)}
					<div class="flex items-start">
						<div class="w-full">
							<CartItemCard {item} on:remove-succeed={handleOnRemoveSucceed} />
						</div>
					</div>
					<Hr hrClass="lg:mx-4 my-5 max-lg:border-t-8 max-lg:border-white-2" />
				{/each}
			</div>
			<div
				class="basis-1/4 max-lg:shadow max-lg:py-3 max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:w-full max-lg:px-4 bg-white-1 max-lg:z-20"
			>
				<Text type="subtitle-3" class="hidden lg:block" weight="semibold">Voucher</Text>
				{#if voucherApplied < 1 && !isRemovingVoucher}
					<Button
						variant="link"
						class="max-lg:mb-3 flex items-center border border-[black-2] p-3 rounded mt-3 mb-5 w-full"
						onClick={togglePromotionModal}
					>
						<Gift2LineFinance class="text-beige-10 mr-1" size={16} />
						<Text type="body-2" color="beige-10" weight="medium">Apply Voucher</Text>
						<ArrowRightSLineArrows class="ml-auto text-beige-10" size={16} />
					</Button>
				{:else}
					<div
						class="border border-beige-10 bg-beige-1 px-4 py-3 flex justify-between max-lg:mb-3 lg:mt-3"
					>
						{#if !isRemovingVoucher}
							<div class="flex flex-col">
								<Text type="body-2" weight="semibold">
									{discountAmount
										? `Discount ${currencyFormat(discountAmount, $page.params.store)}`
										: 'Voucher applied'}
								</Text>
								<Text type="caption-1" color="black-6">
									{discountAmount ? `${voucherApplied} Voucher(s) applied` : ''}
								</Text>
							</div>
							<CloseFillSystem size={16} on:click={cancelVoucher} />
						{:else}
							<div class="flex justify-center w-full">
								<Loader3LineSystem class="animate-spin" />
							</div>
						{/if}
					</div>
				{/if}
				<Text type="subtitle-3" weight="semibold" class="pt-5 hidden lg:block">Summary</Text>
				<div class="max-lg:flex max-lg:items-center max-lg:justify-between">
					<div class="lg:mt-3">
						<div class="lg:flex justify-between hidden">
							<Text type="body-2" color="black-7">
								Subtotal ({data?.cart?.totalQuantity} Item)
							</Text>
							<Text type="body-2" color="black-7" class="mt-2">
								{currencyFormat(data?.cart?.cost?.subtotalAmount?.amount ?? 0, $page.params.store)}
							</Text>
						</div>

						{#if discountAmount > 0}
							<div class="lg:flex justify-between hidden">
								<Text type="body-2" color="black-7">Discount</Text>
								<Text type="body-2" color="black-7" class="mt-2">
									- {currencyFormat(discountAmount, $page.params.store)}
								</Text>
							</div>
						{/if}
						<Hr hrClass="my-2 hidden lg:block" />
						<div class="flex justify-between max-lg:flex-col max-lg:justify-center">
							<Text
								type="body-2"
								weight={isMobile ? 'regular' : 'semibold'}
								color={isMobile ? 'black-6' : 'black-7'}>Total</Text
							>
							<Text type="body-2" weight="semibold" color="black-7">
								{currencyFormat(
									(data?.cart?.cost?.totalAmount?.amount ?? 0) - (data?.cart?.shippingCost ?? 0),
									$page.params.store
								)}
							</Text>
						</div>
					</div>
					<Button
						href={data.cart?.checkoutUrl ?? ''}
						variant="primary"
						class="max-lg:mt-0 w-1/2 lg:w-full mt-6"
						onClick={onClickCheckout}
					>
						CHECK OUT
					</Button>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex flex-col justify-center items-center px-4 min-h-[50vh] max-lg:min-h-[80vh]">
			<ShoppingCart2LineFinance size={88} class="text-brown-10 mb-5" />
			<Text type="subtitle-3" weight="semibold" color="black-9" class="mb-2">
				Your shopping cart is empty
			</Text>
			<Text type="body-2" color="black-6" class="mb-10 text-center">
				Looks like you haven't added anything to your cart. Go ahead and explore our top products
			</Text>
			<Button href="/" variant="secondary">EXPLORE NOW</Button>
		</div>
	{/if}
</div>

<PromotionListPopup
	showApplyVoucher
	promotionList={data.promotions.promotions ?? []}
	isOpen={isShowPromotionModal}
	on:close-modal={togglePromotionModal}
	on:voucher-applied={handleVoucherApplied}
/>
