<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { bannerDataStore } from './BannerStore';
	import type { BrandBanner } from './type';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let collectionType: string;

	let isExpanded = false;
	const toggleExpand = () => {
		isExpanded = !isExpanded;

		googleAnalClickedEvent('click_show_more', {
			product: {
				category: collectionType
			}
		});
	};

	export let data: BrandBanner;
	export let descData;

	const currentPage = get(page);

	let descriptionKey = '';
	if (currentPage.params.store === 'id') {
		descriptionKey = 'descriptionId';
	} else if (currentPage.params.store === 'sg') {
		descriptionKey = 'descriptionSg';
	}

	let parsedDescription = '';
	if (descData?.[descriptionKey]) {
		try {
			const parsedJson = JSON.parse(descData[descriptionKey]);
			if (parsedJson?.children && parsedJson.children[0]?.children[0]?.value) {
				parsedDescription = parsedJson.children[0].children[0].value;
			}
		} catch (e) {
			console.error(e);
		}
	}

	$: bannerDataStore.set(data);
</script>

<div class="container flex flex-wrap flex-col lg:flex-row lg:flex-nowrap px-4">
	<div class="flex flex-col lg:mr-8 lg:w-[35%]">
		<Text class="lg:mb-4" type="subtitle-1" weight="semibold" variant="h1">{data?.title}</Text>

		{#if parsedDescription}
			<Text class="lg:mb-2 text-justify" type="body-1" color="black-7">
				<span class:line-clamp-5={!isExpanded}>{parsedDescription}</span>
			</Text>
			<div>
				<Button variant="link" padding="p-0" onClick={toggleExpand}>
					<Text type="body-2" color="beige-10" weight="semibold">
						{isExpanded ? 'Show less' : 'Show more'}
					</Text>
				</Button>
			</div>
		{:else if data.description}
			<Text class="lg:mb-2 text-justify" type="body-1" color="black-7">
				<span class:line-clamp-5={!isExpanded}>{@html data.descriptionHtml}</span>
			</Text>
			<div>
				<Button variant="link" padding="p-0" onClick={toggleExpand}>
					<Text type="body-2" color="beige-10" weight="semibold">
						{isExpanded ? 'Show less' : 'Show more'}
					</Text>
				</Button>
			</div>
		{/if}
	</div>

	{#if data.image}
		<div class="lg:w-[65%] lg:h-[341px] h-[180px] hidden lg:block">
			<img class="mt-2 max-w-[100%] max-h-[100%] object-contain rounded" src={data.image} alt="" />
		</div>
	{/if}
	{#if data?.mobileImage?.url || data.image}
		<div class="lg:w-[65%] lg:h-[341px] lg:hidden">
			<img class="mt-2 w-full h-full rounded" src={data.mobileImage?.url || data.image} alt="" />
		</div>
	{/if}
</div>
