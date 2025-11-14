<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import FlashSale from '$lib/pages/HomePage/components/FlashSale/FlashSale.svelte';
	import { page } from '$app/stores';

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const ConciergeUrl = `${baseParams}/concierge`;
	export let data;
</script>

<svelte:head>
	<link rel="canonical" href="{$page.url.origin}/{$page.params.store}/{$page.params.lang}/404" />
</svelte:head>

<div class="container max-w-[1600px] text-center md:p-20 p-4 grid">
	<Text type="subtitle-1" weight="semibold" color="black-9">
		SORRY, THIS PAGE IS NO LONGER AVAILABLE
	</Text>
	<div class="max-w-3xl mx-auto mt-4">
		<Text type="body-1">
			This page has either been removed or the item is sold out. You can try to search through a
			variety of pre-order items that might not show on our website
		</Text>
	</div>
	<div class="flex mx-auto gap-4 mt-4">
		<Button variant="primary" href={ConciergeUrl} class="p-4 flex-1 text-center whitespace-nowrap">
			MORE ABOUT PRE-ORDER
		</Button>
		<Button variant="secondary" href={baseParams} class="flex-1 text-center whitespace-nowrap">
			BACK TO HOME
		</Button>
	</div>
</div>
