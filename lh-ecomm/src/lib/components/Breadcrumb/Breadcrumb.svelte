<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	import { ArrowRightSLineArrows } from 'svelte-remix';
	import Text from '$lib/components/Text/Text.svelte';
	import { breadcrumbStore } from './Breadcrumb';
	import type { BreadcrumbProps } from 'flowbite-svelte/Breadcrumb.svelte';
	import { onDestroy } from 'svelte';

	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	export let items: BreadcrumbProps[] = [];

	let breadcrumb: BreadcrumbProps[];

	$: {
		breadcrumb = [
			{
				label: 'Home',
				href: ''
			},
			...items
		];
	}

	$: breadcrumbStore.set(items);

	onDestroy(() => {
		$breadcrumbStore = [];
	});
</script>

<div class="flex items-center gap-1 text-gray-600 lg:px-4">
	{#each breadcrumb as item, index (index)}
		<a
			href={`${baseParams}${item.href}`}
			class={`cursor-pointer 
				${item.label.length > 7 ? 'truncate' : ''}
			`}
		>
			<Text type="body-1" color="black-10">
				{item.label}
			</Text>
		</a>

		{#if index < breadcrumb.length - 1}
			<ArrowRightSLineArrows size={20} />
		{/if}
	{/each}
</div>
