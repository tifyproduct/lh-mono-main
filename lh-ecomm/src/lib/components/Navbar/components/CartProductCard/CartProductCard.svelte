<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import { page } from '$app/stores';
	import { currencyFormat } from '$lib/utils/formatter';

	export let item;
</script>

<div class="flex items-center">
	<div class="basis-1/4">
		<img src={item.merchandise.image.url} alt={item.merchandise.title} />
	</div>
	<div class="flex flex-col justify-center ml-2 basis-2/3">
		<Text type="body-2" weight="semibold">{item.merchandise.product.vendor}</Text>
		<Text type="caption-2" color="black-6">
			{item.merchandise.product.title} - {item.merchandise.title}
		</Text>
		<Text type="caption-1" color="black-6">
			{currencyFormat(parseFloat(item.merchandise.price.amount), $page.params.store)}
		</Text>
	</div>
	<Text class="ml-auto basis-1/3 text-right" type="caption-2" color="black-8">x{item.quantity}</Text
	>
</div>
