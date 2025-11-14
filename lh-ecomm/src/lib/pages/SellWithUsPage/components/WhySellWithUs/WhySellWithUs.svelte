<script>
	import Text from '$lib/components/Text/Text.svelte';
	import { ShiningLineWeather, VipDiamondLineFinance, FunctionLineSystem } from 'svelte-remix';

	const items = [
		{
			img: ShiningLineWeather,
			fill: '#e2ccb3',
			title: 'Earn More',
			description:
				'Enjoy a competitive fee for Consignment and the best offering price for Direct Selling and Trade-In. Ensure maximum earning from the items you sell with us.'
		},
		{
			img: VipDiamondLineFinance,
			fill: '#e2ccb3',
			title: 'Sell With Ease',
			description:
				'Enjoy the most convenient selling experience through three different methods: Consignment, Direct Selling, and Trade-In. Both brand new and pre-owned watches are accepted.'
		},
		{
			img: FunctionLineSystem,
			fill: '#e2ccb3',
			title: 'Sell Fast',
			description:
				"Connect to thousands of Asia's luxury goods collectors, reach the right prospective buyers, and get your items sold fast."
		}
	];
</script>

<div class="text-center py-10 px-4">
	<Text type="subtitle-1" class="text-3xl !font-bold text-xl md:text-3xl"
		>Why You Should Sell With Us
	</Text>
	<div class="flex flex-col md:flex-row justify-center mt-8 gap-4 md:gap-8">
		{#each items as { img: ImgComponent, fill, title, description }}
			<div
				class="md:flex md:flex-col md:items-center text-left md:text-center max-w-xs gap-4 hidden"
			>
				<ImgComponent style={`fill: ${fill};`} class="w-8 h-8" />
				<div class="flex flex-col">
					<Text type="body-1" color="black-9" weight="semibold">{title}</Text>
					<Text type="body-2" class="text-left md:text-center" color="black-5">
						{description}
					</Text>
				</div>
			</div>
			<div class="md:hidden text-left">
				<div class="flex items-center gap-2">
					<ImgComponent style={`fill: ${fill};`} class="w-8 h-8" />
					<Text type="body-1" color="black-9" weight="semibold">{title}</Text>
				</div>
				<Text type="body-1" class="text-left md:text-center" color="black-5">
					{description}
				</Text>
			</div>
		{/each}
	</div>
</div>
