<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import { page } from '$app/stores';
	import ProductTabs from '$lib/pages/ConciergePage/components/ProductTabs/ProductTabs.svelte';
	import { type ComponentEvents } from 'svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	export let items;

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;

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

<div class="container max-w-[1600px]">
	<div class="grid text-center md:p-20 mt-8 md:mt-0">
		<Text type="subtitle-1" color="black-9" weight="semibold">PIECES AVAILABLE FOR PRE-ORDER</Text>
		<Text type="body-2" color="black-5" class="md:mt-2"
			>Skip the lines and hop on the trend before everyone else!</Text
		>
	</div>
	<div class="px-4 relative mt-4">
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
	<div class="text-center mt-8 mx-4 mb-8">
		<Button
			href={`${baseParams}/${items[activeTabIndex].handle}`}
			class="min-w-60 w-full lg:w-auto p-4"
			variant="primary"
		>
			SHOP ALL PRE-ORDER ITEMS
		</Button>
	</div>
</div>
