<script>
	import Text from '$lib/components/Text/Text.svelte';
	import { ShieldCheckLineSystem, PriceTag3LineFinance, AppsLineSystem } from 'svelte-remix';

	const sections = [
		{
			icon: ShieldCheckLineSystem,
			title: '100% AUTHENTIC',
			description:
				"All the goods listed on our platform have been authenticated by our team of experts. In the unlikely event that you find it to be inauthentic, we'll refund 100% of its price."
		},
		{
			icon: PriceTag3LineFinance,
			title: 'Best Price Guarantee',
			description:
				'Every transaction at Luxehouze is protected by our Best Price Program! Should you receive a better price elsewhere, we will beat it*! <br><span style="font-size:10px;">*T&Cs apply.</span>'
		},
		{
			icon: AppsLineSystem,
			title: 'A Wide Collection Of Brands',
			description:
				"We offer a wide collection of luxury goods from the world's finest brands, from the most popular and sought-after names to rare and niche labels."
		}
	];
</script>

<div class="max-w-[1600px] mx-auto">
	<div class="flex flex-col md:flex-row gap-8 bg-black-1 p-20 items-center justify-center">
		<Text type="title-3" weight="semibold" class="mb-8 md:mb-0">WHY US?</Text>
		{#each sections as { icon, title, description }}
			<div class="flex flex-col items-center max-w-xs">
				<svelte:component this={icon} class="w-[48px] h-[48px]" />
				<Text weight="semibold" type="subtitle-3" class="mt-4">{title}</Text>
				<Text type="body-2" color="black-5" class="text-center mt-2">{@html description}</Text>
			</div>
		{/each}
	</div>
</div>
