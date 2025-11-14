<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import Button from '$lib/components/Button/Button.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import { get } from 'svelte/store';
	const currentPage = get(page);

	const store = currentPage.params.store;

	export let articles;
</script>

<div class="center">
	<div class="flex lg:justify-center lg:pb-3">
		<Text type="subtitle-1" weight="semibold" color="black-10">RELATED ARTICLES</Text>
	</div>
	<div
		class="pt-4 grid justify-center grid-cols-[repeat(auto-fit,_minmax(0,_calc(100%-8px)))] lg:grid-cols-[repeat(auto-fit,_minmax(auto,_calc(50%-16px)))] gap-y-7 lg:gap-x-6 pb-4 lg:pb-8"
	>
		{#each articles.slice(0, 2) as article}
			<a href={article.slug} target="_blank">
				<div class="flex flex-col">
					<img src={article.image} class="aspect-video rounded" alt="" />
					<Text class="line-clamp-2 mt-3 mb-2" type="body-1" weight="semibold"
						>{@html article.title}</Text
					>
					<Text class="line-clamp-2" type="body-2" color="black-7">{@html article.summary}</Text>
				</div>
			</a>
		{/each}
	</div>
	<div class="flex justify-center">
		<Button
			variant="primary"
			onClick={() => {
				window.open(`https://blog.luxehouze.com/${store}`, '_blank');
			}}
			class="w-full lg:w-auto"
			padding="py-3 px-8">READ MORE</Button
		>
	</div>
</div>
