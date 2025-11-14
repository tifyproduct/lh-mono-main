<script lang="ts">
	import Button from '$lib/components/Button/Button.svelte';
	import VerticalDivider from '$lib/components/Divider/VerticalDivider.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Badge from '$lib/components/Badge/Badge.svelte';

	import type { Address } from '$lib/types/address';

	export let address: Address;
	export let onClickEdit: () => void;
	export let onClickDelete: () => void;
	export let onClickSetAsDefault: () => void;
</script>

<div class="p-6 border border-brown-05 rounded">
	<div class="border-dark-brown-9 border-l-4 -ml-6">
		<div class="ml-5 flex items-center gap-3">
			<Text type="body-1" color="dark-brown-8" weight="semibold">{address.company}</Text>

			{#if address.default}
				<Badge>MAIN ADDRESS</Badge>
			{/if}
		</div>
	</div>

	<div class="mt-5">
		<Text type="body-1" color="black-9" weight="medium">{address.firstName} {address.lastName}</Text
		>
	</div>

	<div class="mt-1">
		<Text type="body-2" color="black-7">{address.phone}</Text>
	</div>
	<div>
		<Text type="body-2" color="black-7">{address.address1}</Text>
	</div>
	<div>
		<Text type="body-2" color="black-7">{address.address2}</Text>
	</div>

	<div class="mt-5 flex gap-4">
		<Button variant="link" class="flex items-center gap-1 p-0" onClick={onClickEdit}>
			<Text type="body-2" color="dark-brown-8" weight="semibold">EDIT</Text>
		</Button>

		<VerticalDivider />

		<Button variant="link" class="flex items-center gap-1 p-0" onClick={onClickDelete}>
			<Text type="body-2" color="dark-brown-8" weight="semibold">DELETE</Text>
		</Button>

		{#if !address.default}
			<VerticalDivider />

			<Button variant="link" class="flex items-center gap-1 p-0" onClick={onClickSetAsDefault}>
				<Text type="body-2" color="dark-brown-8" weight="semibold">SET AS MAIN ADDRESS</Text>
			</Button>
		{/if}
	</div>
</div>
