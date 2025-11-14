<script lang="ts">
	import { onMount } from 'svelte';
	import { navigating, page } from '$app/stores';
	import { disableScrollHandling, goto } from '$app/navigation';
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';
	import SubBrandCarousel from '$lib/pages/CollectionPage/components/SubBrandCarousel/SubBrandCarousel.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import RelatedArticle from '$lib/components/RelatedArticle/RelatedArticle.svelte';
	import Breadcrumb from '$lib/components/Breadcrumb/Breadcrumb.svelte';
	import BrandBanner from '$lib/pages/CollectionPage/components/BrandBanner/BrandBanner.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import RecentlyViewed from '$lib/components/RecentlyViewed/RecentlyViewed.svelte';
	import type { ProductData } from '$lib/types/product';
	import { paginationFormatter } from '$lib/utils/pagination';
	import type { BreadcrumbProps } from '$lib/types/breadcrumb';
	import Skeleton from '$lib/components/Skeleton/Skeleton.svelte';
	import CollectionFilterV2 from '$lib/components/CollectionFilter/CollectionFilterV2.svelte';
	import { decodeFilterParams } from '$lib/utils/modifyUrlString';

	export let data;

	let isLoading: boolean = false;

	let productList: ProductData[] = [];
	let totalPage = 0;

	let filters: any[] = [];
	let sorts: any[] = [];

	let currentPage = 1;

	let initialLoad = true;

	const fetchList = async (page: number) => {
		isLoading = true;

		try {
			let url = `/api/collections/${data.handle}`;

			const filterParams = $page.url.searchParams.get('filters');

			const sortKey = $page.url.searchParams.get('sortKey');
			const sortValue = $page.url.searchParams.get('sortValue');

			const requestBody = {
				store: data.params.store,
				lang: data.params.lang,
				page,
				pageSize: 18,
				filter: [] as Array<{
					field: string;
					relation: string;
					value: string;
				}>,
				sort: [] as Array<{ field: string; value: string }>
			};

			if (filterParams) {
				const decodedFilters = decodeFilterParams(filterParams);

				requestBody.filter = JSON.parse(decodedFilters);
			}

			if (sortKey && sortValue) {
				requestBody.sort = [
					{
						field: sortKey,
						value: sortValue
					}
				];
			}

			await fetch(url, {
				method: 'POST',
				body: JSON.stringify(requestBody)
			}).then(async (response) => {
				const resp = await response.json();

				productList = resp.items;
				totalPage = resp.totalPage;
			});
		} catch (error) {
			console.error('Failed to fetch collections data:', error);
		} finally {
			isLoading = false;
		}
	};

	const fetchFilters = async () => {
		try {
			const url = `/api/collections/filter/${data.handle}`;
			await fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					store: data.params.store,
					lang: data.params.lang
				})
			}).then(async (response) => {
				const resp = await response.json();

				filters = resp.filter;
				sorts = resp.sort;
			});
		} catch (error) {
			console.error('Failed to fetch filters:', error);
		}
	};

	let previousPath = '';
	let previousParams = '';

	const resetFilter = () => {
		filters = [];
		sorts = [];
		currentPage = 1;
		productList = [];
		totalPage = 0;
	};

	onMount(async () => {
		const pageParam = $page.url.searchParams.get('page');

		currentPage = parseInt(pageParam || '1');

		if (pageParam && currentPage > 1) {
			$page.url.searchParams.set('page', pageParam);
			goto(`${$page.url.pathname}?${$page.url.searchParams.toString()}`, {
				noScroll: true,
				keepFocus: true
			});
		}

		await Promise.all([fetchList(currentPage), fetchFilters()]);

		previousPath = $page.url.pathname;
		previousParams = $page.url.searchParams.toString();
		initialLoad = false;
	});

	$: {
		if (!initialLoad) {
			const urlParams = $page.url.searchParams;
			const currentParams = urlParams.toString();
			const currentPath = $page.url.pathname;

			const pageParam = $page.url.searchParams.get('page');

			if (previousPath !== currentPath || previousParams !== currentParams) {
				if (previousPath !== currentPath) {
					resetFilter();
				}

				// Update currentPage based on pageParam
				currentPage = parseInt(pageParam || '1');

				fetchList(currentPage);
				fetchFilters();
				previousPath = currentPath;
				previousParams = currentParams;
			}
		}
	}

	let breadcrumbData: BreadcrumbProps[];

	$: {
		breadcrumbData = data.breadcrumbs.map((breadcrumb) => {
			return {
				label: breadcrumb?.title ?? '',
				href: `${breadcrumb?.url ?? ''}`
			};
		});
	}

	const handlePrevPage = () => {
		if (currentPage > 1) {
			fetchList(currentPage - 1);
			currentPage -= 1;
			$page.url.searchParams.set('page', currentPage.toString());
			disableScrollHandling();
			goto(`${$page.url.pathname}?${$page.url.searchParams.toString()}`, {
				noScroll: true,
				keepFocus: true
			});
		}
	};

	const handlePageClick = (page: number) => {
		currentPage = page;
		$page.url.searchParams.set('page', page.toString());
		disableScrollHandling();
		goto(`${$page.url.pathname}?${$page.url.searchParams.toString()}`, {
			noScroll: true,
			keepFocus: true
		});
	};

	const handleNextPage = () => {
		if (currentPage < totalPage) {
			currentPage += 1;
			$page.url.searchParams.set('page', currentPage.toString());
			disableScrollHandling();
			goto(`${$page.url.pathname}?${$page.url.searchParams.toString()}`, {
				noScroll: true,
				keepFocus: true
			});
		}
	};
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
			<CollectionFilterV2 {filters} {sorts} collectionType={data.type} />
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
				on:click={handlePrevPage}
				disabled={currentPage <= 1 || !!$navigating}
				class="disabled:text-gray-300"
			>
				<ArrowLeftSLineArrows size="32" />
			</button>

			{#each paginationFormatter(currentPage, totalPage) as page}
				{#if page === '...'}
					<span class="px-2">...</span>
				{:else}
					<button
						on:click={() => handlePageClick(Number(page))}
						disabled={page === currentPage || !!$navigating}
						class="w-10 h-10 rounded-lg"
						class:text-black-6={page !== currentPage}
						class:bg-brown-05={page === currentPage}
						class:disabled:text-black-3={!!$navigating}
					>
						{page}
					</button>
				{/if}
			{/each}

			<button
				on:click={handleNextPage}
				disabled={currentPage >= totalPage || !!$navigating}
				class="disabled:text-gray-300"
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
