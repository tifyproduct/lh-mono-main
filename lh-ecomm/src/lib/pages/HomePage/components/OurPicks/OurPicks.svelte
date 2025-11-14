<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	import type { ComponentEvents } from 'svelte';

	import ProductTabs from '$lib/pages/HomePage/ProductTabs/ProductTabs.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';
	import Skeleton from '$lib/components/Skeleton/Skeleton.svelte';

	import type { ProductData } from '$lib/types/product';
	import type { HomepageSales } from '$lib/types/homepageSales';
	import { googleAnalClickedEvent, googleAnalClickProduct } from '$lib/utils/googleAnalytics';

	export let items: HomepageSales[] | undefined;
	export let isLoading: boolean;

	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	const tabTitle: string[] = [];
	const tabContents: ProductData[][] = [];

	$: for (const item of items ?? []) {
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
	<h2 class="mx-4 md:text-center text-xl md:text-3xl font-semibold pb-4">OUR PICKS</h2>

	{#if isLoading || !items}
		<div class="flex flex-col justify-center px-4">
			<div class="flex justify-center">
				<Skeleton width="w-[400px]" height="h-[40px]" />
			</div>

			<div class="mt-6 flex gap-4 overflow-auto">
				{#each Array(5) as _}
					<div>
						<Skeleton width="w-[320px]" height="h-[445px]" />
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div>
			<div class="px-4 relative">
				<ProductTabs {tabTitle} on:tab-changed={onTabChanged}>
					{#each tabContents as tabContent, index}
						{#if index === activeTabIndex}
							<div class="container relative">
								<button
									on:click={() => {
										googleAnalClickedEvent('click_navigation_product_our_picks', {
											reference: {
												name: 'Previous'
											}
										});
										scroll(-300);
									}}
									class="cursor-pointer hidden xl:block absolute -left-8 top-1/2 -translate-y-1/2"
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
											imageURL: product.image?.url || '',
											tags: product.tags,
											tagAll: product.tagAll,
											imageHeight: 'h-[330px]',
											url: product.url,
											showPrice: product.showPrice,
											productId: product.id,
											wishlisted: product.wishlisted,
											category: product.type,
											collection: tabTitle[activeTabIndex],
											discount: product.discount,
											preOrder: product.preOrder,
											outOfStock: product.outOfStock,
											newArrival: product.newArrival
										}}
										<ProductCard
											googleEvent="click_product_our_picks"
											class="cursor-pointer shrink-0 basis-36 md:basis-80 2xl:basis-[19rem] snap-start"
											{...productItem}
										/>
									{/each}
								</div>
								<button
									on:click={() => {
										googleAnalClickedEvent('click_navigation_product_our_picks', {
											reference: {
												name: 'Next'
											}
										});
										scroll(300);
									}}
									class="cursor-pointer hidden xl:block absolute -right-8 top-1/2 -translate-y-1/2"
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
					onClick={() => googleAnalClickedEvent('click_view_all_our_picks', {})}
					href={`${baseParams}/${items[activeTabIndex].handle}`}
					class="min-w-60 w-full lg:w-auto"
					variant="primary"
				>
					VIEW ALL
				</Button>
			</div>
		</div>
	{/if}
</div>
