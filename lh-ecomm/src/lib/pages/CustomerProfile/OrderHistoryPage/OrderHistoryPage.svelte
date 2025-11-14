<script lang="ts">
	import type { CustomerProfile } from '$lib/types/customer';

	import type {
		OrderHistoryStatus,
		OrderHistoryItem,
		OrderHistoryPageState,
		OrderHistoryStatusHeader,
		OrderHistoryDataItem
	} from './type';
	import OrderList from './OrderList/OrderList.svelte';
	import OrderDetail from './OrderDetail/OrderDetail.svelte';
	import { onMount } from 'svelte';
	import orderHistoryStore from '$lib/stores/order';

	import { ListPlaceholder } from 'flowbite-svelte';

	import Magnifier from '$lib/assets/page/general/magnifier.svg';
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { ArrowLeftSLineArrows } from 'svelte-remix';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	export const customer: CustomerProfile | undefined = undefined;

	let orderHistoryState: OrderHistoryPageState = 'list';
	let orderHistoryStatusList: OrderHistoryStatusHeader[] = [];
	let orderHistoryResponse: OrderHistoryItem[] = $orderHistoryStore;
	let isLoading: boolean = true;
	let selectedStatus: OrderHistoryStatus = 'IN PROGRESS';
	let selectedOrderItemIndex: number = 0;
	let orderListItems: OrderHistoryDataItem[];
	let hasOrder: boolean = false;

	const handleViewDetail = (e: CustomEvent) => {
		selectedOrderItemIndex = e.detail;
		orderHistoryState = 'detail';
	};

	const handleBackToList = () => {
		orderHistoryState = 'list';
	};

	const fetchOrderHistory = async () => {
		if ($orderHistoryStore?.length > 0) {
			orderHistoryResponse = $orderHistoryStore;
			isLoading = false;
			return;
		}

		try {
			isLoading = true;
			const orderHistoryRequest = await fetch('/api/customer/order/history', {
				method: 'GET'
			});

			orderHistoryResponse = await orderHistoryRequest.json();

			$orderHistoryStore = orderHistoryResponse;
		} catch (error) {
			// TODO update to toast
			console.error(error);
		} finally {
			isLoading = false;
		}
	};

	const handleOnStatusSelected = (event: CustomEvent) => {
		const status = event.detail;
		selectedStatus = status;
	};

	$: {
		if (orderHistoryResponse && orderHistoryResponse?.length > 0) {
			orderHistoryStatusList = orderHistoryResponse.map((item: OrderHistoryItem) => {
				return {
					status: item.status.toLocaleUpperCase(),
					count: item.count
				};
			});

			const filteredOrderHistoryResponse: OrderHistoryItem | undefined = orderHistoryResponse.find(
				(item) => {
					return item.status.toLocaleUpperCase() === selectedStatus;
				}
			);

			if (filteredOrderHistoryResponse) {
				orderListItems = filteredOrderHistoryResponse.data;
			}

			for (let order of orderHistoryResponse) {
				if (order.count > 0) {
					hasOrder = true;
					break;
				}
			}
		}
	}

	onMount(() => {
		fetchOrderHistory();
	});

	const handleToProfile = async () => {
		await goto(`pages/customer-profile-mobile`);
	};

	const handleStartShop = async () => {
		await goto(`/${$page.params.store}/${$page.params.lang}`);
	};
</script>

<div>
	{#if isLoading || orderHistoryResponse?.length <= 0}
		<div class="max-lg:px-4">
			<ListPlaceholder divClass="w-full" />
			<br />
			<ListPlaceholder divClass="w-full" />
		</div>
	{/if}
	{#if !isLoading && orderHistoryResponse?.length > 0}
		{#if hasOrder}
			{#if orderHistoryState === 'list'}
				<OrderList
					{selectedStatus}
					{orderHistoryStatusList}
					{orderListItems}
					on:view-detail={handleViewDetail}
					on:status-selected={handleOnStatusSelected}
				/>
			{:else}
				<OrderDetail
					{selectedStatus}
					orderItem={orderListItems[selectedOrderItemIndex]}
					on:back={handleBackToList}
				/>
			{/if}
		{:else}
			<div class="flex flex-col items-center justify-center min-h-[60vh]">
				<img src={Magnifier} alt="magnifier-illustration-no-order" class="mb-10" />
				<Text type="subtitle-3" weight="semibold" color="black-9">No Order Yet</Text>
				<Text type="body-2" color="black-9" class="mt-2 mb-10 lg:w-1/2 text-center">
					It looks like you don’t have any orders yet. Explore our store and checkout products you
					love. They’ll show up here!
				</Text>
				<Button onClick={handleStartShop} variant="secondary">START SHOPPING</Button>
			</div>
		{/if}
	{/if}
</div>
