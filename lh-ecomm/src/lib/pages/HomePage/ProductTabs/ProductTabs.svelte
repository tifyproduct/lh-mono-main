<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import { createEventDispatcher } from 'svelte';

	export let tabTitle: string[];

	let activeTab: number = 0;

	const dispatch = createEventDispatcher();

	const setActiveTab = (idx: number) => {
		dispatch('tab-changed', idx);
		activeTab = idx;
	};
</script>

<div class="product-tabs__wrapper">
	<div
		class="no-scrollbar product-tabs grid grid-flow-col auto-cols-max justify-start md:justify-center snap-x gap-2 pb-3 snap-x overflow-x-scroll"
	>
		{#each tabTitle as title, index}
			<button
				class="min-w-[120px] md:min-w-[140px] snap-start product-tab px-3 py-2 md:py-2 md:px-4 border border-black-1 rounded"
				class:product-tab--active={activeTab == index}
				on:click={() => setActiveTab(index)}
			>
				<Text color="dark-brown-10" weight="regular" type="body-2">{title.toUpperCase()}</Text>
			</button>
		{/each}
	</div>
	<div class="product-tab__content">
		<slot />
	</div>
</div>

<style>
	.product-tab--active {
		background-color: var(--color-dark-brown-05);
		border-color: var(--color-dark-brown-10);
	}
</style>
