<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';
	import { ShieldCheckFillSystem, CoinsFillFinance, InformationLineSystem } from 'svelte-remix';
	import Text from '$lib/components/Text/Text.svelte';

	let isTooltipOpen = false;

	function toggleTooltip() {
		isTooltipOpen = !isTooltipOpen;
	}
</script>

<div>
	<div
		id="readMore"
		class="w-full bg-brown-05 rounded px-4 py-[10.5px] flex items-center justify-between cursor-pointer"
		role="presentation"
		on:click={toggleTooltip}
	>
		<div class="flex items-center gap-6">
			<div class="flex gap-[6.5px] items-center">
				<Text type="body-2" color="dark-brown-10">100% Authentic</Text>
				<ShieldCheckFillSystem size={20} class="text-beige-10" />
			</div>
			<div class="flex gap-[6.5px] items-center">
				<Text type="body-2" color="dark-brown-10">Best Price Program</Text>
				<CoinsFillFinance size={20} class="text-beige-10" />
			</div>
		</div>
		<div class="lg:flex items-center gap-[11px]">
			<InformationLineSystem size={20} class="text-beige-10" />
		</div>
	</div>

	<Tooltip
		triggeredBy="#readMore"
		type="custom"
		defaultClass=""
		class="p-4 bg-white-1"
		arrow={false}
		placement="bottom"
		{...{ style: `display: ${isTooltipOpen ? 'block' : 'none'}` }}
	>
		<div class="flex flex-col lg:flex-row gap-4 lg:gap-6">
			<div class="text-center">
				<div class="flex justify-center w-full">
					<ShieldCheckFillSystem size={20} class="text-beige-10" />
				</div>

				<div class="mt-2">
					<Text type="body-2" color="black-9" weight="semibold">100% Authentic</Text>
				</div>

				<div class="mt-1">
					<Text type="body-2" color="black-6">
						All goods are authenticated by experts. If found otherwise, enjoy a full refund.
					</Text>
				</div>
			</div>
			<div class="text-center">
				<div class="flex justify-center w-full">
					<CoinsFillFinance size={20} class="text-beige-10" />
				</div>

				<div class="mt-2">
					<Text type="body-2" color="black-9" weight="semibold">Best Price Program</Text>
				</div>

				<div class="mt-1">
					<Text type="body-2" color="black-6">
						Every transaction at Luxehouze is protected by our Best Price Program! Should you
						receive a better price elsewhere, we will beat it*! <br />
						<p style="font-size: 10px;">*T&Cs apply</p>
					</Text>
				</div>
			</div>
		</div>
	</Tooltip>
</div>
