<script lang="ts">
	import Navbar from '$lib/components/Navbar/Navbar.svelte';
	import MegaMenu from '$lib/components/MegaMenu/MegaMenu.svelte';
	import { onMount, type SvelteComponent } from 'svelte';
	import type { CustomerProfile } from '$lib/types/customer';

	export let withMegaMenu: Boolean = true;
	export let withSearch: Boolean = true;
	export let withCart: boolean = true;
	export let isProduction: boolean = false;
	export let cart;

	export let megaMenuData;
	export let customer: CustomerProfile | undefined;
	export let credentialSoc;

	export let showLoginPopup: boolean = false;
	export let hideMobileHeader: boolean = false;
	export let hideMegaMenuMobile: boolean = false;
	export let lhShowGoogleLogin: boolean = false;

	export let isSticky: boolean = true;

	let navbar: SvelteComponent;

	export const handleOnCancelSearch = () => {
		navbar.handleOnCancelSearch();
	};

	export const handleOnSearchClicked = () => {
		navbar.handleOnSearchClicked();
	};

	let isMobile: boolean = true;

	onMount(() => {
		const updateIsMobile = () => {
			isMobile = window.innerWidth <= 1024;
		};

		updateIsMobile();

		window.addEventListener('resize', updateIsMobile);

		return () => {
			window.removeEventListener('resize', updateIsMobile);
		};
	});
</script>

<header class={isSticky ? 'sticky top-0 z-[50]' : ''} style="background-color: white !important">
	<div>
		<Navbar
			{withCart}
			{cart}
			bind:this={navbar}
			{withSearch}
			{customer}
			credential={credentialSoc}
			{showLoginPopup}
			{hideMobileHeader}
			{isProduction}
			showGoogleLogin={lhShowGoogleLogin}
		/>
	</div>

	{#if withMegaMenu && (!hideMegaMenuMobile || !isMobile)}
		<MegaMenu data={megaMenuData} />
	{/if}
</header>
