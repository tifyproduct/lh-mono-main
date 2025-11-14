<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	import ProductTabs from '$lib/pages/HomePage/ProductTabs/ProductTabs.svelte';
	import type { ComponentEvents } from 'svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	export let items;

	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	const tabTitle = [];
	const tabContents = [];

	for (const item of items) {
		tabTitle.push(item.title);
		tabContents.push(item.products);
	}

	let activeTabIndex = 0;
	let scrollContainer: HTMLDivElement;

	const scroll = (howMuch: number) => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: howMuch, behavior: 'smooth' });
		}
	};

	function onTabChanged(event: ComponentEvents<ProductTabs>['idx']) {
		activeTabIndex = event.detail;
	}
</script>

<div class="container">
	<div class="px-4 relative">
		<ProductTabs {tabTitle} on:tab-changed={onTabChanged}>
			{#each tabContents as tabContent, index}
				{#if index === activeTabIndex}
					<div class="container relative">
						<button
							on:click={() => {
								scroll(-300);
							}}
							class="cursor-pointer hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2"
						>
							<ArrowLeftSLineArrows size="28" />
						</button>
						<div
							bind:this={scrollContainer}
							class="custom-scrollbar box-content flex flex-nowrap gap-4 snap-mandatory snap-x pt-4 pb-8 overflow-x-scroll"
						>
							{#each tabContent as product}
								{@const productItem = {
									name: product.title,
									description: product.vendor,
									initialPrice: product.normalPrice,
									discountPrice: product.salePrice,
									discountPercentage: product.percentage,
									imageURL: product.image?.url,
									tags: product.tags,
									tagAll: product.tagAll,
									imageHeight: 'h-[330px]',
									url: product.url,
									showPrice: product.showPrice,
									productId: product.id,
									wishlisted: product.wishlisted,
									discount: product.discount,
									preOrder: product.preOrder,
									outOfStock: product.outOfStock,
									newArrival: product.newArrival
								}}
								<ProductCard
									class="cursor-pointer shrink-0 basis-36 md:basis-80 2xl:basis-[19rem] snap-start"
									{...productItem}
								/>
							{/each}
						</div>
						<button
							on:click={() => {
								scroll(300);
							}}
							class="cursor-pointer hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2"
						>
							<ArrowRightSLineArrows size="28" />
						</button>
					</div>
				{/if}
			{/each}
		</ProductTabs>
	</div>
	<div class="text-center mt-8 mx-4">
		<Button
			href={`${baseParams}/${items[activeTabIndex].handle}`}
			class="min-w-60 w-full lg:w-auto"
			variant="primary"
		>
			VIEW
		</Button>
	</div>
</div>
