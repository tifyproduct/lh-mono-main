<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { Hr, Input } from 'flowbite-svelte';
	import { ArrowRightLineArrows, FileCopyLineDocument } from 'svelte-remix';
	import { DateTime } from 'luxon';
	import { createEventDispatcher } from 'svelte';

	export let title: string;
	export let description: string;
	export let code: string;
	export let dueDate: string;
	export let isSelected: boolean = false;
	export let index: number;

	const dispatch = createEventDispatcher();

	let isExpaned = false;

	const toggleExpand = (e: Event) => {
		e.stopPropagation();
		isExpaned = !isExpaned;
	};

	const handleCardClick = () => {
		dispatch('card-click', index);
	};
</script>

<button
	on:click={handleCardClick}
	class="flex flex-col py-3 bg-white-2 px-4 rounded [&:not(:last-child)]:mb-3 w-full"
	class:bg-beige-1={isSelected}
	class:bg-white-2={!isSelected}
	class:border-beige-10={isSelected}
	class:border={isSelected}
>
	<Text type="body-2" weight="semibold" class="mb-1">{title}</Text>
	{#if dueDate}
		<Text type="caption-1" color="black-6">
			Until {DateTime.fromISO(dueDate).toFormat('MMM dd, yyyy')}
		</Text>
	{/if}
	<Hr hrClass="block lg:hidden my-3 border-dashed border-brown-2" />
	<div
		class="overflow-hidden transition-all text-left w-full"
		class:max-h-auto={isExpaned}
		class:max-h-0={!isExpaned}
	>
		<Text type="caption-1">
			{description}
		</Text>
		<Input
			readonly
			value={code}
			class="{isSelected
				? 'border-beige-10'
				: 'border-dark-brown-1'} rounded px-4 py-3 bg-white-1 my-3 w-full"
		>
			<FileCopyLineDocument
				slot="right"
				size="16"
				class="text-beige-10"
				on:click={() => {
					dispatch('copy-clipboard', code);
				}}
			/>
		</Input>
	</div>
	<Button variant="link" padding="p-0" class="lg:hidden" onClick={toggleExpand}>
		<div class="flex items-center justify-start w-full">
			<Text type="body-2" weight="semibold" color={isSelected ? 'beige-10' : 'black-9'}>
				{isExpaned ? 'VIEW LESS' : 'VIEW DETAIL'}
			</Text>
			<ArrowRightLineArrows
				size="16"
				class="{isSelected ? 'text-beige-10' : 'text-black-9'} ml-2"
			/>
		</div>
	</Button>
</button>
