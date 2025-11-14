<script lang="ts">
	import type { PageServerData } from './$types';

	import ProductDetailPage from '$lib/pages/ProductDetailPage/ProductDetailPage.svelte';
	import BeautyProductDetailPage from '$lib/pages/BeautyProductDetailPage/BeautyProductDetailPage.svelte';

	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { previousPage } from '$lib/stores/previousPage';

	export let data: PageServerData;

	$: productType = data.type;

	let previousUrl: string | null;
	$: {
		previousPage.subscribe((value) => {
			previousUrl = value;
		});
	}

	onMount(() => {
		window.dataLayer = window.dataLayer || [];

		window.dataLayer.push({
			event: 'view_pdp',
			utm: {
				campaign: $page.url.searchParams.get('utm_campaign') ?? '',
				medium: $page.url.searchParams.get('utm_medium') ?? '',
				source: $page.url.searchParams.get('utm_source') ?? '',
				term: $page.url.searchParams.get('utm_term') ?? '',
				content: $page.url.searchParams.get('utm_content') ?? ''
			},
			product: {
				name: data.productDetail.title,
				brand: data.productDetail.vendor,
				category: data.productDetail.type,
				id: data.productDetail.id,
				variantId: data.productDetails[0].id
			},
			previousPage: previousUrl
		});
	});

	const tagsString = data.product.tags.join(' ').toLowerCase();
	$: isTesting = tagsString.includes('testing') || tagsString.includes('freebie');
</script>

<svelte:head>
	<title>{data?.seo?.title}</title>
	<meta name="description" content={data?.seo?.metaDescription} />
	{#if isTesting}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<div class="container my-4 lg:my-10">
	{#if productType === 'beauty'}
		<BeautyProductDetailPage {data} />
	{:else}
		<ProductDetailPage {data} />
	{/if}
</div>
