<script lang="ts">
	import { onMount, afterUpdate } from 'svelte';

	import Breadcrumb from '$lib/components/Breadcrumb/Breadcrumb.svelte';
	import GoogleReviews from '$lib/components/GoogleReviews/GoogleReviews.svelte';
	import type { BreadcrumbData } from '$lib/types/breadcrumb';

	import ProductDetails from './components/ProductDetails/ProductDetails.svelte';
	import YouMightAlsoLike from './components/YouMightAlsoLike/YouMightAlsoLike.svelte';
	import MoreFromThisBrand from './components/MoreFromThisBrand/MoreFromThisBrand.svelte';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';

	export let data;

	const storeLocation = data.params.store;
	const lang = data.params.lang;

	$: breadcrumbData = data.breadcrumbs.map((breadcrumb: BreadcrumbData) => {
		return {
			label: breadcrumb.title,
			href: `${breadcrumb.url}`
		};
	});

	let recommendations: any[] = [];
	let isRecommendationsLoading = true;

	let moreFromThisBrand: any[] = [];
	let isMoreFromThisBrandLoading = true;
	let isPdpYouMightMoreBrandEnabled: boolean;

	$: {
		isPdpYouMightMoreBrandEnabled = $featureFlagStore.isPdpYouMightMoreBrandEnabled;
	}

	let currentProductHandle = data.product.handle;

	const fetchProductData = async () => {
		if (data?.customer?.id) {
			try {
				await fetch('/api/recently-viewed', {
					method: 'PUT',
					body: JSON.stringify({
						productID: data.product.id,
						store: storeLocation
					})
				});
			} catch (error) {
				console.error('Failed to update recently viewed:', error);
			}
		}

		if (data.product.handle && isPdpYouMightMoreBrandEnabled) {
			try {
				const recommendationsRes = await fetch(
					`/api/products/${data.product.handle}/might-also-like?store=${storeLocation}&lang=${lang}&customerId=${data.customer?.id}`
				);
				recommendations = await recommendationsRes.json();
			} catch (error) {
				console.error('Failed to fetch recommendations:', error);
			} finally {
				isRecommendationsLoading = false;
			}

			try {
				const moreFromThisBrandRes = await fetch(
					`/api/products/${data.product.handle}/more-from-brand?store=${storeLocation}&lang=${lang}&customerId=${data.customer?.id}`
				);
				moreFromThisBrand = await moreFromThisBrandRes.json();
			} catch (error) {
				console.error('Failed to fetch more from this brand:', error);
			} finally {
				isMoreFromThisBrandLoading = false;
			}
		} else {
			try {
				moreFromThisBrand = data.productBrand.products;
				recommendations = data.recommendations;
			} catch (error) {
				console.error('Internal Server Error', error);
			} finally {
				isMoreFromThisBrandLoading = false;
				isRecommendationsLoading = false;
			}
		}
	};

	onMount(fetchProductData);

	afterUpdate(() => {
		if (currentProductHandle !== data.product.handle) {
			currentProductHandle = data.product.handle;
			fetchProductData();
		}
	});
</script>

<div>
	<div class="px-4">
		<Breadcrumb items={breadcrumbData} />
	</div>

	<div class="mt-4 xl:mt-[55px] px-4 xl:px-0">
		<ProductDetails
			customer={data.customer}
			productId={data.product.id}
			productType={data.product.productType}
			productDetailData={data.productDetails}
			wishlisted={data.productDetail.wishlisted}
			{storeLocation}
			{lang}
			url={data.productDetail.url}
		/>
	</div>

	{#if isRecommendationsLoading || recommendations.length > 0}
		<div class="mt-[40px] xl:mt-[76px]">
			<YouMightAlsoLike data={recommendations} isLoading={isRecommendationsLoading} />
		</div>
	{/if}

	<div class="mt-[40px] xl:mt-[60px]">
		<GoogleReviews review={data.googleReview} />
	</div>

	{#if isMoreFromThisBrandLoading || moreFromThisBrand.length > 0}
		<div class="mt-[40px] xl:mt-[60px] mb-[60px] xl:mb-[120px]">
			<MoreFromThisBrand
				href={data.productBrand.handle}
				data={moreFromThisBrand}
				isLoading={isMoreFromThisBrandLoading}
			/>
		</div>
	{/if}
</div>
