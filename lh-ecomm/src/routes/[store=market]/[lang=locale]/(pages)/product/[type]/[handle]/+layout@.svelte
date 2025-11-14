<script lang="ts">
	import { afterUpdate } from 'svelte';

	import '$lib/styles/app.css';

	import Header from '$lib/layout/Header.svelte';
	import Footer from '$lib/layout/Footer.svelte';

	import PdpBottomMenu from '$lib/pages/ProductDetailPage/components/PDPBottomMenu/PDPBottomMenu.svelte';
	import PdpMobileHeader from '$lib/pages/ProductDetailPage/components/PDPMobileHeader/PDPMobileHeader.svelte';
	import FloatingWhatsappButton from '$lib/components/FloatingWhatsappButton/FloatingWhatsappButton.svelte';
	import BeautyPdpBottomMenu from '$lib/pages/BeautyProductDetailPage/components/BeautyPDPBottomMenu/BeautyPDPBottomMenu.svelte';
	import customerProfileStore from '$lib/stores/customerProfileStore';

	import type { LayoutServerData } from './$types';
	import AnnouncementBar from '$lib/components/AnnouncementBar/AnnouncementBar.svelte';

	export let data: LayoutServerData;

	afterUpdate(() => {
		if (data?.customer) {
			customerProfileStore.set(data.customer);
		}
	});

	$: productType = data.type;
</script>

<svelte:head>
	{#if data.dontIndexPage}
		<meta name="robots" content="noindex" />
	{/if}
</svelte:head>

<div>
	<div>
		<AnnouncementBar />
	</div>

	<Header
		credentialSoc={data.credentialSoc}
		customer={data.customer}
		cart={data.cart}
		isProduction={data.isProduction}
		hideMobileHeader
		withMegaMenu
		hideMegaMenuMobile={true}
		megaMenuData={data.menu}
		isSticky
	/>

	<div class="block lg:hidden sticky top-0 z-20 bg-white-1">
		<PdpMobileHeader cart={data.cart} credential={data.credentialSoc} />
	</div>

	<main>
		<slot />
	</main>

	<Footer footerData={data.footer} />

	<FloatingWhatsappButton customer={data.customer} />

	<div class="sticky xl:hidden bottom-0 z-10">
		{#if productType === 'beauty'}
			<BeautyPdpBottomMenu customer={data.customer} credential={data.credentialSoc} />
		{:else}
			<PdpBottomMenu
				title={data.product.title}
				productType={data.product.productType}
				storeLocation={data.params.store}
				customer={data.customer}
			/>
		{/if}
	</div>
</div>
