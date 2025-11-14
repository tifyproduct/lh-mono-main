<script lang="ts">
	import { StarFillSystem, StarSLineSystem } from 'svelte-remix';

	export let starSize = 16;
	export let value = 0;

	const handleOnStarClick = (index: number) => {
		value = index;
	};
</script>

<div>
	{#each Array(5).keys() as star, index}
		<button type="button" class="pr-1" on:click={() => handleOnStarClick(index + 1)}>
			{#if index + 1 <= value}
				<StarFillSystem size={starSize} color="#DBB999" />
			{:else}
				<StarSLineSystem size={starSize} color="#DBB999" />
			{/if}
		</button>
	{/each}
</div>
