<script lang="ts">
	import { page } from '$app/stores';
	import { userStore } from '$lib/store';
	import { setContext, onMount } from 'svelte';
	setContext('userStore', userStore);

	export let data;
</script>

<svelte:head>
	<title>{$page.data?.seo?.title}</title>
	<meta name="description" content={$page.data?.seo?.metaDescription} />
</svelte:head>

<slot />
