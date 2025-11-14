<script lang="ts">
	import type { PageServerData } from './$types';
	import HomePage from '$lib/pages/HomePage/HomePage.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let data: PageServerData;

	onMount(() => {
		window.dataLayer = window.dataLayer || [];

		window.dataLayer.push({
			event: 'view_homepage',
			utm: {
				campaign: $page.url.searchParams.get('utm_campaign') ?? '',
				medium: $page.url.searchParams.get('utm_medium') ?? '',
				source: $page.url.searchParams.get('utm_source') ?? '',
				term: $page.url.searchParams.get('utm_term') ?? '',
				content: $page.url.searchParams.get('utm_content') ?? ''
			}
		});
	});
</script>

<HomePage {data} />
