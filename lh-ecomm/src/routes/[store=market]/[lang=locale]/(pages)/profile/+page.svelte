<script lang="ts">
	import { page } from '$app/stores';
	import CustomerPage from '$lib/pages/CustomerProfile/Customer/CustomerPage.svelte';
	import PaymentMethodPage from '$lib/pages/CustomerProfile/PaymentMethod/PaymentMethodPage.svelte';
	import ShippingAddressPage from '$lib/pages/CustomerProfile/ShippingAddress/ShippingAddressPage.svelte';
	import OrderHistoryPage from '$lib/pages/CustomerProfile/OrderHistoryPage/OrderHistoryPage.svelte';
	import Wishlist from '$lib/pages/CustomerProfile/Wishlist/Wishlist.svelte';
	import RecentlyViewedPage from '$lib/pages/CustomerProfile/RecentlyViewed/RecentlyViewedPage.svelte';

	export let data;

	$: currentPage = $page.url.searchParams.get('page') || 'customer';
</script>

<!-- Render the appropriate page component based on the `page` query parameter -->
{#if currentPage === 'customer'}
	<CustomerPage customerData={data.customer} />
{:else if currentPage === 'payment-method'}
	<PaymentMethodPage />
{:else if currentPage === 'recently-viewed'}
	<RecentlyViewedPage />
{:else if currentPage === 'wishlist'}
	<Wishlist />
{:else if currentPage === 'addresses'}
	<ShippingAddressPage
		store={data.params.store}
		addressData={data.address}
		regions={data.regions}
	/>
{:else if currentPage === 'order-history'}
	<OrderHistoryPage />
{:else}
	<p>Page not found</p>
{/if}
