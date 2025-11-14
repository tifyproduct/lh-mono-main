<script lang="ts">
	import { afterUpdate, type SvelteComponent } from 'svelte';

	import { page } from '$app/stores';

	import '$lib/styles/app.css';

	import customerProfileStore from '$lib/stores/customerProfileStore';
	import Header from '$lib/layout/Header.svelte';
	import Footer from '$lib/layout/Footer.svelte';

	import FloatingWhatsappButton from '$lib/components/FloatingWhatsappButton/FloatingWhatsappButton.svelte';

	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;

	import CustomerProfileSidebar from '$lib/pages/CustomerProfile/CustomerProfileSidebar.svelte';
	import CustomerMobileHeader from '$lib/pages/CustomerProfile/components/CustomerMobileHeader/CustomerMobileHeader.svelte';
	import AnnouncementBar from '$lib/components/AnnouncementBar/AnnouncementBar.svelte';

	let header: SvelteComponent;

	afterUpdate(() => {
		if (data?.customer) {
			customerProfileStore.set(data.customer);
		}
	});

	const showLogin: boolean = $page.url.searchParams.get('showLogin') === 'true';

	const generateMobileHeaderTitle = (pageParams: string) => {
		switch (pageParams) {
			case 'customer':
				return 'Account';
			case 'payment-method':
				return 'Payment Method';
			case 'recently-viewed':
				return 'Recently Viewed';
			case 'wishlist':
				return 'Wishlist';
			case 'addresses':
				return 'Shipping Address';
			case 'order-history':
				return 'Order History';
			default:
				return 'Page not found';
		}
	};

	$: pageTitle = generateMobileHeaderTitle($page.url.searchParams.get('page') || 'customer');
</script>

<AnnouncementBar />
<Header
	bind:this={header}
	credentialSoc={data?.credentialSoc}
	withMegaMenu
	hideMegaMenuMobile
	megaMenuData={data?.menu}
	customer={data?.customer}
	cart={data?.cart}
	showLoginPopup={showLogin}
	hideMobileHeader
	isProduction={data.isProduction}
/>

<div class="block lg:hidden">
	<CustomerMobileHeader title={pageTitle} />
</div>

<main>
	<div class="relative lg:flex lg:justify-center lg:py-[50px] gap-[30px] lg:p-[20px] mb-[50px]">
		<div class="relative basis-1/5 border-r border-black-1 hidden lg:block">
			<CustomerProfileSidebar customer={data?.customer} />
		</div>
		<div class="flex flex-col basis-3/5">
			<slot />
		</div>
	</div>
</main>

<Footer footerData={data?.footer} />

<FloatingWhatsappButton customer={data?.customer} />
