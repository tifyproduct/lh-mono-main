<script lang="ts">
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { goto } from '$app/navigation';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';
	import SubBrandCarousel from '$lib/pages/CollectionPage/components/SubBrandCarousel/SubBrandCarousel.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import RelatedArticle from '$lib/components/RelatedArticle/RelatedArticle.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb/Breadcrumb.svelte';
	import BrandBanner from '$lib/pages/CollectionPage/components/BrandBanner/BrandBanner.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import CollectionFilter from '$lib/components/CollectionFilter/CollectionFilter.svelte';
	import RecentlyViewed from '$lib/components/RecentlyViewed/RecentlyViewed.svelte';
	import type { ProductData } from '$lib/types/product';
	import { paginationFormatter } from '$lib/utils/pagination';
	import type { BreadcrumbProps } from '$lib/types/breadcrumb';
	import Skeleton from '$lib/components/Skeleton/Skeleton.svelte';

	export let data;

	let productList: ProductData[] = [];
	let isLoading: boolean = false;

	const fetchList = async () => {
		if (isLoading) return;

		try {
			productList = [];
			isLoading = true;
			let url = `/api/collections/collection-page?store=${data.params.store}
					&lang=${data.params.lang}
					&variables=${data.encodedVariables}
				`;
			await fetch(url, {
				method: 'GET'
			}).then(async (response) => {
				const resp = await response.json();

				productList = resp.products;
			});
		} catch (error) {
			console.error('Failed to fetch collections data:', error);
		} finally {
			isLoading = false;
		}
	};

	onMount(async () => {
		await fetchList();
	});

	let breadcrumbData: BreadcrumbProps[];
	let currentPage = 1;

	$: {
		breadcrumbData = data.breadcrumbs.map((breadcrumb) => {
			return {
				label: breadcrumb?.title ?? '',
				href: `${breadcrumb?.url ?? ''}`
			};
		});

		currentPage =
			data?.productPagination?.findIndex((pagination) => {
				return pagination.isCurrentPage;
			}) + 1;

		fetchList();
	}

	function getNextPageUrl(paginations) {
		let nextPageUrl = '';

		for (const [id, pagination] of paginations.entries()) {
			if (pagination.isCurrentPage) {
				nextPageUrl = paginations[id + 1].url || null;
			}
		}

		return nextPageUrl;
	}

	function getPrevPageUrl(paginations) {
		let prevPageUrl = '';

		for (const [id, pagination] of paginations.entries()) {
			if (pagination.isCurrentPage) {
				prevPageUrl = paginations[id - 1].url || null;
			}
		}

		return prevPageUrl;
	}
</script>

<div>
	<div class="container py-4 px-4 lg:px-0 lg:pt-[60px] lg:pb-6">
		<Breadcrumb items={breadcrumbData} />
	</div>

	{#if data.brand}
		<BrandBanner data={data.brand} collectionType={data.type} descData={data} />
	{/if}

	{#if data?.subBrands}
		<SubBrandCarousel subBrandList={data.subBrands} collectionType={data.type} />
	{/if}

	{#if data.filters && data.activeFilters}
		{#key productList}
			<CollectionFilter
				filters={data.filters}
				activeFilters={data.activeFilters}
				activeSort={data.activeSort}
				sortReverse={data.sortReverse}
				collectionType={data.type}
			/>
		{/key}
	{/if}

	{#if $navigating || isLoading}
		<div class="container flex flex-col justify-center px-4">
			<div
				class="grid grid-cols-2 gap-y-8 gap-x-4 p-4 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 mt-8"
			>
				{#each Array(18) as _}
					<div>
						<Skeleton width="w-[208px]" height="h-[356px]" />
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div
			class="relative container grid grid-cols-2 gap-y-8 gap-x-4 p-4 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 mt-8"
		>
			{#each productList as product, index (index)}
				{@const productItem = {
					name: product.title,
					description: product.vendor,
					initialPrice: product.normalPrice,
					discountPrice: product.salePrice,
					discountPercentage: product.percentage ?? 0,
					imageURL: product.image?.url || '',
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
					class="shrink-0 basis-36 md:basis-80 2xl:basis-[19rem] snap-start pb-4"
					{...productItem}
				/>
			{/each}
		</div>

		<div class="container flex items-center gap-2 justify-center pt-6 pb-10">
			<button
				on:click={() => {
					goto(getPrevPageUrl(data?.productPagination), {
						noScroll: true,
						invalidateAll: true
					});
				}}
				disabled={!data?.paginationInfo?.hasPreviousPage || !!$navigating}
				class="disabled:text-gray-300"
			>
				<ArrowLeftSLineArrows size="32" />
			</button>
			{#each paginationFormatter(currentPage, data.productPagination?.length) as pagination, index (index)}
				<button
					on:click={() => {
						goto(data.productPagination[pagination - 1].url, {
							noScroll: true,
							invalidateAll: true
						});
					}}
					id={data.productPagination[pagination - 1]?.url}
					disabled={data.productPagination[pagination - 1]?.isCurrentPage || !!$navigating}
					class:text-black-6={!data.productPagination[pagination - 1]?.isCurrentPage}
					class:bg-brown-05={data.productPagination[pagination - 1]?.isCurrentPage}
					class="w-10 h-10 rounded-lg disabled:text-black-3"
				>
					{pagination}
				</button>
			{/each}
			<button
				on:click={() => {
					goto(getNextPageUrl(data?.productPagination), {
						noScroll: true,
						invalidateAll: true
					});
				}}
				disabled={!data?.paginationInfo?.hasNextPage || !!$navigating}
				class="disabled:text-gray-300 text-3xl"
			>
				<ArrowRightSLineArrows size="32" />
			</button>
		</div>
	{/if}
	{#if data?.recentlyViewed.length > 0}
		<RecentlyViewed products={data.recentlyViewed} />
	{/if}

	{#if data?.bannerPromoted?.banner}
		<div class="container px-4 lg:py-10 lg:h-[440px] overflow-hidden">
			<a href={data.bannerPromoted.link} class="h-full w-full">
				<img
					src={data.bannerPromoted.banner}
					alt=""
					class="h-full w-full object-cover rounded"
					loading="lazy"
				/>
			</a>
		</div>
	{/if}

	{#if data?.faqs}
		<div class="container px-4 pt-10">
			<div class="flex lg:justify-center">
				<Text type="subtitle-1" weight="semibold" color="black-10" variant="h2"
					>MORE ABOUT THIS BRAND</Text
				>
			</div>
			<Accordion flush>
				{#each data.faqs as faq, index (index)}
					<AccordionItem tag="h3">
						<span slot="header">
							<Text type="body-1" weight="semibold">{faq.title.value}</Text>
						</span>
						<Text type="body-1">
							{faq.description.value}
						</Text>
					</AccordionItem>
				{/each}
			</Accordion>
		</div>
	{/if}

	{#if data?.articles && data.articles.length > 0}
		<div class="container pt-10 px-4 pb-10 lg:pt-[60px] lg:pb-[110px]">
			<RelatedArticle articles={data.articles} />
		</div>
	{/if}
</div>
