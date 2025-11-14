<script lang="ts">
	import { afterUpdate, type SvelteComponent } from 'svelte';

	import { page } from '$app/stores';

	import '$lib/styles/app.css';

	import customerProfileStore from '$lib/stores/customerProfileStore';
	import Header from '$lib/layout/Header.svelte';
	import Footer from '$lib/layout/Footer.svelte';
	import BottomMenu from '$lib/components/BottomMenu/BottomMenu.svelte';
	import FloatingWhatsappButton from '$lib/components/FloatingWhatsappButton/FloatingWhatsappButton.svelte';
	import { replaceSecondOccurrence } from '$lib/utils/modifyUrlString';

	import type { LayoutServerData } from './$types';
	import AnnouncementBar from '$lib/components/AnnouncementBar/AnnouncementBar.svelte';

	export let data: LayoutServerData;

	let header: SvelteComponent;

	afterUpdate(() => {
		if (data?.customer) {
			customerProfileStore.set(data.customer);
		}
	});

	const handleOnSearchClicked = () => {
		header.handleOnSearchClicked();
	};

	const showLogin: boolean = $page.url.searchParams.get('showLogin') === 'true';
	const baseUrl = 'https://luxehouze.com';
	const canonicalUrl = `${baseUrl}${$page.url.pathname}`;
</script>

<svelte:head>
	{#if $page.params.lang === 'id'}
		<meta name="robots" content="noindex" />
	{/if}
	<link rel="canonical" href={canonicalUrl} />
	<link
		rel="alternate"
		hreflang="x-default"
		href="{$page.url.origin}{replaceSecondOccurrence(
			$page.url.pathname.replace(/^\/[^\/]+/, '/sg'),
			2,
			'en'
		)}"
	/>
	<link
		rel="alternate"
		hreflang="en-ID"
		href="{$page.url.origin}{replaceSecondOccurrence(
			$page.url.pathname.replace(/^\/[^\/]+/, '/id'),
			2,
			'en'
		)}"
	/>
	<link
		rel="alternate"
		hreflang="id-ID"
		href="{$page.url.origin}{replaceSecondOccurrence(
			$page.url.pathname.replace(/^\/[^\/]+/, '/id'),
			2,
			'id'
		)}"
	/>
	<link
		rel="alternate"
		hreflang="en-SG"
		href="{$page.url.origin}{replaceSecondOccurrence(
			$page.url.pathname.replace(/^\/[^\/]+/, '/sg'),
			2,
			'en'
		)}"
	/>
</svelte:head>

<div>
	<AnnouncementBar />
	<Header
		bind:this={header}
		credentialSoc={data.credentialSoc}
		megaMenuData={data.menu}
		customer={data.customer}
		cart={data.cart}
		showLoginPopup={showLogin}
		isProduction={data.isProduction}
	/>

	<main>
		<slot />
	</main>
	<Footer footerData={data.footer} />

	<FloatingWhatsappButton customer={data.customer} />
	<BottomMenu {handleOnSearchClicked} credential={data.credentialSoc} customer={data.customer} />
</div>
