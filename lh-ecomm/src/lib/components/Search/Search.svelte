<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Input } from 'flowbite-svelte';
	import { CloseLineSystem, SearchLineSystem } from 'svelte-remix';
	import debounce from '$lib/utils/debounce';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let id: string;
	export let placeholder: string;
	export let showSearch: boolean;

	const dispatch = createEventDispatcher();

	let keyword: string;

	const handleSearchBarClick = () => {
		dispatch('search-clicked');
	};

	const debouncedDispatch = debounce((value: string) => {
		keyword = value;
		dispatch('search-changed', value);

		googleAnalClickedEvent('search', {
			search: value
		});
	}, 1000);

	const handleSearchBarChanged = (e: KeyboardEvent) => {
		const val: string = (e.target as HTMLInputElement).value;
		debouncedDispatch(val);
	};

	const handleCancelClick = () => {
		keyword = '';
		dispatch('cancel-clicked');
	};

	const handleKeyPress = (e: Event) => {
		e.stopPropagation();
		const val: string = (e.target as HTMLInputElement).value;

		if ((e as KeyboardEvent).key === 'Enter') {
			keyword = val;
			e.preventDefault();
			dispatch('enter-pressed', val);
			(e.target as HTMLInputElement).value = '';
		}
	};

	$: {
		if (!showSearch) {
			keyword = '';
		}
	}
</script>

<div>
	<form>
		<Input
			type="text"
			{id}
			{placeholder}
			required
			on:click={handleSearchBarClick}
			on:keyup={handleSearchBarChanged}
			on:keypress={handleKeyPress}
			value={keyword}
			class="border border-black-5 rounded
			py-2 px-4
			placeholder-black-4 text-black-10
			bg-white"
		>
			<div slot="left">
				<SearchLineSystem class="text-black-6" size={20} />
			</div>

			<div slot="right" class:hidden={!showSearch} class:cursor-pointer={showSearch}>
				{#if showSearch}
					<CloseLineSystem on:click={handleCancelClick} />
				{/if}
			</div>
		</Input>
	</form>
</div>
