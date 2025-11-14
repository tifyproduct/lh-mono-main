<script lang="ts">
	import { Tooltip } from 'flowbite-svelte';

	import {
		ShieldCheckFillSystem,
		CoinsFillFinance,
		InformationLineSystem,
		SecurePaymentLineFinance,
		InboxUnarchiveLineBusiness
	} from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
</script>

<div>
	<div
		id="readMore"
		class="w-full bg-brown-05 rounded px-4 py-[10.5px] flex items-center justify-between cursor-pointer overflow-auto"
		role="presentation"
	>
		<div class="flex items-center gap-6">
			<div class="flex gap-[6.5px] items-center min-w-[120px]">
				<Text type="body-2" color="dark-brown-10">Guaranteed Authenticity</Text>
				<ShieldCheckFillSystem size={20} class="text-beige-10" />
			</div>
			<div class="flex gap-[6.5px] items-center min-w-[120px]">
				<Text type="body-2" color="dark-brown-10">One-Stop Beauty Destination</Text>
				<InboxUnarchiveLineBusiness size={20} class="text-beige-10" />
			</div>
			<div class="flex gap-[6.5px] items-center min-w-[150px]">
				<Text type="body-2" color="dark-brown-10">Unbeatable Prices</Text>
				<SecurePaymentLineFinance size={20} class="text-beige-10" />
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
		class="p-4 bg-white-1 z-10"
		arrow={false}
		placement="bottom"
	>
		<div class="flex flex-wrap gap-4 lg:gap-6">
			<div class="flex flex-col lg:flex-row gap-4 justify-normal lg:justify-between w-full">
				<div class="max-w-[310px] m-auto text-center">
					<div class="flex justify-center w-full">
						<ShieldCheckFillSystem size={20} class="text-beige-10" />
					</div>

					<div class="mt-2">
						<Text type="body-2" color="black-9" weight="semibold">GUARANTEED AUTHENTICITY</Text>
					</div>

					<div class="mt-1">
						<Text type="body-2" color="black-6">
							We offer only genuine products from trusted suppliers, backed by our money-back
							guarantee.
						</Text>
					</div>
				</div>

				<div class="max-w-[310px] m-auto text-center">
					<div class="flex justify-center w-full">
						<InboxUnarchiveLineBusiness size={20} class="text-beige-10" />
					</div>

					<div class="mt-2">
						<Text type="body-2" color="black-9" weight="semibold">ONE-STOP BEAUTY DESTINATION</Text>
					</div>

					<div class="mt-1">
						<Text type="body-2" color="black-6">
							Explore skincare, haircare, makeup, and fragrances at Luxehouze Beauty.
						</Text>
					</div>
				</div>
			</div>

			<div class="w-full max-w-[310px] m-auto text-center">
				<div class="flex justify-center w-full">
					<SecurePaymentLineFinance size={20} class="text-beige-10" />
				</div>

				<div class="mt-2">
					<Text type="body-2" color="black-9" weight="semibold">UNBEATABLE PRICES</Text>
				</div>

				<div class="mt-1">
					<Text type="body-2" color="black-6">
						Enjoy exclusive offers and all-inclusive pricing, with taxes included.
					</Text>
				</div>
			</div>
		</div>
	</Tooltip>
</div>
