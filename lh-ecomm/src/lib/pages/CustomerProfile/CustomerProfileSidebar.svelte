<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import Loading from '$lib/components/Common/Loading.svelte';
	import type { CustomerProfile } from '$lib/types/customer';

	export let customer: CustomerProfile | undefined;
	
	let isLoading = false;
	export let hoverEffect = true;
	export let lineEffect = true;

	let menuItems = [
		{
			label: 'Account',
			icon: '/icons/profile.svg',
			section: 'Account Settings',
			page: 'customer'
		},
		{
			label: 'Shipping Address',
			icon: '/icons/shipping.svg',
			section: 'Account Settings',
			page: 'addresses'
		},
		{
			label: 'Payment Method',
			icon: '/icons/payment.svg',
			section: 'Purchase',
			page: 'payment-method'
		},
		{
			label: 'Recently Viewed',
			icon: '/icons/recently.svg',
			section: 'Purchase',
			page: 'recently-viewed'
		},
		{ 
			label: 'Wishlist',
			icon: '/icons/wishlist.svg',
			section: 'Purchase',
			page: 'wishlist' 
		},
		{
			label: 'Order History',
			icon: '/icons/orderhistory.svg',
			section: 'Purchase',
			page: 'order-history'
		}
	];



	// Get current page params
	const currentPage = get(page);

	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}/profile`;

	async function navigateToPage(pageName: string) {
		await goto(`${baseParams}?page=${pageName}`);
	}

	async function handleLogout() {
		isLoading = true;
		try {
			await fetch('/api/customer/logout', {
				method: 'POST'
			});
			window.location.replace(`/${currentPage.params.store}/${currentPage.params.lang}`);
		} catch (error) {
			console.error('Logout failed:', error);
		}
	}
</script>

<Loading state={isLoading} />

<div class="relative bg-white-1 px-4 w-full h-full left-0 search__wrapper lg:px-0">
	<div class="flex gap-4">
		<div
			class="flex items-center justify-center w-10 h-10 rounded-full bg-dark-brown-10 text-white-1"
		>
			{customer?.firstName ? customer.firstName[0] : ''}
			{customer?.lastName ? customer.lastName[0] : ''}
		</div>
		<div>
			<p class="color-black-9 font-semibold text-sm leading-[22px]">Hi, {customer?.firstName}!</p>
			<p>{customer?.email}</p>
		</div>
	</div>
	<!-- line -->
	{#if !lineEffect}
		<div class="h-px bg-[#E9EBF0] w-full mt-[30px]"></div>
	{/if}
	<!-- end of line -->
	<ul class="py-1">
		{#each ['Account Settings', 'Purchase'] as section}
			<p class="font-medium text-base leading-6 text-[#666975] mt-[30px] mb-[15px]">{section}</p>

			{#each menuItems.filter((item) => item.section === section) as item}
				<li
					role="presentation"
					class="flex items-center gap-3 mb-5 justify-between cursor-pointer {`menu-item ${hoverEffect ? 'hoverable' : ''}`}"
					on:click={() => navigateToPage(item.page)}
				>
					<div class="flex gap-3">
						<img src={item.icon} alt={item.label} />
						<span class="font-normal text-[14px] leading-[22px]">{item.label}</span>
					</div>
					{#if !hoverEffect}
						<img src="/icons/arrow.svg" alt="arrow icon" class="ml-auto" />
					{/if}
				</li>
			{/each}
		{/each}
	</ul>

	<ul class="py-1">
		<li
			role="presentation"
			class="flex items-center gap-3 mb-4 mt-[30px] cursor-pointer"
			on:click={handleLogout}
		>
			<img src="/icons/logout.svg" alt="logout icon" />
			<span class="font-normal text-[14px] leading-[22px] text-[#AD5445]">Sign Out</span>
		</li>
	</ul>
</div>

<style>
	.menu-item {
		padding: 10px;
		background-color: white;
		border-right: 3px solid transparent;
		border-radius: 3px 0 0 3px;
		transition:
			background-color 0.3s,
			border-right-color 0.3s;
	}

	.hoverable:hover {
		background-color: #f9f9f9;
		border-right-color: #333;
	}
</style>
