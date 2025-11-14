<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	let scrollContainer: HTMLDivElement;

	const scroll = (howMuch: number) => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: howMuch, behavior: 'smooth' });
		}
	};

	export let products;
</script>

<div class="container py-8 px-4 relative">
	<div class="flex lg:justify-center px-4">
		<Text type="subtitle-1" weight="semibold" color="black-10">RECENTLY VIEWED</Text>
	</div>
	<div class="container overflow-hidden">
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
			{#each products as product}
				{@const productItem = {
					name: product.title,
					description: product.vendor,
					initialPrice: product.normalPrice || '0.0',
					discountPrice: product.salePrice || '0.0',
					discountPercentage: product.percentage ?? 0,
					imageURL: product.image?.url,
					tags: product.tags,
					tagAll: product.tagAll,
					imageHeight: 'h-[212px] h-[204px]',
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
					class="cursor-pointer shrink-0 basis-40 md:basis-52 snap-start"
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
	</div>
</div>
