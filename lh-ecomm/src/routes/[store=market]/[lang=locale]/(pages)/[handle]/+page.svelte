<script lang="ts">
	import { onMount } from 'svelte';

	import { page } from '$app/stores';

	import CollectionLandingPage from '$lib/pages/CollectionLandingPage/CollectionLandingPage.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			event: 'view_landing_page',
			utm: {
				campaign: $page.url.searchParams.get('utm_campaign') ?? '',
				medium: $page.url.searchParams.get('utm_medium') ?? '',
				source: $page.url.searchParams.get('utm_source') ?? '',
				term: $page.url.searchParams.get('utm_term') ?? '',
				content: $page.url.searchParams.get('utm_content') ?? ''
			},
			product: {
				category: data.type
			}
		});
	});
</script>

<CollectionLandingPage {data} />
