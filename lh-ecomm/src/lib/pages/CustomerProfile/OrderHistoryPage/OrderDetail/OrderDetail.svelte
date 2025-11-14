<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import { onMount } from 'svelte';
	import { Hr } from 'flowbite-svelte';
	import { ArrowLeftSLineArrows, FileCopyLineDocument, Loader3LineSystem } from 'svelte-remix';
	import JNE from '$lib/assets/partners/JNE.png';
	import OrderDetailItemCard from '../OrderDetailItemCard/OrderDetailItemCard.svelte';
	import { createEventDispatcher } from 'svelte';
	import type { OrderHistoryDataItem, OrderHistoryStatus } from '../type';
	import { DateTime } from 'luxon';
	import { currencyFormat } from '$lib/utils/formatter';
	import { navigating, page } from '$app/stores';
	import OrderStep from '../OrderStep/OrderStep.svelte';
	import { redirectToWhatsapp } from '$lib/utils/whatsappRedirect';
	import { STORE } from '$lib/constants.util';
	import copyToClipboard from '$lib/utils/copyToClipboard';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import customerProfileStore from '$lib/stores/customerProfileStore';

	export let orderItem: OrderHistoryDataItem;
	export let selectedStatus: OrderHistoryStatus;

	// TODO IMPLEMENT GROUP BY SHIPPING ITEM
	// let groupedOrderDetailItems = [];

	const dispatch = createEventDispatcher();

	const handleBack = () => {
		sessionStorage.setItem('isDetailPage', 'false');
		dispatch('back');
	};

	// TODO IMPLEMENT GROUP BY SHIPPING ITEM
	// $: {
	// 	groupedOrderDetailItems = Object.groupBy(
	// 		orderItem.productDetails,
	// 		({ shippingDetail }) => shippingDetail.companyName
	// 	);
	// }
	const country = $page.params.store || STORE.id;
	const baseParams = `/${$page.params.store}/${$page.params.lang}`;

	const handleContactUs = () => {
		redirectToWhatsapp({
			customer: $customerProfileStore,
			country,
			orderID: orderItem.number,
			baseParams,
			pathname: `${baseParams}/profile?page=order-history-contact`
		});
	};

	const handleComplain = () => {
		redirectToWhatsapp({
			customer: $customerProfileStore,
			country,
			orderID: orderItem.number,
			baseParams,
			pathname: `${baseParams}/profile?page=order-history-complain`
		});
	};

	const handleCopyTrackId = (trackingID: string) => {
		if (trackingID) {
			copyToClipboard(trackingID);
			toast.success('Copied to Clipboard', {
				position: 'top-center'
			});
		}
	};

	const handleTrackOrder = (url: string) => {
		window.open(url);
	};

	const handlePayNow = async (e: Event) => {
		if ($navigating) return;

		window.location.href = orderItem.checkoutURL;
	};

	const handleOrderAgain = async () => {
		const addToCartObject = orderItem.productDetails.map((item) => {
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

	onMount(() => {
		if (orderItem?.number) {
			sessionStorage.setItem('isDetailPage', 'true');
			sessionStorage.setItem('orderHistoryNumber', orderItem.number);
		}
	});
</script>

<div>
	<div class="flex justify-between max-lg:shadow-md max-lg:p-4">
		<Button variant="link" class="p-0" onClick={handleBack}>
			<ArrowLeftSLineArrows class="mr-1" />
			<Text type="subtitle-3" weight="semibold" color="black-9">Order Detail</Text>
		</Button>
		<div class="hidden lg:flex flex-col text-right">
			<Text type="body-2" color="black-6">Order {orderItem.number}</Text>
			<Text type="body-2" weight="semibold">
				{DateTime.fromISO(orderItem.orderedAt).toFormat('dd MMM yyyy HH:mm')}
			</Text>
		</div>
	</div>
	<div class="flex lg:hidden justify-between p-4">
		<Text type="body-2" weight="semibold">
			{DateTime.fromISO(orderItem.orderedAt).toFormat('dd MMM yyyy HH:mm')}
		</Text>
		<Text type="body-2" color="black-6">Order {orderItem.number}</Text>
	</div>
	<OrderStep {selectedStatus} />
	<div class="flex mt-10 max-lg:flex-col max-lg:p-4">
		<div class="flex flex-col lg:w-1/2 lg:mr-5 max-lg:mb-8">
			<Text type="body-1" weight="semibold" color="black-9" class="mb-4">Shipping Address</Text>
			<Text type="body-1" weight="medium" color="black-9" class="mb-1">
				{orderItem.shippingAddress.firstName}
				{orderItem.shippingAddress.lastName}
			</Text>
			{#if orderItem.shippingAddress.phone}
				<Text type="body-2" color="black-7" class="mb-1">
					{orderItem.shippingAddress.phone}
				</Text>
			{/if}
			{#if orderItem.shippingAddress.address1}
				<Text type="body-2" color="black-7" class="mb-1">
					{orderItem.shippingAddress.address1}
				</Text>
			{/if}
			{#if orderItem.shippingAddress.address2}
				<Text type="body-2" color="black-7">
					{orderItem.shippingAddress.address2}
				</Text>
			{/if}
		</div>
		<div class="flex flex-col lg:w-1/2 lg:ml-5">
			<Text type="body-1" weight="semibold" color="black-9" class="mb-4">Payment Detail</Text>
			<div class="flex justify-between mb-3">
				<div class="flex flex-col">
					<Text type="caption-1" color="black-5">Subtotal</Text>
				</div>
				<div class="flex flex-col">
					<Text type="body-2" weight="medium" color="black-9">
						{currencyFormat(
							parseInt(orderItem.paymentDetails.subtotalAmount.amount),
							$page.params.store
						)}
					</Text>
				</div>
			</div>
			{#if orderItem.paymentDetails.shippingAmount.amount}
				<div class="flex justify-between mb-3">
					<div class="flex flex-col">
						<Text type="caption-1" color="black-5">Shipping</Text>
					</div>
					<div class="flex flex-col">
						<Text type="body-2" weight="medium" color="black-9">
							{currencyFormat(
								parseInt(orderItem.paymentDetails.shippingAmount.amount),
								$page.params.store
							)}
						</Text>
					</div>
				</div>
			{/if}
			{#if orderItem.paymentDetails.discountAmount.amount}
				<div class="flex justify-between">
					<div class="flex flex-col">
						<Text type="caption-1" color="black-5">Discount</Text>
					</div>
					<div class="flex flex-col">
						<Text type="body-2" weight="medium" color="black-9">
							{currencyFormat(
								parseInt(orderItem.paymentDetails.discountAmount.amount),
								$page.params.store
							)}
						</Text>
					</div>
				</div>
			{/if}
			<Hr hrClass="my-3" />
			<div class="flex justify-between">
				<div class="flex flex-col">
					<Text type="caption-1" color="black-5">Payment Total</Text>
				</div>
				<div class="flex flex-col">
					<Text type="subtitle-3" weight="semibold" color="black-9">
						{currencyFormat(
							parseInt(orderItem.paymentDetails.paymentTotal.amount),
							$page.params.store
						)}
					</Text>
				</div>
			</div>
			{#if selectedStatus == 'PAYMENT'}
				{#if orderItem?.paymentDetails.paymentDueDate}
					<div class="flex justify-end mt-3">
						<div class="flex flex-col mr-1">
							<Text type="caption-1" color="black-5">Pay Before</Text>
						</div>
						<div class="flex flex-col">
							<Text type="caption-1" weight="semibold" color="red-5">
								{DateTime.fromISO(orderItem?.paymentDetails.paymentDueDate).toFormat(
									'dd MMM yyyy HH:mm'
								)}
							</Text>
						</div>
					</div>
				{/if}
				<div class="flex justify-end w-full mt-3">
					<Button onClick={handlePayNow} variant="primary">
						{#if $navigating}
							<Loader3LineSystem class="animate-spin" />
						{:else}
							PAY NOW
						{/if}
					</Button>
				</div>
			{/if}
			{#if orderItem?.paymentDetails?.totalRefundedAmount?.amount}
				<div class="flex justify-between mt-3">
					<div class="flex flex-col">
						<Text type="caption-1" color="black-5">Total Refund</Text>
					</div>
					<div class="flex flex-col">
						<Text type="subtitle-3" weight="semibold" color="red-5">
							{currencyFormat(
								parseInt(orderItem.paymentDetails.totalRefundedAmount.amount),
								$page.params.store
							)}
						</Text>
					</div>
				</div>
			{/if}
		</div>
	</div>
	<div class="lg:mt-10">
		<div class="max-lg:px-4 mb-4">
			<Text type="body-1" weight="semibold" color="black-9">
				Items ({orderItem.productDetails.length})
			</Text>
			<div class="flex justify-between items-center">
				{#if orderItem?.productDetails[0]?.shippingDetail?.trackingID}
					<div class="flex items-center lg:mt-10 mb-4">
						<div class="mr-4 size-[56px] flex items-center justify-center">
							<img src={JNE} alt="" />
						</div>
						<div>
							<Text type="body-1" weight="medium">
								{orderItem.productDetails[0].shippingDetail.companyName}
							</Text>
							<div class="flex items-center">
								<Text type="body-1" color="black-5" class="mr-2">
									{orderItem.productDetails[0].shippingDetail.trackingID}
								</Text>
								<FileCopyLineDocument
									size={16}
									on:click={() =>
										handleCopyTrackId(orderItem.productDetails[0].shippingDetail.trackingID)}
								/>
							</div>
						</div>
					</div>
				{/if}
				{#if orderItem?.productDetails[0]?.shippingDetail?.trackingURL}
					<Button
						onClick={() => handleTrackOrder(orderItem.productDetails[0].shippingDetail.trackingURL)}
						variant="secondary"
					>
						Track
					</Button>
				{/if}
			</div>
		</div>
		<div class="max-lg:mx-4 lg:p-6 border rounded">
			{#each orderItem.productDetails as item, index}
				<OrderDetailItemCard orderDetailItem={item} {selectedStatus} />
				{#if index != orderItem.productDetails.length - 1}
					<Hr hrClass="my-4 max-lg:border-t-8 max-lg:border-white-2" />
				{/if}
			{/each}
		</div>
	</div>
	<div
		class="max-lg:fixed max-lg:-30 bottom-0 left-0 max-lg:p-4 max-lg:w-full bg-white-1 max-lg:border max-lg:border-black-1 lg:flex lg:justify-between lg:items-center lg:mt-10"
	>
		{#if selectedStatus === 'SHIPPED'}
			<div class="hidden lg:flex flex-col">
				<Text type="body-1" color="black-6">Issue with your order?</Text>

				<button
					class="border border-red-5 rounded max-lg:my-3 lg:px-4 py-3 lg:mt-2 text-red-5"
					on:click={handleComplain}
				>
					<Text type="body-1" color="red-5" weight="semibold">MAKE A COMPLAIN</Text>
				</button>
			</div>
			<Button variant="primary" class="max-lg:w-full ml-auto" onClick={handleOrderAgain}>
				{#if $navigating}
					<Loader3LineSystem class="animate-spin" />
				{:else}
					ORDER AGAIN
				{/if}
			</Button>
		{/if}
		{#if selectedStatus !== 'SHIPPED'}
			<Button variant="secondary" class="max-lg:w-full ml-auto" onClick={handleContactUs}>
				CONTACT US
			</Button>
		{/if}
	</div>
	{#if selectedStatus == 'SHIPPED'}
		<div class="lg:hidden">
			<Hr hrClass="my-4 max-lg:border-t-8 max-lg:border-white-2" />
			<div class="flex flex-col p-4">
				<Text type="body-1" color="black-6">Issue with your order?</Text>
				<button
					class="border border-red-5 rounded max-lg:my-3 lg:px-4 py-3 lg:mt-2"
					on:click={handleContactUs}
				>
					<Text type="body-1" color="red-5" weight="semibold">MAKE A COMPLAIN</Text>
				</button>
			</div>
		</div>
	{/if}
</div>
