<script lang="ts">
	import { Label, Select } from 'flowbite-svelte';

	export let id: string;
	export let name: string = '';
	export let placeholder: string;
	export let label: string | undefined = undefined;
	export let required: boolean = true;

	export let divClass: string = '';
	export let selectClass: string = '';
	export let value: string = '';
	export let options: Array<{ name: string; value: string }>;
</script>

<div class={divClass}>
	{#if label}
		<Label for={id} class="mb-1">{label}</Label>
	{/if}

	<Select
		{id}
		{name}
		{required}
		bind:value
		class="
			mt-2 border border-black-5 rounded
			py-2 px-4
			placeholder-black-4 text-black-10
			bg-transparent 
			{selectClass}
		"
		items={options}
		{placeholder}
		menuClass="max-h-60 overflow-y-auto"
	/>
</div>
