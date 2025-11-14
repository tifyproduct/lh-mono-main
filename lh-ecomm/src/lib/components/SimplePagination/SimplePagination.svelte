<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	export let currentPage: number = 1;
	export let hasNext: boolean = false;
	export let hasPrev: boolean = false;
	export let count: number = 1;
	export let itemsPerPage: number = 10;

	const dispatch = createEventDispatcher();

	const totalPages = Math.ceil(count / itemsPerPage);

	const getNextPage = () => (currentPage < totalPages ? currentPage + 1 : currentPage);
	const getPrevPage = () => (currentPage > 1 ? currentPage - 1 : currentPage);

	const handlePageClick = (page: number) => {
		dispatch('pageChange', page);
	};

	const paginationFormatter = (current: number, total: number): (number | string)[] => {
		const delta = 2;
		const range: (number | string)[] = [];

		for (let i = 1; i <= total; i++) {
			if (i === 1 || i === total || Math.abs(i - current) <= delta) {
				range.push(i);
			} else if (range[range.length - 1] !== '...') {
				range.push('...');
			}
		}

		return range;
	};
</script>

<div class="container flex items-center gap-2 justify-center pt-6 pb-10">
	<button
		on:click={() => handlePageClick(getPrevPage())}
		disabled={!hasPrev}
		class="disabled:text-gray-300 cursor-pointer"
	>
		<ArrowLeftSLineArrows size="32" />
	</button>

	{#each paginationFormatter(currentPage, totalPages) as page, index}
		{#if page === '...'}
			<span class="px-2">...</span>
		{:else if typeof page === 'number'}
			<button
				on:click={() => handlePageClick(page)}
				disabled={page === currentPage}
				class="w-10 h-10 rounded-lg text-black-6 bg-brown-05"
				class:bg-brown-05={page === currentPage}
			>
				{page}
			</button>
		{/if}
	{/each}

	<button
		on:click={() => handlePageClick(getNextPage())}
		disabled={!hasNext}
		class="disabled:text-gray-300 cursor-pointer"
	>
		<ArrowRightSLineArrows size="32" />
	</button>
</div>
