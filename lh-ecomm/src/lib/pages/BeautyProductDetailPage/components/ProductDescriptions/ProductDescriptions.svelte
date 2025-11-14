<script lang="ts">
	import { Tabs, TabItem } from 'flowbite-svelte';

	import selectedProductStore from '$lib/stores/selectedProductStore';

	import Text from '$lib/components/Text/Text.svelte';

	import type { ProductData } from '$lib/types/product';

	export let productDetailData: ProductData;

	let activeTab = 'descriptions';

	const handleChangeTab = (value: string) => {
		activeTab = value;
	};

	const ingredients = productDetailData?.specifications?.find((item) => item.key === 'ingredients');
	$: parsedIngredients = ingredients && ingredients.value ? JSON.parse(ingredients.value) : [];

	const howToUse = productDetailData?.specifications?.find((item) => item.key === 'how_to_use');
	$: parsedHowToUse = howToUse && howToUse.value ? JSON.parse(howToUse.value) : [];
</script>

<div>
	<Tabs tabStyle="underline" class="flex flex-wrap gap-4 border-none" contentClass="p-0">
		<TabItem
			open
			activeClasses="pb-1 border-b border-brown-10"
			inactiveClasses=""
			on:click={() => handleChangeTab('descriptions')}
		>
			<Text
				type="body-1"
				color={activeTab === 'descriptions' ? 'brown-10' : 'black-4'}
				weight="semibold"
				slot="title"
			>
				Descriptions
			</Text>

			<div class="py-4 pt-6">
				<Text type="body-1" color="black-10">
					{@html productDetailData.descriptionHtml}
				</Text>
				{#if $selectedProductStore?.productExpires}
					<div class="mt-2">
						<Text weight="semibold" type="body-1">Expiry Date :</Text>
						<Text type="body-1">{$selectedProductStore.productExpires}</Text>
					</div>
				{/if}
				{#if $selectedProductStore?.sku}
					<div class="mt-2">
						<Text weight="semibold" type="body-1">SKU :</Text>
						<Text type="body-1">{$selectedProductStore.sku}</Text>
					</div>
				{/if}
			</div>
		</TabItem>
		<TabItem
			activeClasses="pb-1 border-b border-brown-10"
			inactiveClasses=""
			on:click={() => handleChangeTab('ingredients')}
		>
			<Text
				type="body-1"
				color={activeTab === 'ingredients' ? 'brown-10' : 'black-4'}
				weight="semibold"
				slot="title"
			>
				Ingredients
			</Text>
			<div class="py-4 pt-6">
				{#each parsedIngredients as item}
					<Text type="body-1" color="black-10">
						{item}
					</Text>
				{/each}
			</div>
		</TabItem>
		<TabItem
			activeClasses="pb-1 border-b border-brown-10"
			inactiveClasses=""
			on:click={() => handleChangeTab('howToUse')}
		>
			<Text
				type="body-1"
				color={activeTab === 'howToUse' ? 'brown-10' : 'black-4'}
				weight="semibold"
				slot="title"
			>
				How To Use
			</Text>
			<div class="py-4 pt-6">
				{#each parsedHowToUse as item}
					<Text type="body-1" color="black-10">
						{item}
					</Text>
				{/each}
			</div>
		</TabItem>
	</Tabs>
</div>
