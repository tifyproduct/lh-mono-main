<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import Loading from '$lib/components/Common/Loading.svelte';
	import type { CustomerProfile } from '$lib/types/customer';

	export let customer: CustomerProfile | undefined;
	let isLoading = false;
	let showMenu = false;
	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	function showProfileMenu() {
		showMenu = !showMenu;
	}

	async function logout() {
		await fetch('/api/customer/logout', {
			method: 'POST'
		});

		isLoading = true;

		if (currentPage.url.pathname.includes('profile') || currentPage.url.pathname.includes('cart')) {
			window.location.replace(`${baseParams}/`);
		} else {
			window.location.reload();
		}
	}
</script>

{#if isLoading}
	<Loading state={isLoading} />
{:else}
	<div class="relative flex justify-center items-center gap-1 cursor-pointer">
		<div
			class="flex items-center justify-center w-10 h-10 rounded-full bg-dark-brown-10 text-white-1"
		>
			{customer?.firstName?.[0]}{customer?.lastName ? customer.lastName[0] : ''}
		</div>
		<svg
			class="arrow-icon m-0 cursor-pointer"
			width="15"
			height="10"
			viewBox="0 0 10 6"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			on:click={showProfileMenu}
		>
			<path
				d="M4.99999 3.78132L8.29999 0.481323L9.24266 1.42399L4.99999 5.66666L0.757324 1.42399L1.69999 0.481323L4.99999 3.78132Z"
				fill="#302B29"
			/>
		</svg>

		{#if showMenu}
			<div
				class="absolute bg-white-1 top-[60px] border border-light-gray shadow-lg z-20 p-4"
				style="min-width: 300px;"
			>
				<ul class="py-1">
					<li class=" flex gap-4">
						<div
							class="flex items-center justify-center w-10 h-10 rounded-full bg-dark-brown-10 text-white-1"
						>
							{customer?.firstName?.[0]}{customer?.lastName ? customer.lastName[0] : ''}
						</div>
						<div>
							<p class=" color-black-9 font-semibold text-sm leading-[22px]">
								Hi, {customer?.firstName}!
							</p>
							<p>{customer?.email}</p>
						</div>
					</li>

					<div class="h-px bg-[#E9EBF0] w-full my-5"></div>

					<li role="presentation">
						<a
							class="flex items-center gap-3 mb-5 cursor-pointer"
							href={`${baseParams}/profile`}
							on:click={() => (showMenu = false)}
						>
							<img src="/icons/profile.svg" alt="profile icon" />
							<span class=" text-sm leading-[22px]">See Profile</span>
						</a>
					</li>
					<a href={`${baseParams}/profile?page=order-history`} on:click={() => (showMenu = false)}>
						<li class="flex items-center gap-3 mb-5 cursor-pointer">
							<img src="/icons/orderhistory.svg" alt="profile icon" />
							<span class=" text-sm leading-[22px]">Order History</span>
						</li>
					</a>

					<li role="presentation" class="flex items-center gap-3 cursor-pointer" on:click={logout}>
						<img src="/icons/logout.svg" alt="profile icon" />
						<span class="text-sm leading-[22px] text-[#AD5445]">Logout</span>
					</li>
				</ul>
			</div>
		{/if}
	</div>
{/if}
