<script lang="ts">
	import { onMount } from 'svelte';

	import CartPage from '$lib/pages/CartPage/CartPage.svelte';

	import type { PageServerData } from './$types';
	export let data: PageServerData;

	onMount(() => {
		window.dataLayer = window.dataLayer || [];

		window.dataLayer.push({
			event: 'view_page_cart'
		});
	});
</script>

<CartPage {data} />
