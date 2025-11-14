<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';

	import type { MenuPageData } from './types';
	import StandardLayout from './StandardLayout.svelte';
	import BeautyLayout from './BeautyLayout.svelte';

	export let data: Array<MenuPageData> = [];

	let selectedMenu: string = 'Watch'.toUpperCase();

	$: selectedItem = data.find((item) => item.title === selectedMenu);

	$: isBeautySection = selectedItem && selectedItem.title === 'Beauty'.toUpperCase();

	const handleMenuClick = (title: string): void => {
		selectedMenu = title;
	};
</script>

<div>
	<div class="px-4 py-3 lg:px-12 lg:py-5 border-b border-black-1">
		<div class="flex items-center gap-4 overflow-x-auto">
			{#each data as menu}
				<div
					class="cursor-pointer"
					role="presentation"
					on:click={() => handleMenuClick(menu.title)}
				>
					<Text
						type="body-1"
						color={selectedMenu === menu.title ? 'brown-10' : 'black-4'}
						class={`whitespace-nowrap ${
							selectedMenu === menu.title
								? 'underline underline-offset-[5px] decoration-brown-10'
								: ''
						}`}
						weight="semibold"
					>
						{menu.title}
					</Text>
				</div>
			{/each}
		</div>
	</div>

	{#if selectedItem}
		<div class="px-4 pt-3 lg:px-12 lg:pt-5">
			{#if isBeautySection}
				<BeautyLayout data={selectedItem} />
			{:else}
				<StandardLayout data={selectedItem} />
			{/if}
		</div>
	{/if}
</div>

<style>
	::-webkit-scrollbar {
		height: 8px;
	}
</style>
