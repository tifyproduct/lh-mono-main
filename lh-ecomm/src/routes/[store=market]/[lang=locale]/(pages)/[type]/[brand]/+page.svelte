<script lang="ts">
	import { onMount } from 'svelte';

	import { page } from '$app/stores';

	import CollectionPage from '$lib/pages/CollectionPage/CollectionPage.svelte';

	import type { PageServerData } from './$types';
	import { get } from 'svelte/store';
	import { featureFlagStore } from '$lib/stores/featureFlag';
	import CollectionPageV2 from '$lib/pages/CollectionPage/CollectionPageV2.svelte';

	export let data: PageServerData;

	onMount(() => {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			event: 'view_brand_landing_page',
			utm: {
				campaign: $page.url.searchParams.get('utm_campaign') ?? '',
				medium: $page.url.searchParams.get('utm_medium') ?? '',
				source: $page.url.searchParams.get('utm_source') ?? '',
				term: $page.url.searchParams.get('utm_term') ?? '',
				content: $page.url.searchParams.get('utm_content') ?? ''
			},
			product: {
				category: data.type,
				collection: data.brand.title
			}
		});
	});

	const featureFlags = get(featureFlagStore);
</script>

{#if featureFlags.collectionPageV2}
	<CollectionPageV2 {data} />
{:else}
	<CollectionPage {data} />
{/if}
