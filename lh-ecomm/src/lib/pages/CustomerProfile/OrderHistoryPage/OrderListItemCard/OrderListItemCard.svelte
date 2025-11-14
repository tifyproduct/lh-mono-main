<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import { Toaster } from 'svelte-sonner';
	import { onMount } from 'svelte';
	import { Hr } from 'flowbite-svelte';
	import type { OrderHistoryDataItem, OrderHistoryStatus } from '../type';
	import { DateTime } from 'luxon';
	import { currencyFormat } from '$lib/utils/formatter';
	import { navigating, page } from '$app/stores';
	import Button from '$lib/components/Button/Button.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';

	import { goto } from '$app/navigation';
	import { Loader3LineSystem } from 'svelte-remix';

	export let selectedStatus: OrderHistoryStatus;
	export let orderHistoryItem: OrderHistoryDataItem;

	let ctaName: string = '';
	let showModal: boolean = false;

	$: {
		switch (selectedStatus) {
			case 'PAYMENT':
				ctaName = 'PAY NOW';
				break;
			case 'SHIPPED':
				ctaName = 'ORDER AGAIN';
				break;
			default:
				ctaName = '';
		}
	}

	const toggleModal = () => {
		showModal = !showModal;
	};

	const handleOrderAgain = async () => {
		const addToCartObject = orderHistoryItem.productDetails.map((item) => {
			return {
				quantity: item.quantity,
				variantId: item.productVariantID
			};
		});

		const request = await fetch('/api/cart', {
			method: 'POST',
			body: JSON.stringify(addToCartObject)
		});

		const cartData = await request.json();

		if (cartData?.id) {
			await goto('/cart', {
				invalidateAll: true
			});
		}
	};

	const handleCTAClicked = async (e: Event) => {
		if ($navigating) return;

		e.stopPropagation();
		if (selectedStatus === 'PAYMENT') {
			window.location.href = orderHistoryItem.checkoutURL;
		} else if (selectedStatus === 'SHIPPED') {
			handleOrderAgain();
		}
	};

	onMount(() => {
		sessionStorage.setItem('isDetailPage', 'false');
	});
</script>

<div>
	<div class="flex justify-between max-lg:px-4 mb-4">
		<div class="flex flex-col">
			<Text type="body-2" color="black-6">Order {orderHistoryItem.number}</Text>
			<Text type="body-2" weight="semibold">
				{DateTime.fromISO(orderHistoryItem.orderedAt).toFormat('dd MMM yyyy HH:mm')}
			</Text>
		</div>
		{#if orderHistoryItem.productDetails?.length > 1}
			{@const slicedItem = orderHistoryItem.productDetails.slice(
				1,
				orderHistoryItem.productDetails.length
			)}
			<div class="flex lg:hidden items-center">
				<div class="flex items-center">
					{#each slicedItem as item}
						<img
							src={item.imageURL}
							alt=""
							class="size-[40px] [&:not(:first-child)]:-translate-x-2 border border-black-1 rounded"
						/>
					{/each}
				</div>
				<Text
					type="body-2"
					weight="semibold"
					color="black-9"
					class={slicedItem.length === 1 ? 'ml-2' : ''}
				>
					{slicedItem.length} item(s)
				</Text>
			</div>
		{/if}
	</div>
	<div class="max-lg:flex-col flex max-lg:px-4">
		<div class="flex">
			<div class="mr-2 size-16 lg:size-[150px] lg:mr-5">
				<img src={orderHistoryItem?.productDetails[0]?.imageURL ?? ''} alt="" />
			</div>
			<div class="flex flex-col justify-between">
				<div class="flex flex-col">
					<Text type="body-2" weight="semibold">
						{orderHistoryItem?.productDetails[0]?.brandName ?? ''}
					</Text>
					<Text type="body-1" color="black-6" class="my-1">
						{orderHistoryItem?.productDetails[0]?.name ?? ''}
						(x{orderHistoryItem?.productDetails[0]?.quantity ?? ''})
					</Text>
					{#if orderHistoryItem?.productDetails[0]?.variant}
						<div class="flex items-center">
							<Text type="caption-1" color="black-4">
								Variant: {orderHistoryItem?.productDetails[0]?.variant ?? ''}
							</Text>
							<!-- TODO IMPLEMENT >1 VARIANTS -->
							<!-- <span class="border border-black-1 mx-3 h-full"></span>
						<Text type="caption-1" color="black-4">Size: 44</Text> -->
						</div>
					{/if}
				</div>
				{#if orderHistoryItem.productDetails?.length > 1}
					{@const slicedItem = orderHistoryItem.productDetails.slice(
						1,
						orderHistoryItem.productDetails.length
					)}
					<div class="hidden lg:flex items-center">
						<div class="flex items-center">
							{#each slicedItem as item}
								<img
									src={item.imageURL}
									alt=""
									class="size-[40px] [&:not(:first-child)]:-translate-x-2 border border-black-1 rounded"
								/>
							{/each}
						</div>
						<Text
							type="body-2"
							weight="semibold"
							color="black-9"
							class={slicedItem.length === 1 ? 'ml-2' : ''}
						>
							{slicedItem.length} item(s)
						</Text>
					</div>
				{/if}
			</div>
		</div>
		<Hr hrClass="my-4 lg:hidden" />
		<div class=" lg:ml-auto lg:text-right flex lg:flex-col justify-between items-center">
			<div class="flex flex-col">
				<Text type="body-2" color="black-5">
					{selectedStatus !== 'REFUNDED' ? 'Payment Total' : 'Total Refund'}
				</Text>
				<Text type="subtitle-3" weight="semibold" color="dark-brown-9">
					{selectedStatus !== 'REFUNDED'
						? currencyFormat(
								parseInt(orderHistoryItem?.paymentDetails?.paymentTotal.amount),
								$page.params.store
							)
						: currencyFormat(
								parseInt(orderHistoryItem?.paymentDetails?.totalRefundedAmount.amount),
								$page.params.store
							)}
				</Text>
				{#if selectedStatus == 'PAYMENT' && orderHistoryItem?.paymentDetails.paymentDueDate}
					<div>
						<Text type="caption-1" color="black-6">Pay before</Text>
						<Text type="caption-1" weight="semibold" color="red-5">
							{DateTime.fromISO(orderHistoryItem?.paymentDetails.paymentDueDate).toFormat(
								'dd MMM yyyy HH:mm'
							)}
						</Text>
					</div>
				{/if}
			</div>
			{#if ctaName}
				<div class="flex justify-end w-full">
					<Button onClick={handleCTAClicked} variant="primary">
						{#if $navigating}
							<Loader3LineSystem class="animate-spin" />
						{:else}
							{ctaName}
						{/if}
					</Button>
				</div>
			{/if}
		</div>
	</div>
	<Hr hrClass="my-4 max-lg:border-t-8 max-lg:border-white-2" />
</div>

<div
	role="presentation"
	on:click={(e) => {
		e.stopPropagation();
	}}
>
	<Modal onClose={toggleModal} hideCloseIcon isOpen={showModal} maxWidth="max-w-sm">
		<div class="flex flex-col items-center text-center z-50">
			<Text type="subtitle-3" weight="semibold">Complete Your Order?</Text>
			<Text type="body-2" color="black-6" class="mt-2 mb-4">
				Make sure you’ve received your items correctly before completing this order. Proceed to
				complete order?
			</Text>
			<div class="flex w-full">
				<div class="w-1/2 mr-1">
					<Button
						variant="secondary"
						class="w-full"
						onClick={(e) => {
							e.stopPropagation();
							toggleModal();
						}}
					>
						CANCEL
					</Button>
				</div>
				<div class="w-1/2 ml-1">
					<Button
						variant="primary"
						class="w-full"
						onClick={(e) => {
							e.stopPropagation();
							toggleModal();
						}}
					>
						YES
					</Button>
				</div>
			</div>
		</div>
	</Modal>
</div>

<Toaster position="top-center">Order successfully completed</Toaster>
