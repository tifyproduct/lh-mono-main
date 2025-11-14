<script lang="ts">
	import { navigating, page } from '$app/stores';
	import Loading from '$lib/components/Common/Loading.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import { WhatsappFillLogos } from 'svelte-remix';
	import Magnifier from '$lib/assets/page/general/magnifier.svg';
	import Button from '$lib/components/Button/Button.svelte';
	import { redirectToWhatsapp } from '$lib/utils/whatsappRedirect';
	import { STORE } from '$lib/constants.util';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	import type { ShopifyPagination } from '$lib/types/pagination';
	import { toast } from 'svelte-sonner';
	import { paginationFormatter } from '$lib/utils/pagination';

	export let data;

	const country = $page.params.store || STORE.id;
	const baseParams = `/${$page.params.store}/${$page.params.lang}`;

	let isLoading: boolean = false;
	let searchData = data.seachResult ?? null;
	let currentPage = 1;
	let hasPrev = false;
	let hasNext = false;
	let totalPage = data.seachResult.pagination.length;

	$: {
		searchData = data.seachResult ?? null;
	}

	const handleContactUs = () => {
		redirectToWhatsapp({
			customer: $customerProfileStore,
			country,
			baseParams,
			pathname: `${baseParams}/search`
		});
	};

	const handlePageClick = async (pagination: ShopifyPagination) => {
		try {
			isLoading = true;
			const fetchReq = await fetch(pagination.url, {
				method: 'GET'
			});

			const fetchRes = await fetchReq.json();
			currentPage = pagination.pageNumber;

			searchData = fetchRes;

			window.scroll(0, 0);
		} catch (error) {
			toast.error('There is an error occuring please try again');
		} finally {
			isLoading = false;
		}
	};

	const getNextPageUrl = (paginations: ShopifyPagination[] | null) => {
		let nextPage: ShopifyPagination;

		if (paginations) {
			for (const [id, pagination] of paginations.entries()) {
				if (pagination.isCurrentPage) {
					nextPage = paginations[id + 1];
					handlePageClick(nextPage);
					break;
				}
			}
		}
	};

	const getPrevPageUrl = (paginations: ShopifyPagination[] | null) => {
		let prevPage: ShopifyPagination;
		if (paginations) {
			for (const [id, pagination] of paginations.entries()) {
				if (pagination.isCurrentPage) {
					prevPage = paginations[id - 1];
					handlePageClick(prevPage);
					break;
				}
			}
		}
	};

	$: {
		if (currentPage == 1) {
			hasPrev = false;
		}
		if (currentPage < totalPage) {
			hasNext = true;
		}
		if (currentPage != 1 && totalPage > 1) {
			hasPrev = true;
		}
		if (currentPage == totalPage) {
			hasNext = false;
		}
	}
</script>

<svelte:head>
	<meta name="robots" content="noindex" />
</svelte:head>

<div class="container lg:mt-10 max-lg:px-4">
	<Text type="subtitle-1" weight="semibold">
		{searchData?.total < 19 ? searchData?.data.length : searchData?.total} Result for "{$page?.url?.searchParams?.get(
			'keyword'
		)}"
	</Text>
	{#if searchData.data.length > 0}
		<div
			class="relative container grid grid-cols-2 gap-y-8 gap-x-4 p-4 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 mt-8"
		>
			<Loading state={!!$navigating || isLoading} />
			{#each searchData.data as product, index (index)}
				{@const productItem = {
					name: product.title,
					description: product.vendor,
					initialPrice: product.normalPrice,
					discountPrice: product.salePrice,
					discountPercentage: product.percentage ?? 0,
					imageURL: product.image?.url || '',
					tags: product.tags,
					tagAll: product.tagAll,
					imageHeight: 'h-[300px] h-[204px]',
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
					getPrevPageUrl(searchData.pagination),
						{
							noScroll: true,
							invalidateAll: true
						};
				}}
				disabled={!hasPrev || !!$navigating}
				class="disabled:text-gray-300"
			>
				<ArrowLeftSLineArrows size="32" />
			</button>
			{#each paginationFormatter(currentPage, searchData.pagination?.length) as pagination, index (index)}
				<button
					on:click={() => {
						handlePageClick(searchData.pagination[pagination - 1]);
					}}
					id={searchData.pagination[pagination - 1]?.url}
					disabled={searchData.pagination[pagination - 1]?.isCurrentPage || !!$navigating}
					class:text-black-6={!searchData.pagination[pagination - 1]?.isCurrentPage}
					class:bg-brown-05={searchData.pagination[pagination - 1]?.isCurrentPage}
					class="w-10 h-10 rounded-lg disabled:text-black-3"
				>
					{pagination}
				</button>
			{/each}
			<button
				on:click={() => {
					getNextPageUrl(searchData.pagination),
						{
							noScroll: true,
							invalidateAll: true
						};
				}}
				disabled={!hasNext || !!$navigating}
				class="disabled:text-gray-300 text-3xl"
			>
				<ArrowRightSLineArrows size="32" />
			</button>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center max-lg:min-h-[70vh] min-h-[60vh] h-full">
			<img src={Magnifier} alt="magnifier-illustration-no-order" class="mb-10" />
			<Text type="subtitle-3" weight="semibold" color="black-9">No result</Text>
			<Text type="body-2" color="black-6" class="mt-2 mb-10 lg:w-1/2 text-center">
				But don't give up – you can Preorder your items through our WhatsApp
			</Text>
			<Button onClick={handleContactUs} variant="secondary">
				<Text type="body-1" class="mr-1" weight="semibold" color="dark-brown-10">CONTACT US</Text>
				<WhatsappFillLogos size={16} />
			</Button>
		</div>
	{/if}
</div>
