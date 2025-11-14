<script lang="ts">
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	import type { SubBrand } from './type';
	import { goto } from '$app/navigation';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';

	const currentPage = get(page);
	export let data: SubBrand[];
	export let collectionType: string;

	let isBrandListPageEnabled = false;

	$: {
		isBrandListPageEnabled = $featureFlagStore.isBrandListPageEnabled;
	}

	const onClickBrand = (brandName: string) => {
		googleAnalClickedEvent('click_brand_name', {
			product: {
				category: collectionType,
				collection: brandName
			}
		});
	};

	const handleViewAllClicked = async () => {
		let category: string;
		const handle = $page.params.handle;

		switch (handle) {
			case 'beauty':
				category = 'beauty';
				break;
			case 'watch':
				category = 'watch';
				break;
			case 'bag':
				category = 'fashion';
				break;
			case 'jewelry':
				category = 'fashion';
				break;
			default:
				category = 'all';
		}

		await goto(`/${$page.params.store}/${$page.params.lang}/brand/${category}`);
	};
</script>

<div class="center pt-10 lg:pt-12">
	<div class="flex lg:justify-center lg:pb-7">
		<Text type="subtitle-1" weight="semibold" color="black-10">EXPLORE BY BRAND</Text>
	</div>
	<div
		class="pt-4 grid justify-center grid-cols-[repeat(auto-fit,_minmax(0,_calc(50%-8px)))] lg:grid-cols-[repeat(auto-fit,_minmax(auto,_calc(16%-8px)))] gap-x-4 gap-y-4"
	>
		{#each data as brand, index}
			<div class="lg:block" class:hidden={index > 5}>
				<a
					href={`${currentPage.url.pathname}/${brand.handle}`}
					class="bg-beige-1 px-12 py-4 h-full flex justify-center items-center text-center rounded"
					on:click={() => onClickBrand(brand.title)}
				>
					<Text color="dark-brown-10" type="body-1" weight="semibold"
						>{brand.title.toUpperCase()}</Text
					>
				</a>
			</div>
		{/each}
	</div>
	{#if isBrandListPageEnabled}
		<div class="flex justify-center mt-8">
			<Button
				class="w-full lg:w-auto"
				padding="py-3 px-20"
				variant="primary"
				onClick={handleViewAllClicked}>VIEW ALL</Button
			>
		</div>
	{/if}
</div>
