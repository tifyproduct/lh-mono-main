<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';

	import { Button as ButtonFlowbite, Input } from 'flowbite-svelte';
	import {
		ArrowLeftSLineArrows,
		ArrowRightSLineArrows,
		CalendarLineBusiness,
		SearchLineSystem
	} from 'svelte-remix';
	import OrderItemCard from '../OrderListItemCard/OrderListItemCard.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import type { OrderHistoryStatus, OrderHistoryStatusHeader, OrderHistoryDataItem } from '../type';
	import { goto } from '$app/navigation';

	export let orderHistoryStatusList: OrderHistoryStatusHeader[];
	export let selectedStatus: OrderHistoryStatus;
	export let orderListItems: OrderHistoryDataItem[];

	const dispatch = createEventDispatcher();

	const handleViewDetail = (selectedIndex: number) => {
		dispatch('view-detail', selectedIndex);
	};

	const handleSelectedStatus = (status: string) => {
		dispatch('status-selected', status);
	};

	const handleToProfile = async () => {
		await goto(`pages/customer-profile-mobile`);
	};
</script>

<div>
	<div class="flex justify-between items-center max-lg:p-4 max-lg:shadow-md">
		<Button variant="link" class="p-0" onClick={handleToProfile}>
			<ArrowLeftSLineArrows class="mr-1 lg:hidden" />
			<Text weight="semibold" type="subtitle-3" color="black-9">Order History</Text>
		</Button>
		<div class="ml-auto flex items-center">
			<Input
				placeholder="Find your order"
				size="md"
				class="border-black-2 rounded bg-white-1 px-4 py-2 max-lg:hidden"
			>
				<SearchLineSystem slot="left" size={16} class="w-4 h-4 max-lg:hidden" />
			</Input>
			<ButtonFlowbite class="lg:hidden bg-white-1 ">
				<SearchLineSystem size={16} />
			</ButtonFlowbite>
			<ButtonFlowbite
				class="bg-white-1 lg:border lg:border-black-5 rounded  lg:px-4 lg:py-2 lg:ml-2"
			>
				<CalendarLineBusiness class="text-black-10 lg:text-black-5 mr-2" size={16} />
				<Text type="body-2" class="hidden lg:block te" color="black-9">Filter</Text>
			</ButtonFlowbite>
		</div>
	</div>
	<div class="flex lg:mt-10">
		<ButtonFlowbite class="hidden lg:block border border-dark-brown-10 px-4 py-3 rounded">
			<ArrowLeftSLineArrows />
		</ButtonFlowbite>
		<div
			class="lg:min-w-[calc(100%-250px)] xl:min-w-[90%] border border-black-2 rounded lg:mx-2 flex overflow-scroll lg:max-w-[600px] xl:max-w-[900px] xxl:max-w-full no-scrollbar"
		>
			{#each orderHistoryStatusList as status}
				<div
					class="py-3 px-10 whitespace-nowrap lg:min-w-[33%] cursor-pointer text-center w-auto grow-1
					{selectedStatus === status.status ? 'border-b-2 border-dark-brown-9' : ''}"
					role="presentation"
					on:click={() => handleSelectedStatus(status.status)}
				>
					<Text type="body-2" weight={status.status === selectedStatus ? 'semibold' : 'regular'}>
						{status.status} ({status.count})
					</Text>
				</div>
			{/each}
		</div>
		<ButtonFlowbite class="hidden lg:block border border-dark-brown-10 px-4 py-3 rounded">
			<ArrowRightSLineArrows />
		</ButtonFlowbite>
	</div>
	<div>
		<div class="mt-4 lg:mt-10">
			{#each orderListItems as orderHistoryItem, index}
				<a on:click|preventDefault|stopPropagation={() => handleViewDetail(index)} href={undefined}>
					<OrderItemCard {orderHistoryItem} {selectedStatus} />
				</a>
			{/each}
		</div>
		<div class="text-center mt-10">
			<Text type="body-2" color="black-6">
				{orderListItems.length} of {orderListItems.length} order(s)
			</Text>
		</div>
	</div>
</div>
