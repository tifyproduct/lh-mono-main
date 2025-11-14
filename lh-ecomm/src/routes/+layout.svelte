<script lang="ts">
	import { afterNavigate, beforeNavigate, goto } from '$app/navigation';

	import { Toaster } from 'svelte-sonner';

	import NProgress from 'nprogress';
	import 'nprogress/nprogress.css';

	import { queryParamPreserver } from '$lib/utils/queryParams';
	import { previousPage } from '$lib/stores/previousPage';
	import { onDestroy } from 'svelte';
	import { page } from '$app/stores';

	NProgress.configure({
		minimum: 0.16,
		showSpinner: false
	});

	beforeNavigate(async ({ from, to, cancel }) => {
		if (NProgress.isStarted()) {
			return;
		}

		NProgress.start();
		//to preserve query params troughout page
		if (from?.url.search && to) {
			let preservedQueryParams = queryParamPreserver({ from });

			cancel();

			const formattedPreservedQueryParams =
				preservedQueryParams.size > 0 ? `${to?.url.search ? '&' : '?'}${preservedQueryParams}` : '';

			goto(to?.url.pathname + to?.url.search + formattedPreservedQueryParams);
		}
	});

	afterNavigate(async () => {
		NProgress.done();
	});

	let previousUrl: string | null = null;

	const unsubscribe = page.subscribe(($page) => {
		if (previousUrl) {
			previousPage.set(previousUrl);
		}
		previousUrl = $page.url.toString();
	});

	onDestroy(unsubscribe);

	$: isStaging = $page.url.origin.includes('staging');
</script>

<Toaster richColors position="top-right" />

<slot />

<svelte:head>
	{#if isStaging}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<style>
	:global(#nprogress .bar) {
		background: var(--color-beige-10) !important;
		height: 3px !important;
	}
	:global(#nprogress .peg) {
		box-shadow:
			0 0 10px var(--color-beige-7),
			0 0 5px var(--color-beige-7) !important;
	}
</style>
