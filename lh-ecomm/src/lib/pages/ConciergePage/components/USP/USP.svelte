<script>
	import Text from '$lib/components/Text/Text.svelte';
	import {
		ServiceLineBusiness,
		LockUnlockLineSystem,
		MoneyDollarCircleLineFinance
	} from 'svelte-remix';
	const items = [
		{
			icon: ServiceLineBusiness,
			title: 'Personalized Experience',
			text: 'Our vast connections within our private concierge service enable a bespoke experience unlike any other'
		},
		{
			icon: LockUnlockLineSystem,
			title: 'Exclusive Access',
			text: 'We can offer you access to frequently inaccessible pieces so that you can expand your collection'
		},
		{
			icon: MoneyDollarCircleLineFinance,
			title: 'Best Price Guarantee',
			text: 'From our selection of authentic luxury pieces, we guarantee the best prices on the market'
		}
	];
</script>

<div class="container max-w-[1600px] bg-black-7">
	<div
		class="flex flex-col items-center justify-center md:flex-row md:items-stretch p-6 md:p-16 overflow-hidden gap-4"
	>
		{#each items as { icon, title, text }}
			<div class="flex flex-col items-center gap-4 max-w-xs text-center min-h-[200px]">
				<svelte:component this={icon} class="w-12 h-12" fill="#FFFFFF" />
				<Text type="subtitle-3" weight="semibold" color="white-1">{title}</Text>
				<Text type="body-2" color="white-1">{text}</Text>
			</div>
		{/each}
	</div>
</div>
