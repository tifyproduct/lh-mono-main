<script lang="ts">
	import { onMount } from 'svelte';

	import Breadcrumb from '$lib/components/Breadcrumb/Breadcrumb.svelte';
	import Divider from '$lib/components/Divider/Divider.svelte';
	import ProductDescriptions from './components/ProductDescriptions/ProductDescriptions.svelte';

	import ProductDetails from './components/ProductDetails/ProductDetails.svelte';
	import YouMightAlsoLike from './components/YouMightAlsoLike/YouMightAlsoLike.svelte';
	import MoreFromThisBrand from './components/MoreFromThisBrand/MoreFromThisBrand.svelte';
	import Review from './components/Review/Review.svelte';
	import type { BreadcrumbData } from '$lib/types/breadcrumb';

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

	onMount(async () => {
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

		if (data.product.handle) {
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
		}
	});
</script>

<div>
	<div class="px-4">
		<Breadcrumb items={breadcrumbData} />
	</div>

	<div class="mt-4 xl:mt-[55px] px-4 xl:px-0">
		<ProductDetails
			productId={data.product.id}
			productDetailData={data.productDetails}
			wishlisted={data.productDetail.wishlisted}
			{storeLocation}
			customer={data.customer}
			promotions={data.promotions.promotions}
			lang={data.params.lang}
			credentialSoc={data.credentialSoc}
		/>
	</div>

	<div class="block sm:hidden">
		<Divider
			verticalMargin="my-7"
			borderHeight="border-t-8 sm:border-t"
			borderColor="border-white-2 sm:border-black-2"
		/>
	</div>

	<div class="mt-7 xl:mt-9 px-4 xl:px-0">
		<ProductDescriptions productDetailData={data.productDetail} />
	</div>

	{#if isRecommendationsLoading || recommendations.length > 0}
		<div class="mt-[40px] xl:mt-[76px]">
			<YouMightAlsoLike data={recommendations} isLoading={isRecommendationsLoading} />
		</div>
	{/if}

	<div class="mt-[40px] xl:mt-[60px]">
		<Review reviews={data.productReviews} productId={data.product.id} />
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
