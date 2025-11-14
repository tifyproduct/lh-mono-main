<script lang="ts">
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	import { Spinner } from 'flowbite-svelte';

	import { AddLineSystem } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	import customerProfileStore from '$lib/stores/customerProfileStore';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import SimplePagination from '$lib/components/SimplePagination/SimplePagination.svelte';

	import type { ProductData } from '$lib/types/product';
	import type { Pagination } from '$lib/types/pagination';

	let currentPage = 1;
	let recentlyViewedList: ProductData[] = [];
	let pagination: Pagination | null = null;
	let isLoading: boolean = true;

	$: if ($customerProfileStore?.id) {
		fetchRecentlyViewed();
	}

	const fetchRecentlyViewed = async () => {
		const url = new URL('/api/recently-viewed', window.location.origin);

		url.searchParams.append('store', get(page).params.store);
		url.searchParams.append('lang', get(page).params.lang);
		url.searchParams.append('page', currentPage.toString());
		url.searchParams.append('perPage', '12');

		const request = await fetch(url.toString(), {
			method: 'GET'
		});

		const response = await request.json();
		recentlyViewedList = response.data;
		pagination = response.pagination;
		isLoading = false;
	};

	const handlePageChange = (e: CustomEvent) => {
		currentPage = e.detail;
		fetchRecentlyViewed();
	};
</script>

<div class="flex flex-col basis-3/5 max-lg:p-4">
	<div class="flex items-center">
		<Text type="subtitle-3" color="black-9" weight="semibold">Recently Viewed Items</Text>
	</div>

	<!-- Content -->
	{#if isLoading}
		<div class="flex items-center justify-center min-h-[60vh]">
			<Spinner color="gray" />
		</div>
	{:else if recentlyViewedList.length > 0}
		<div>
			<div class="relative grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-5 mt-10">
				{#each recentlyViewedList as product}
					{@const productItem = {
						name: product.title,
						description: product.vendor,
						initialPrice: product.normalPrice || '0.0',
						discountPrice: product.salePrice || '0.0',
						discountPercentage: product.percentage ?? 0,
						imageURL: product.image?.url || '',
						tags: product.tags,
						tagAll: product.tagAll,
						imageHeight: '',
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
			<div class="mt-16">
				<SimplePagination
					{currentPage}
					hasNext={pagination?.hasNext}
					hasPrev={pagination?.hasPrevious}
					count={pagination?.total}
					itemsPerPage={12}
					on:pageChange={handlePageChange}
				/>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
			<img src="/icons/search_folder.svg" alt="no-address-icon" class="mb-4" />

			<div class="mt-10">
				<Text type="subtitle-3" color="black-9" weight="semibold">
					No Recently Viewed Items Yet
				</Text>
			</div>

			<div class="mt-2">
				<Text type="body-2" color="black-6">
					It looks like you haven’t viewed any items recently. Start <br />
					exploring our collection and revisit your recent picks here!
				</Text>
			</div>

			<div class="mt-10">
				<Button
					variant="secondary"
					class="flex items-center gap-1"
					href="/{$page.params.store}/{$page.params.lang}"
				>
					<Text type="body-2" color="dark-brown-10" weight="semibold">EXPLORE NOW</Text>
					<AddLineSystem class="size-4" />
				</Button>
			</div>
		</div>
	{/if}
</div>
