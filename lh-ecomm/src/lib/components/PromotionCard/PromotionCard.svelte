<script lang="ts">
	import { ArrowRightLineArrows } from 'svelte-remix';

	import Divider from '../Divider/Divider.svelte';
	import Text from '../Text/Text.svelte';
	import Button from '../Button/Button.svelte';
	import { DateTime } from 'luxon';
	import { createEventDispatcher } from 'svelte';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let label: string;
	export let expDate: string;
	export let url: string;
	export let index: number;

	const dispatch = createEventDispatcher();

	const handleOnViewPromo = () => {
		googleAnalClickedEvent('click_view_promo', {
			voucher: {
				name: label
			}
		});

		dispatch('view-promo', index);
	};
</script>

<div class="bg-white-2 px-4 py-[13px] rounded min-w-[280px]">
	<div>
		<Text type="body-2" color="black-10" weight="semibold">{label}</Text>
	</div>

	{#if expDate}
		<div>
			<Text type="caption-1" color="black-6">
				Until {DateTime.fromISO(expDate).toFormat('MMM dd, yyyy')}
			</Text>
		</div>
	{/if}

	<div class="hidden lg:block">
		<Divider borderStyle="border-dashed" />

		<div>
			<Button variant="link" class="flex items-center gap-2 p-0" onClick={handleOnViewPromo}>
				<Text type="body-2" color="black-10" weight="semibold">View Promo</Text>
				<ArrowRightLineArrows size={20} />
			</Button>
		</div>
	</div>
</div>
