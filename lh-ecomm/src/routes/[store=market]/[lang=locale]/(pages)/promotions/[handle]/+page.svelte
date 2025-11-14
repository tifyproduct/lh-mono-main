<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import Detail from '$lib/pages/PromotionsPage/Detail.svelte';

	let promotion = $page.data.promotionData;
	let allItems = $page.data.products;
	let title = $page.data.title;

	const currentPage = get(page);
	const store = currentPage.params.store;

	let items = allItems;
	if (store === 'id') {
		items = allItems.filter((item) => item.tagAll.includes('Indonesia'));
	} else {
		items = allItems.filter((item) => item.tagAll.includes('Singapore'));
	}

	items = items.slice(0, 20);
</script>

<div class="container max-w-[1600px]">
	<Detail {promotion} {items} {title} />
</div>
