<script lang="ts">
	import { page } from '$app/stores';

	import Page from '$lib/pages/404Page/404Page.svelte';
</script>

<svelte:head>
	<link rel="canonical" href="{$page.url.origin}/{$page.params.store}/{$page.params.lang}/404" />
</svelte:head>

<Page />
