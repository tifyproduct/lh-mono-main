<script lang="ts">
	import SellWithUsPage from '$lib/pages/SellWithUsPage/SellWithUsPage.svelte';
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;

	onMount(() => {
		window.dataLayer = window.dataLayer || [];

		window.dataLayer.push({
			event: 'view_page_sell_with_us',
		});
	});
</script>

<SellWithUsPage {data} />
