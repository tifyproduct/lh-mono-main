<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import { afterUpdate } from 'svelte';
	import {
		FileListLineDocument,
		Loader2FillSystem,
		TruckLineMap,
		Refund2LineFinance
	} from 'svelte-remix';
	import type { OrderHistoryStatus } from '../type';

	export let selectedStatus: OrderHistoryStatus;

	let scrollContainer: HTMLDivElement;
	let scrollable = false;

	let updateScrollContainer = () => {
		if (scrollContainer) {
			if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
				scrollable = true;
				return;
			}

			scrollable = false;
		}
	};

	afterUpdate(() => {
		updateScrollContainer();
	});
</script>

<div
	bind:this={scrollContainer}
	class="flex mt-10 items-start max-lg:p-4"
	class:justify-center={!scrollable}
>
	<div class="flex flex-col justify-center text-center shrink-0 status-item">
		<div class="flex justify-center mb-3">
			<div
				class="p-2 border border-dark-brown-2 bg-dark-brown-05 rounded-full status-icon {selectedStatus ==
				'PAYMENT'
					? 'bg-dark-brown-9 text-white-2'
					: 'bg-dark-brown-05'}"
			>
				<FileListLineDocument size={20} />
			</div>
		</div>
		<Text type="body-2" weight="semibold" color={'dark-brown-9'}>
			{selectedStatus == 'PAYMENT' ? 'Pay Order' : 'Order Paid'}
		</Text>
		<!-- TODO implement paid date -->
		<!-- <Text type="caption-1" color="black-6">17 Aug 2024 17:09</Text> -->
	</div>
	<div
		class="border {selectedStatus == 'PAYMENT'
			? 'border-dashed'
			: ''} border-dark-brown-2 w-full mt-5 mx-2 max-w-[40%] min-w-6"
	/>
	{#if selectedStatus != 'REFUNDED'}
		<div class="flex flex-col justify-center text-center shrink-0 status-item">
			<div class="flex justify-center mb-3">
				<div
					class="p-2 border
        {selectedStatus == 'IN PROGRESS'
						? 'bg-dark-brown-9'
						: selectedStatus == 'PAYMENT'
							? 'bg-white-1 border-dashed'
							: 'bg-dark-brown-05'} 
        rounded-full status-icon"
				>
					<Loader2FillSystem
						size={20}
						class={selectedStatus == 'IN PROGRESS'
							? 'text-white-2'
							: selectedStatus == 'PAYMENT'
								? 'text-dark-brown-9'
								: 'text-dark-brown-9'}
					/>
				</div>
			</div>
			<Text
				type="body-2"
				weight="semibold"
				color={['IN PROGRESS', 'SHIPPED'].includes(selectedStatus)
					? 'dark-brown-9'
					: 'dark-brown-2'}
			>
				In Process
			</Text>
			<Text type="caption-1" color="black-6"></Text>
		</div>
		<div
			class="border {['IN PROGRESS', 'PAYMENT'].includes(selectedStatus)
				? 'border-dashed'
				: ''} border-dark-brown-2 w-full mt-5 mx-2 max-w-[40%] min-w-6"
		/>
		<div class="flex flex-col justify-center text-center shrink-0 status-item">
			<div class="flex justify-center mb-3">
				<div
					class="p-2 border border-dark-brown-2 {['SHIPPED'].includes(selectedStatus)
						? 'bg-dark-brown-9 text-white-2'
						: 'bg-white-1 border-dashed'} rounded-full status-icon"
				>
					<TruckLineMap
						size={20}
						class={['SHIPPED'].includes(selectedStatus) ? 'text-white-2' : 'text-dark-brown-4'}
					/>
				</div>
			</div>
			<Text
				type="body-2"
				weight="semibold"
				color={['SHIPPED'].includes(selectedStatus) ? 'dark-brown-9' : 'dark-brown-2'}
			>
				Shipped
			</Text>
			<Text type="caption-1" color="black-6"></Text>
		</div>
	{:else}
		<div class="flex flex-col justify-center text-center shrink-0 status-item">
			<div class="flex justify-center mb-3">
				<div
					class="p-2 border border-dark-brown-2 bg-dark-brown-05 text-dark-brown-9
						rounded-full status-icon"
				>
					<Refund2LineFinance size={20} class="text-dark-brown-9" />
				</div>
			</div>
			<Text type="body-2" weight="semibold" color="dark-brown-9">REFUNDED</Text>
			<Text type="caption-1" color="black-6"></Text>
		</div>
	{/if}
</div>
