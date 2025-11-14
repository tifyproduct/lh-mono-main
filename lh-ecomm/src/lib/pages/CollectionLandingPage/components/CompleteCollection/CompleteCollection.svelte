<script lang="ts">
	import { goto } from '$app/navigation';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';

	let scrollContainer: HTMLDivElement;

	const scroll = (howMuch: number) => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: howMuch, behavior: 'smooth' });
		}
	};

	export let productData;
</script>

<div class="container px-4 relative pt-10 lg:pt-[60px]">
	<div class="flex lg:justify-center lg:pb-3">
		<Text type="subtitle-1" weight="semibold" color="black-10">OUR COMPLETE COLLECTION</Text>
	</div>
	<button
		on:click={() => {
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
		{#each productData?.products ?? [] as product}
			{@const productItem = {
				name: product.title,
				description: product.vendor,
				initialPrice: product.normalPrice,
				discountPrice: product.salePrice,
				discountPercentage: product.percentage ?? 0,
				imageURL: product.image?.url,
				tags: product.tags,
				tagAll: product.tagAll,
				imageHeight: 'h-[212px] lg:h-[240px]',
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
				class="cursor-pointer shrink-0 basis-[9.75rem] lg:basis-[21rem] snap-start"
				{...productItem}
			/>
		{/each}
	</div>
	<button
		on:click={() => {
			scroll(300);
		}}
		class="cursor-pointer hidden xl:block absolute -right-8 top-1/2 -translate-y-1/2"
	>
		<ArrowRightSLineArrows size="28" />
	</button>
	<div class="flex justify-center pt-4 lg:pt-8">
		<Button
			onClick={() => {
				goto(`${productData.handle.categoryHandle}`);
			}}
			class="w-full lg:w-auto"
			padding="py-3 px-8"
			variant="primary">VIEW ALL</Button
		>
	</div>
</div>
