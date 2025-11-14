<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Related from '$lib/pages/PromotionsPage/components/Related/Related.svelte';
	import { CircleFillDesign } from 'svelte-remix';

	const terms = [
		'This promotion is available only for every purchase of ready-stock  Rubber B watch straps.',
		'This promotion is ongoing and has no time limit.',
		'This promotion is applicable to both online and offline transactions.',
		'This promotion can be combined with other promotions.',
		'Purchases made with this promotion cannot be converted into Luxehouze Loyalty Points.',
		'Luxehouze has the right to change/discontinue the promotion at any time without prior/further notice.'
	];

	export let data;
</script>

<div class="container max-w-[1600px] md:p-20 p-4">
	<div class="max-w-lg mx-auto grid">
		<img
			src="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/rubber-sg.jpg?v=1731075759"
			alt="Promo Banner"
			width="100%"
			class="h-full object-cover"
		/>
		<Text type="subtitle-2" weight="semibold" class="mt-8">
			Get your watch some perfect companions: Enjoy 20% off Rubber B Straps
		</Text>
		<Text type="body-1" color="black-5" class="mt-4">
			Rubber B are now available at Luxehouze! Purchase watch straps from Rubber B and enjoy 20%
			off.
		</Text>
		<Text type="subtitle-3" weight="semibold" class="mt-8">Terms and Conditions</Text>

		{#each terms as term}
			<div class="flex items-start gap-2 mt-4">
				<CircleFillDesign class="w-3 h-6 flex-shrink-0" fill="#858895" />
				<Text type="body-1" color="black-5" class="leading-tight">
					{term}
				</Text>
			</div>
		{/each}
	</div>
	<div class="mt-10">
		<Related items={data.happeningNow} />
	</div>
</div>
