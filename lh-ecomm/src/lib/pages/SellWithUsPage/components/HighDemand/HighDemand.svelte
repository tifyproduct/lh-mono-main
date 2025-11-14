<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	export let items;

	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	const watchesItem = items.find((item) => item.title === 'Watches');
	let tabContents = watchesItem?.products || [];

	tabContents = tabContents.slice().sort((a, b) => {
		const isANewArrival = a.tags.includes('NEW ARRIVAL');
		const isBNewArrival = b.tags.includes('NEW ARRIVAL');
		const isASoldOut = a.tags.includes('SOLD OUT');
		const isBSoldOut = b.tags.includes('SOLD OUT');

		if (isANewArrival && !isBNewArrival) return -1;
		if (!isANewArrival && isBNewArrival) return 1;

		if (isASoldOut && !isBSoldOut) return 1;
		if (!isASoldOut && isBSoldOut) return -1;

		return 0;
	});

	let scrollContainer: HTMLDivElement;

	const scroll = (howMuch: number) => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: howMuch, behavior: 'smooth' });
		}
	};
</script>

<div class="container">
	<h2 class="mx-4 text-left md:text-center text-xl md:text-4xl font-semibold pb-4 py-4 md:pt-16">
		High-Demand Items
	</h2>
	<p
		class="text-[#666975] text-sm md:max-w-xl mx-auto md:mx-auto md:mx-0 mx-4 px-4 md:px-0 text-left md:text-center"
	>
		View the list of today's most sought-after luxury items and how much you can earn by selling
		them! Prices may vary depending on items' condition.
	</p>
	<div class="px-4 relative mt-4">
		<div class="container relative">
			<button
				on:click={() => scroll(-300)}
				class="cursor-pointer hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2"
			>
				<ArrowLeftSLineArrows size="28" />
			</button>
			<div
				bind:this={scrollContainer}
				class="custom-scrollbar box-content flex flex-nowrap gap-4 snap-mandatory snap-x pt-4 pb-8 overflow-x-scroll"
			>
				{#each tabContents as product}
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
				on:click={() => scroll(300)}
				class="cursor-pointer hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2"
			>
				<ArrowRightSLineArrows size="28" />
			</button>
		</div>
	</div>
</div>
