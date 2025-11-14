<script lang="ts">
	import { goto } from '$app/navigation';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	export let currentPage: number | undefined = 1;
	export let paginationData: { url: string; isCurrentPage: boolean }[] = [];
	export let paginationInfo: { hasPreviousPage: boolean; hasNextPage: boolean } | undefined =
		undefined;
	export let getPrevPageUrl:
		| ((paginationData: { url: string; isCurrentPage: boolean }[]) => string)
		| undefined = undefined;
	export let getNextPageUrl:
		| ((paginationData: { url: string; isCurrentPage: boolean }[]) => string)
		| undefined = undefined;

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

	const handlePageClick = (url: string) => {
		if (url) {
			goto(url, { noScroll: true, invalidateAll: true });
		}
	};

	const isNumber = (value: number | string): value is number => typeof value === 'number';
</script>

<div class="container flex items-center gap-2 justify-center pt-6 pb-10">
	<!-- Previous Button -->
	<button
		on:click={() => handlePageClick(getPrevPageUrl ? getPrevPageUrl(paginationData) : '')}
		disabled={!paginationInfo?.hasPreviousPage}
		class="disabled:text-gray-300"
	>
		<ArrowLeftSLineArrows size="32" />
	</button>

	<!-- Pagination Buttons -->
	{#each paginationFormatter(currentPage ?? 1, paginationData.length) as page, index}
		{#if page === '...'}
			<span>...</span>
		{:else if isNumber(page)}
			<button
				on:click={() => handlePageClick(paginationData[page - 1]?.url)}
				disabled={paginationData[page - 1]?.isCurrentPage}
				class="w-10 h-10 rounded-lg"
				class:text-black-6={!paginationData[page - 1]?.isCurrentPage}
				class:bg-brown-05={paginationData[page - 1]?.isCurrentPage}
			>
				{page}
			</button>
		{/if}
	{/each}

	<!-- Next Button -->
	<button
		on:click={() => handlePageClick(getNextPageUrl ? getNextPageUrl(paginationData) : '')}
		disabled={!paginationInfo?.hasNextPage}
		class="disabled:text-gray-300"
	>
		<ArrowRightSLineArrows size="32" />
	</button>
</div>
