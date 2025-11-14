<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';

	import type { MegaMenuData } from './types';
	import BeautyLayout from './BeautyLayout.svelte';
	import StandardLayout from './StandardLayout.svelte';

	export let data: Array<MegaMenuData> = [];

	let selectedMenu: string = '';

	$: selectedItem = data.find((item) => item.title === selectedMenu && item.haveSubs);

	$: isBeautySection = selectedItem && selectedItem.title.toUpperCase() === 'Beauty'.toUpperCase();

	let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

	const handleMenuHover = (title: string): void => {
		if (window.innerWidth > 1024) {
			selectedMenu = title;
		}
	};

	const resetSelectedMenu = (): void => {
		selectedMenu = '';
	};
</script>

<nav on:mouseleave={resetSelectedMenu} data-sveltekit-preload-data="false">
	<div
		class="flex items-center py-0 lg:py-0 px-4 lg:px-0 justify-left sm:justify-center h-[46px] overflow-x-auto border-b border-black-2"
	>
		<div class="flex gap-4 md:gap-8 lg:gap-16">
			{#each data as item}
				<div
					class="cursor-pointer"
					role="presentation"
					on:mouseenter={() => {
						if (hoverTimeout) clearTimeout(hoverTimeout);
						hoverTimeout = setTimeout(() => {
							handleMenuHover(item.title);
						}, 250);
					}}
					on:mouseleave={() => {
						if (hoverTimeout) clearTimeout(hoverTimeout);
					}}
				>
					<a href={item.url} on:click={() => resetSelectedMenu()} class="whitespace-nowrap">
						<Text
							type="body-2"
							color={selectedMenu === item.title ? 'black-6' : 'black-4'}
							weight="semibold"
						>
							{item.title.toUpperCase()}
						</Text>
					</a>
				</div>
			{/each}
		</div>
	</div>

	{#if selectedItem}
		<div class="mega-menu bg-white-1 px-4 z-[50]">
			{#if isBeautySection}
				<BeautyLayout
					data={selectedItem}
					on:close-navbar={() => {
						handleMenuHover('');
					}}
				/>
			{:else}
				<StandardLayout
					data={selectedItem}
					on:close-navbar={() => {
						handleMenuHover('');
					}}
				/>
			{/if}
		</div>
		<div role="presentation" class="relative z-40" on:mouseenter={resetSelectedMenu}>
			<div class="absolute top-0 h-[100vh] w-full bg-[rgb(36,37,43,0.7)]"></div>
		</div>
	{/if}
</nav>

<style>
	.mega-menu {
		position: absolute;
		width: 100vw;
		box-shadow: 0px 12px 32px -16px rgba(0, 0, 0, 0.16);
		box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.16);
	}
</style>
