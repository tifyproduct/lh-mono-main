<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';
	import Skeleton from '$lib/components/Skeleton/Skeleton.svelte';

	export let data;
	export let href;
	export let isLoading = false;

	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	let scrollContainer: HTMLDivElement;

	const scroll = (howMuch: number) => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: howMuch, behavior: 'smooth' });
		}
	};

	const onClickViewAll = () => {
		googleAnalClickedEvent('click_view_all_more_from_this_brand', {});
	};
</script>

<div class="container">
	<div class="md:text-center mx-4">
		<Text type="subtitle-1" color="black-10" weight="semibold">MORE FROM THIS BRAND</Text>
	</div>

	<div class="mt-7 px-4">
		<div class="container flex items-center justify-center relative">
			<button
				on:click={() => {
					scroll(-200);
				}}
				class="cursor-pointer hidden xl:block"
			>
				<ArrowLeftSLineArrows size="28" />
			</button>
			<div
				bind:this={scrollContainer}
				class="custom-scrollbar box-content flex flex-nowrap gap-4 snap-mandatory snap-x pt-4 pb-8 overflow-x-scroll"
			>
				{#if isLoading}
					<div class="flex gap-y-8 gap-x-4 p-4">
						{#each Array(6) as _}
							<div>
								<Skeleton width="w-[208px]" height="h-[310px]" />
							</div>
						{/each}
					</div>
				{:else}
					{#each data as product}
						{@const productItem = {
							name: product.title,
							description: product.vendor,
							initialPrice: product.normalPrice,
							discountPrice: product.salePrice,
							discountPercentage: product.percentage,
							imageURL: product.image?.url,
							tags: product.tags,
							tagAll: product.tagAll,
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
							googleEvent="click_product_more_from_this_brand"
							class="cursor-pointer shrink-0 basis-40 md:basis-52 snap-start"
							{...productItem}
						/>
					{/each}
				{/if}
			</div>
			<button
				on:click={() => {
					scroll(200);
				}}
				class="cursor-pointer hidden xl:block"
			>
				<ArrowRightSLineArrows size="28" />
			</button>
		</div>
	</div>
	<div class="text-center mt-8 mx-4">
		<Button
			variant="primary"
			class="min-w-60 w-full xl:w-auto"
			href={`${baseParams}/${href}`}
			onClick={onClickViewAll}
		>
			VIEW ALL
		</Button>
	</div>
</div>
