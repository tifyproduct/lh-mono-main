<script lang="ts">
	import { StarFillSystem, StarHalfFillSystem, StarSLineSystem } from 'svelte-remix';
	import Text from '$lib/components/Text/Text.svelte';

	export let value: number = 1;
	export let showValueText = false;
	export let starSize = 16;

	const modulo = value % 1;
	let residu = 5 - Math.floor(value) - (modulo > 0 ? 1 : 0);
</script>

<div class="flex items-center">
	<div class="flex justify-start items-center">
		{#each Array(Math.floor(value)).keys() as star}
			<span class="pr-1">
				<StarFillSystem size={starSize} color="#DBB999" />
			</span>
		{/each}
		{#if modulo > 0}
			<span class="pr-1">
				<StarHalfFillSystem size={starSize} color="#DBB999" />
			</span>
		{/if}
		{#if residu > 0}
			{#each Array(residu).keys() as star}
				<span class="pr-1">
					<StarSLineSystem size={starSize + 2} color="#DBB999" />
				</span>
			{/each}{/if}
	</div>
	{#if showValueText}
		<Text type="body-1" color="black-6">{value.toFixed(1)}</Text>
	{/if}
</div>
