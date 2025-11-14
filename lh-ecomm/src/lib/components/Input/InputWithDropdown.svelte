<script lang="ts">
	import {
		Input,
		ButtonGroup,
		Button,
		Dropdown,
		DropdownItem,
		Label,
		type InputType
	} from 'flowbite-svelte';
	import { ArrowDownSLineArrows } from 'svelte-remix';

	export let id: string;
	export let name: string = '';
	export let type: InputType | undefined = 'text';
	export let required: boolean = true;

	export let placeholder: string;
	export let label: string | undefined = undefined;
	export let value: string = '';

	export let options: Array<string>;
	export let selectedOption: string = options[0];

	let dropdownOpen = false;

	const onSelectOption = (option: string) => {
		selectedOption = option;
		dropdownOpen = false;
	};
</script>

<div>
	{#if label}
		<Label for={id} class="mb-1">{label}</Label>
	{/if}

	<ButtonGroup class="w-full border border-black-5 rounded">
		<Button color="none" class="flex-shrink-0">
			{selectedOption}
			<ArrowDownSLineArrows class="w-4 h-4 ms-1" />
		</Button>
		<Dropdown class="bg-white-1 rounded" bind:open={dropdownOpen}>
			{#each options as option}
				<DropdownItem on:click={() => onSelectOption(option)}>{option}</DropdownItem>
			{/each}
		</Dropdown>

		<Input
			{type}
			{id}
			{name}
			{placeholder}
			{required}
			class="
            border-0
            rounded
			py-2 px-4
			placeholder-black-4 text-black-10
			bg-transparent
		"
			bind:value
		/>
	</ButtonGroup>
</div>
