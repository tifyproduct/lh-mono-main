<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import { Hr } from 'flowbite-svelte';
	import type { OrderHistoryStatus, OrderProductDetails } from '../type';
	import { currencyFormat } from '$lib/utils/formatter';
	import { page } from '$app/stores';
	import Button from '$lib/components/Button/Button.svelte';
	import { goto } from '$app/navigation';

	export let orderDetailItem: OrderProductDetails;
	export let selectedStatus: OrderHistoryStatus;

	const handleSeeDetail = async () => {
		await goto(`product/${orderDetailItem.typeLowerCase}/${orderDetailItem.handle}`);
	};

	const handleWriteReview = async () => {
		await goto(
			`product/${orderDetailItem.typeLowerCase}/${orderDetailItem.handle}?writeReview=true`
		);
	};
</script>

<div>
	<div class="max-lg:flex-col flex max-lg:px-4 max-lg:py-3">
		<div class="flex">
			<div class="mr-2 size-16 lg:size-[150px] lg:mr-5">
				<img src={orderDetailItem.imageURL} alt="" />
			</div>
			<div class="flex flex-col justify-between">
				<div class="flex flex-col">
					<Text type="body-2" weight="semibold">
						{orderDetailItem.brandName}
					</Text>
					<Text type="body-1" color="black-6" class="my-1">
						{orderDetailItem.name}
						(x{orderDetailItem.quantity})
					</Text>
					{#if orderDetailItem.variant}
						<div class="flex items-center">
							<Text type="caption-1" color="black-4">Variant: {orderDetailItem.variant}</Text>
							<!-- TODO IMPLEMENT SIZE / MULTIPLE VARIANT -->
							<!-- <span class="border border-black-1 mx-3 h-full"></span>
						<Text type="caption-1" color="black-4">Size: 44</Text> -->
						</div>
					{/if}
				</div>
				<div class="hidden lg:flex items-center">
					<Button variant="link" onClick={handleSeeDetail} class="p-0">
						<Text type="body-2" weight="semibold" color="black-9">SEE DETAIL</Text>
					</Button>
					{#if selectedStatus === 'SHIPPED'}
						<Button
							variant="link"
							onClick={handleWriteReview}
							class="p-0 pl-2 ml-2 border-l-[1px] "
						>
							<Text type="body-2" weight="semibold" color="black-9">WRITE REVIEW</Text>
						</Button>
					{/if}
				</div>
			</div>
		</div>
		<Hr hrClass="my-4 lg:hidden" />
		<div class="flex max-lg:justify-between lg:flex-col lg:ml-auto lg:text-right">
			<Text type="body-2" color="black-5">Price</Text>
			<Text type="subtitle-3" weight="semibold" color="dark-brown-9">
				{orderDetailItem.price.amount != '0.0'
					? currencyFormat(parseInt(orderDetailItem.price.amount), $page.params.store)
					: 'FREE'}
			</Text>
		</div>
		<div class="lg:hidden flex items-center mt-4">
			<Button variant="link" onClick={handleSeeDetail} class="p-0">
				<Text type="body-2" weight="semibold" color="black-9">SEE DETAIL</Text>
			</Button>
			{#if selectedStatus === 'SHIPPED'}
				<Button variant="link" onClick={handleWriteReview} class="p-0 pl-2 ml-2 border-l-[1px] ">
					<Text type="body-2" weight="semibold" color="black-9">WRITE REVIEW</Text>
				</Button>
			{/if}
		</div>
	</div>
</div>
