<script lang="ts">
	import { SwapBoxLineFinance } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';

	import type { ShippingDelivery } from '$lib/types/product';

	export let data: ShippingDelivery | undefined = undefined;
</script>

<div class="border border-black-2 px-4 py-[21px] rounded">
	<div class="flex flex-col lg:flex-row gap-3 justify-between">
		<div class="flex gap-2">
			<SwapBoxLineFinance />
			<Text type="body-1" color="black-10" weight="semibold">Shipping From</Text>
		</div>
		<div>
			<Text type="body-1" color="black-10">{data?.type} ({data?.value} Working Days)</Text>
		</div>
	</div>
</div>
