<script lang="ts">
	import { Input, Label } from 'flowbite-svelte';

	export let id: string;
	export let name: string = '';
	export let placeholder: string;
	export let label: string | undefined = undefined;
	export let divClass: string = '';
	export let inputClass: string = '';
	export let value: string = '';

	export let required: boolean = true;
</script>

<div class={divClass}>
	{#if label}
		<Label for={id} class="mb-1">{label}</Label>
	{/if}
	<Input
		type="text"
		{id}
		{name}
		{placeholder}
		{required}
		class="
			border border-black-5 rounded
			py-2 px-4
			placeholder-black-4 text-black-10
			bg-transparent
		"
		bind:value
	/>
</div>
