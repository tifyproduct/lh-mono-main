<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	export let value: number;
	export let placeholder = '';
	export let width = '';

	let displayValue: string = formatValue(value);

	const dispatch = createEventDispatcher();

	function formatValue(val: number = 0): string {
		return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val || 0);
	}

	function unFormatValue(val: string): number {
		return parseInt(displayValue.replaceAll(/\D+/g, ''));
	}

	function onInput(e: InputEvent) {
		value = unFormatValue(e.target.value);
		displayValue = formatValue(value);

		dispatch('input', e.detail);
	}

	onMount(() => {});
</script>

<input
	class="text-right rounded {width}"
	type="text"
	{placeholder}
	bind:value={displayValue}
	on:input={onInput}
/>
<input type="hidden" bind:value />
