<script lang="ts">
	import '$lib/styles/app.css';

	import Header from '$lib/layout/Header.svelte';

	import BottomMenu from '$lib/components/BottomMenu/BottomMenu.svelte';
	import type { SvelteComponent } from 'svelte';
	import type { LayoutServerData } from './$types';
	import { page } from '$app/stores';
	import AnnouncementBar from '$lib/components/AnnouncementBar/AnnouncementBar.svelte';

	export let data: LayoutServerData;

	let header: SvelteComponent;

	const handleOnSearchClicked = () => {
		header.handleOnSearchClicked();
	};

	const showLogin: boolean = $page.url.searchParams.get('showLogin') === 'true';
</script>

<div class="custom-height relative">
	<AnnouncementBar />

	<Header
		bind:this={header}
		withMegaMenu={false}
		withSearch={false}
		megaMenuData={[]}
		isProduction={data.isProduction}
		credentialSoc={data.credentialSoc}
		customer={data.customer}
		cart={data.cart}
		showLoginPopup={showLogin}
		isSticky={false}
	/>

	<main>
		<slot />
	</main>
</div>

<BottomMenu
	{handleOnSearchClicked}
	credential={data.credentialSoc}
	alwaysShow
	customer={data.customer}
/>

<style>
	.custom-height {
		min-height: calc(100vh - 4rem);
	}
</style>
