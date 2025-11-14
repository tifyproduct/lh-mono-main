<script lang="ts">
	import { afterUpdate } from 'svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import { LABEL_BADGE } from '$lib/constants.util';

	export let isSmallText: boolean = false;

	export let discount: boolean = false;
	export let preOrder: boolean = false;
	export let outOfStock: boolean = false;
	export let newArrival: boolean = false;
	export let isBeauty: boolean = false;

	let text = '';
	let color = '';

	const generateBadge = () => {
		if (isBeauty) {
			if (outOfStock) {
				text = LABEL_BADGE.OUT_OF_STOCK;
				color = 'bg-black-6';
			} else if (discount) {
				text = LABEL_BADGE.SALE;
				color = 'bg-red-6';
			}
		} else if (preOrder) {
			text = LABEL_BADGE.PRE_ORDER;
			color = 'bg-beige-10';
		} else if (outOfStock) {
			text = LABEL_BADGE.SOLD_OUT;
			color = 'bg-black-6';
		} else if (discount) {
			text = LABEL_BADGE.SALE;
			color = 'bg-red-6';
		} else if (newArrival) {
			text = LABEL_BADGE.NEW_ARRIVAL;
			color = 'bg-dark-brown-10';
		}
	};

	afterUpdate(() => {
		text = '';
		color = '';

		generateBadge();
	});
</script>

<div class={`rounded ${color} ${isSmallText ? '-pt-2 px-3 pb-1' : 'p-2'}`}>
	<Text type={isSmallText ? 'caption-2' : 'body-1'} color="white-1" weight="semibold">
		{text}
	</Text>
</div>
