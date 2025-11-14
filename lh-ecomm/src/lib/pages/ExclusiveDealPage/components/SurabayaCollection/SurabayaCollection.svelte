<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import Text from '$lib/components/Text/Text.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	interface Product {
		title: string;
		vendor: string;
		normalPrice: number;
		salePrice: number;
		percentage: number;
		image?: { url: string };
		tags: string[];
		tagAll: string[];
		url: string;
		showPrice: boolean;
		wishlisted: boolean;
		id: string;
		discount: boolean;
		preOrder: boolean;
		outOfStock: boolean;
		newArrival: boolean;
	}

	export let items: { title: string; products: Product[] }[];

	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	const tabTitle: string[] = [];
	const tabContents: Product[][] = [];

	if (items) {
		for (const item of items) {
			tabTitle.push(item.title);
			tabContents.push(item.products);
		}
	}

	let scrollContainer: HTMLDivElement;

	const scroll = (howMuch: number) => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: howMuch, behavior: 'smooth' });
		}
	};
</script>

<div class="container">
	<div class="px-4 relative mt-4">
		<Text type="subtitle-2" weight="semibold" color="red-5">SURABAYA COLLECTION</Text>

		<div class="container relative mt-4">
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
				{#each tabContents.flat() as product}
					{@const productItem = {
						name: product.title,
						description: product.vendor,
						initialPrice: product.normalPrice.toString(),
						discountPrice: product.salePrice.toString(),
						discountPercentage: product.percentage,
						imageURL: product.image?.url || '',
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
