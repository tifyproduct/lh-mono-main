<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
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
	}

	export let items: { title: string; products: Product[] }[];
	export let backgroundImageUrl: string;
	export let mobileImageUrl: string;
	export let backgroundHref: string;
	export let mobileHref: string;

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

	const navigateToBackgroundHref = () => {
		window.location.href = backgroundHref;
	};

	const navigateToMobileHref = () => {
		window.location.href = mobileHref;
	};
</script>

<div
	class="topContainer container max-w-[1600px]"
	style="background-size: cover; background-image: url({backgroundImageUrl}); cursor: pointer;"
	on:click={navigateToBackgroundHref}
>
	<div class="px-4 relative mt-0">
		<img
			src={mobileImageUrl}
			class="mobile-only block md:hidden lg:hidden"
			on:click={navigateToMobileHref}
		/>
		<div class="flex items-center relative overflow-hidden md:p-8">
			<button
				on:click={() => scroll(-300)}
				class="cursor-pointer hidden lg:block absolute -left-8 top-1/2 -translate-y-1/2 z-10"
			>
				<ArrowLeftSLineArrows size="28" />
			</button>
			<div
				bind:this={scrollContainer}
				class="custom-scrollbar box-content flex flex-nowrap gap-4 snap-mandatory snap-x pt-4 pb-8 overflow-x-scroll"
				style="flex: 1;"
			>
				{#each tabContents.flat() as product}
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
						class="cursor-pointer shrink-0 basis-1/2 md:basis-1/4 lg:basis-1/4 xl:basis-1/4 snap-start bg-white-1 p-2"
						{...productItem}
					/>
				{/each}
			</div>
			<button
				on:click={() => scroll(300)}
				class="cursor-pointer hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2 z-10"
			>
				<ArrowRightSLineArrows size="28" />
			</button>
		</div>
	</div>
	<div class="text-center mt-8 mx-4 py-4">
		<Button
			href={`${baseParams}/${tabTitle}`}
			class="min-w-60 w-full lg:w-auto md:hidden"
			variant="primary"
		>
			VIEW ALL
		</Button>
	</div>
</div>

<style>
	@media only screen and (max-width: 678px) {
		.topContainer {
			background: linear-gradient(to bottom, #150b01 100%, #100903 100%) !important;
		}
		.custom-scrollbar {
			max-width: 100% !important;
			padding: 0px !important;
		}
	}

	.custom-scrollbar {
		position: relative;
		max-width: 60%;
		padding-left: 2rem;
		background: linear-gradient(to bottom, #150b01 100%, #100903 100%);
		padding: 30px;
	}

	.scrollContainer {
		scroll-behavior: smooth;
	}
</style>
