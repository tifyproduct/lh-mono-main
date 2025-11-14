<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	import { BottomNav, BottomNavItem } from 'flowbite-svelte';
	import {
		AccountCircleLineUserFaces,
		HandCoinLineFinance,
		Home3LineBuildings,
		LayoutGridFillDesign,
		SearchLineSystem
	} from 'svelte-remix';
	import type { CustomerProfile } from '$lib/types/customer';
	import Text from '$lib/components/Text/Text.svelte';
	import AuthenticationModal from '$lib/components/AuthenticationModal/AuthenticationModal.svelte';
	import { showAuthenticationModal } from '$lib/stores/authentication';
	import AuthenticationTab from '../AuthenticationModal/AuthenticationTab.svelte';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';

	export let customer: CustomerProfile | undefined;
	export let credential;

	let isNewLoginEnabled: boolean;
	$: {
		isNewLoginEnabled = $featureFlagStore.isNewLoginEnabled;
	}

	let showModal = false;

	const closeModal = () => {
		showModal = false;
	};

	const closeAuthentication = () => {
		$showAuthenticationModal = false;
	};

	const closeAuthenticationSuccess = () => {
		$showAuthenticationModal = false;
		window.location.reload();
	};

	export let alwaysShow: boolean = false;

	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	const isActive = (path: string): boolean => {
		const currentPath = `${currentPage.url.pathname}`;
		let targetPath = `${baseParams}`;
		if (path) {
			targetPath = `${baseParams}/${path}`;
		}
		return currentPath === targetPath;
	};

	async function handleProfileClick() {
		if (customer?.isLoggedIn) {
			await goto(`${baseParams}/pages/customer-profile-mobile`);
		} else {
			if (isNewLoginEnabled) {
				showModal = true;
			} else {
				$showAuthenticationModal = true;
			}
		}
	}

	export let handleOnSearchClicked: any;
</script>

<BottomNav
	position="sticky"
	classInner="grid-cols-5 bg-white"
	classOuter={`w-full z-20 border-gray-200 bg-white-1 block ${!alwaysShow ? 'lg:hidden' : ''}`}
>
	<BottomNavItem btnClass={'px-0'} on:click={() => goto(baseParams)}>
		<Home3LineBuildings class={`${isActive('') ? 'text-brown-10' : 'text-black-4'}`} />
		<Text type="caption-2" color={`${isActive('') ? 'brown-10' : 'black-4'}`} weight="semibold"
			>Home</Text
		>
	</BottomNavItem>

	<BottomNavItem btnClass="px-0">
		<SearchLineSystem
			class={`${isActive('search') ? 'text-brown-10' : 'text-black-4'}`}
			on:click={handleOnSearchClicked}
		/>
		<Text
			type="caption-2"
			color={`${isActive('search') ? 'brown-10' : 'black-4'}`}
			weight="semibold">Search</Text
		>
	</BottomNavItem>

	<BottomNavItem btnClass="px-0" on:click={() => goto(`${baseParams}/pages/menu`)}>
		<LayoutGridFillDesign class={`${isActive('pages/menu') ? 'text-brown-10' : 'text-black-4'}`} />
		<Text
			type="caption-2"
			color={`${isActive('pages/menu') ? 'brown-10' : 'black-4'}`}
			weight="semibold">Menu</Text
		>
	</BottomNavItem>

	<BottomNavItem btnClass="px-0" on:click={() => goto(`${baseParams}/sell-with-us`)}>
		<HandCoinLineFinance class={`${isActive('sell-with-us') ? 'text-brown-10' : 'text-black-4'}`} />
		<Text
			type="caption-2"
			color={`${isActive('sell-with-us') ? 'brown-10' : 'black-4'}`}
			weight="semibold">Sell Your Item</Text
		>
	</BottomNavItem>

	<BottomNavItem btnClass="px-0" on:click={handleProfileClick}>
		<AccountCircleLineUserFaces
			class={`${isActive('profile') ? 'text-brown-10' : 'text-black-4'}`}
		/>
		<Text
			type="caption-2"
			color={`${isActive('profile') ? 'brown-10' : 'black-4'}`}
			weight="semibold">Profile</Text
		>
	</BottomNavItem>
</BottomNav>

{#if $showAuthenticationModal && !customer?.isLoggedIn}
	<AuthenticationModal
		credentialSoc={credential}
		on:close={closeAuthentication}
		on:close-success={closeAuthenticationSuccess}
	/>
{/if}

{#if showModal && !customer?.isLoggedIn}
	<AuthenticationTab bind:isModalOpen={showModal} on:closeModal={closeModal} />
{/if}
