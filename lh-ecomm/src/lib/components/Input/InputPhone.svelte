<script lang="ts">
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { ArrowDropDownLineArrows } from 'svelte-remix';

	export let value: string;
	export let id: string;
	export let placeholder: string | null = 'e.g: 812 3456 7890';
	export let classCustom: string | null = null;
	export let onBlur: (() => void) | null | undefined = null;

	const codeList = [
		{
			flag: '/icons/indonesia_flag.svg',
			code: '+62',
			alt: 'indonesia flag'
		},
		{
			flag: '/icons/sg_flag.svg',
			code: '+65',
			alt: 'singapore flag'
		}
	];
	let selectedCode = $page.params.store == 'id' ? '+62' : '+65';
	let isDropdownActive = false;

	const dispatch = createEventDispatcher();

	const toggleDropdown = () => {
		isDropdownActive = !isDropdownActive;
	};

	const selectCode = (code: string) => {
		selectedCode = code;
		isDropdownActive = false;
		dispatch('code-change', code);
	};
</script>

<div>
	<div class="relative flex flex-row mt-1">
		<div
			class="border border-dark-brown-1 flex flex-row items-center cursor-pointer py-1 px-2 rounded-l-md justify-between gap-1 ${classCustom}"
			on:click={toggleDropdown}
			role="presentation"
		>
			<span>{selectedCode}</span>
			<ArrowDropDownLineArrows size="26" />
		</div>

		<div
			class="options-container absolute top-full left-0 w-full border bg-white-1 border-gray-300 rounded bg-white z-10 {isDropdownActive
				? 'active'
				: 'hidden'}"
		>
			{#each codeList as codeItem}
				<div
					class="option p-2.5 cursor-pointer flex flex-row justify-center hover:bg-gray-200"
					on:click={() => selectCode(codeItem.code)}
					role="presentation"
				>
					<img src={codeItem.flag} alt={codeItem.alt} />
					<span>{codeItem.code}</span>
				</div>
			{/each}
		</div>

		<input
			class={`border border-[#DBD8D7] p-3 min-h-[22px] w-full rounded-r-md border-l-0 ${classCustom}`}
			type="tel"
			{id}
			{placeholder}
			bind:value
			on:blur={onBlur}
		/>
	</div>
</div>
