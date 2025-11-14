<script lang="ts">
	import { ArrowLeftSLineArrows, CloseFillSystem, FilterFillSystem } from 'svelte-remix';
	import Button from '$lib/components/Button/Button.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import InputPrice from '$lib/components/CollectionFilter/InputPrice.svelte';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';
	import groupFilters from '$lib/utils/groupFilters';
	import { encodeFilterParams } from '$lib/utils/modifyUrlString';
	import { Hr } from 'flowbite-svelte';
	import { get } from 'svelte/store';	
	import { featureFlagStore } from '$lib/stores/featureFlag';

	export let filters = [];
	export let activeFilters = [];
	export let activeSort = '';
	export let sortReverse = '';
	export let collectionType: string;

	// TODO: filter by category is not available yet in API Storefront version 2024-04
	filters = filters.filter((item) => item.label !== 'Category');

	let isFilterOpened = false;
	let filterContainer: HTMLDivElement;

	$: {
		if (filterContainer) {
			filterContainer.style.height = `${filterContainer.scrollHeight * 1.2}px`;
		}
	}

	const toogleFilter = () => {
		isFilterOpened = !isFilterOpened;
	};

	let selectedFilter = filters[0] ?? [];

	const handleSelectedFilterChange = (filter) => {
		selectedFilter = filter;
	};

	let checkedFilters = activeFilters.map((af) => JSON.stringify(af));
	let searchParams = new URLSearchParams();
	let filterPrice = {
		min: 0,
		max: 0
	};
	let filterPriceIsDirty = false;

	function applyFilters() {
		if (filterPriceIsDirty) {
			checkedFilters = checkedFilters.filter((cf) => !cf.includes('price'));
			checkedFilters.push(JSON.stringify({ price: filterPrice }));
		}

		if (checkedFilters.length > 0) {
			searchParams.set('filters', encodeFilterParams(checkedFilters.join(';')));
		}

		googleAnalClickedEvent('click_filter', {
			product: {
				category: collectionType
			},
			filter: groupFilters(checkedFilters.map((item) => JSON.parse(item)))
		});

		goto(`?${searchParams.toString()}`, {
			noScroll: true,
			invalidateAll: true
		});

		isFilterOpened = false;
		filterPriceIsDirty = false;
	}

	async function removeFilter(filter) {
		checkedFilters = checkedFilters.filter((cf) => {
			return cf !== JSON.stringify(filter);
		});

		activeFilters = activeFilters.filter((cf) => cf !== filter);

		await tick();

		applyFilters();
	}

	function resetFilter() {
		activeFilters = [];
		checkedFilters = [];

		applyFilters();
	}

	function applySort(sortName: string, sortKey: string, reverse: boolean = false) {
		searchParams.set('sortKey', sortKey);
		searchParams.set('reverse', String(reverse));

		googleAnalClickedEvent('click_sort', {
			product: {
				category: collectionType
			},
			sortBy: sortName
		});

		goto(`?${searchParams.toString()}`, {
			noScroll: true,
			invalidateAll: true
		});
	}

	function formatFilterPrice(price): string {
		return new Intl.NumberFormat('id-ID').format(price);
	}

	onMount(() => {
		const priceFilters = filters.find((filter) => filter.type === 'PRICE_RANGE');

		if (priceFilters) {
			const filterValue = JSON.parse(priceFilters.values[0].input);

			filterPrice.min = filterValue.price.min;
			filterPrice.max = filterValue.price.max;
		}
	});

	const isEmptyFilter = (filter) => {
		let empty = true;

		filter.values.forEach((item) => {
			if (item.id.indexOf('hide') > 0) {
				empty = true;
			} else {
				empty = false;
			}
		});

		return empty;
	};

	const featureFlags = get(featureFlagStore);
</script>

<div
	class="container z-50
    {isFilterOpened
		? 'bg-[rgb(36,37,43,0.7)] fixed z-10 top-0 mt-0 h-full w-full min-w-[100%] lg:px-12'
		: ''}"
	class:mt-5={!isFilterOpened}
	class:lg:mt-10={!isFilterOpened}
>
	<!-- MOBILE -->
	{#if isFilterOpened}
		<div class="bg-white-1 py-3 px-4 lg:hidden">
			<button class="flex items-center" on:click={toogleFilter}>
				<ArrowLeftSLineArrows />
				<Text class="pl-2" type="body-1" color="black-7">Filter</Text>
			</button>
		</div>
	{/if}
	<div
		class="bg-white-2 rounded overflow-x-scroll no-scrollbar px-4 flex lg:flex"
		class:hidden={isFilterOpened}
	>
		<Button
			onClick={toogleFilter}
			variant="primary"
			class="bg-dark-brown-10 ml-3 my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl flex items-center"
		>
			<FilterFillSystem class="pr-2 text-white-1" />
			<Text weight="semibold" type="body-2" color="white-1">
				Filter {#if activeFilters.length > 0}({activeFilters.length}){/if}
			</Text>
		</Button>
		<button
			class:text-white-1={activeSort === 'BEST_SELLING'}
			class:bg-black-9={activeSort === 'BEST_SELLING'}
			class="text-sm font-medium border border-black-9 cursor-pointer my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl"
			on:click={() => {
				applySort('Best Selling', 'BEST_SELLING');
			}}
		>
			Best Selling
		</button>
		<button
			class:text-white-1={activeSort === 'PRICE' && sortReverse === 'true'}
			class:bg-black-9={activeSort === 'PRICE' && sortReverse === 'true'}
			class="text-sm font-medium border border-black-9 cursor-pointer my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl"
			on:click={() => {
				applySort('Price, High to low', 'PRICE', true);
			}}
		>
			Price, High to low
		</button>
		<button
			class:text-white-1={activeSort === 'PRICE' && sortReverse === 'false'}
			class:bg-black-9={activeSort === 'PRICE' && sortReverse === 'false'}
			class="text-sm font-medium border border-black-9 cursor-pointer my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl"
			on:click={() => {
				applySort('Price, Low to high', 'PRICE');
			}}
		>
			Price, Low to high
		</button>
		<button
			class:text-white-1={activeSort === 'TITLE' && sortReverse === 'false'}
			class:bg-black-9={activeSort === 'TITLE' && sortReverse === 'false'}
			class="text-sm font-medium border border-black-9 cursor-pointer my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl"
			on:click={() => {
				applySort('Alphabetical, A-Z', 'TITLE');
			}}
		>
			Alphabetical, A-Z
		</button>
		<button
			class:text-white-1={activeSort === 'TITLE' && sortReverse === 'true'}
			class:bg-black-9={activeSort === 'TITLE' && sortReverse === 'true'}
			class="text-sm font-medium border border-black-9 cursor-pointer my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl"
			on:click={() => {
				applySort('Alphabetical, Z-A', 'TITLE', true);
			}}
		>
			Alphabetical, Z-A
		</button>
		<button
			class:text-white-1={activeSort === 'CREATED' && sortReverse === 'true'}
			class:bg-black-9={activeSort === 'CREATED' && sortReverse === 'true'}
			class="text-sm font-medium border border-black-9 cursor-pointer my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl"
			on:click={() => {
				applySort('Latest', 'CREATED', true);
			}}
		>
			Latest
		</button>
		{#if !featureFlags.removeOlderSorting}
		<button
			class:text-white-1={activeSort === 'CREATED' && sortReverse === 'false'}
			class:bg-black-9={activeSort === 'CREATED' && sortReverse === 'false'}
			class="text-sm font-medium border border-black-9 cursor-pointer my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl"
			on:click={() => {
				applySort('Oldest', 'CREATED');
			}}
		>
			Oldest
		</button>
		{/if}
	</div>
	{#if activeFilters.length > 0}
		<div
			class="items-center px-4 py-4 lg:px-0 lg:pt-6 bg-white-1 max-lg:overflow-x-scroll lg:flex-wrap lg:flex {isFilterOpened
				? 'flex '
				: 'hidden'}"
			class:lg:hidden={isFilterOpened}
			class:max-md:flex={isFilterOpened}
		>
			{#each activeFilters as activeFilter}
				{#if activeFilter.price}
					<div
						class="bg-brown-05 flex rounded-3xl mr-4 px-4 py-3 items-center lg:mb-2 max-lg:whitespace-nowrap"
					>
						<Text class="mr-2" type="body-2" color="black-7" weight="semibold">
							Price: {formatFilterPrice(activeFilter.price.min)} to {formatFilterPrice(
								activeFilter.price.max
							)}
						</Text>
						<CloseFillSystem
							on:click={() => {
								removeFilter(activeFilter);
							}}
							class="cursor-pointer text-black-7"
						/>
					</div>
				{/if}
				{#each filters as filter}
					{@const filterValue = filter.values.find((f) => {
						return f.input === JSON.stringify(activeFilter);
					})}
					{#if filterValue}
						<div
							class="bg-brown-05 flex rounded-3xl mr-4 px-4 py-3 items-center lg:mb-2 max-lg:whitespace-nowrap"
						>
							<Text class="mr-2" type="body-2" color="black-7" weight="semibold">
								{filterValue.label}
							</Text>
							<CloseFillSystem
								on:click={() => {
									removeFilter(activeFilter);
								}}
								class="cursor-pointer text-black-7"
							/>
						</div>
					{/if}
				{/each}
			{/each}
			<div>
				{#if activeFilters.length > 0}
					<button on:click={resetFilter} class="max-lg:whitespace-nowrap lg:mb-2">
						<Text weight="semibold" type="body-2" class="cursor-pointer">Reset Filter</Text>
					</button>
				{/if}
			</div>
		</div>
	{/if}
	{#if isFilterOpened}
		<div class="bg-white-1 lg:py-8 px-4 lg:mt-1 lg:rounded-t lg:px-12">
			<!-- Desktop -->
			<div class="hidden justify-start lg:grid grid-flow-col">
				<div class="w-52 flex flex-col items-start border-r border-black-2 mr-6 pr-4">
					{#each filters as filter, index}
						{#if !isEmptyFilter(filter)}
							<Button
								id="buttonFilter-{index}"
								variant="link"
								onClick={() => handleSelectedFilterChange(filter)}
							>
								<span
									class:font-semibold={filter.id === selectedFilter.id}
									class="font-normal [&:not(:last-child)]:pb-6">{filter.label}</span
								>
							</Button>
						{/if}
					{/each}
				</div>

				<div class="overflow-x-scroll">
					{#each filters as filter, index}
						{#if selectedFilter.id === filter.id}
							<div
								id="selectedFilter{index}"
								class="justify-start gap-x-4 gap-y-1 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
							>
								{#if filter.type === 'PRICE_RANGE'}
									{#each filter.values as item, idx}
										<div class="flex gap-4">
											<div>
												<label>Min. price</label>
												<InputPrice
													placeholder="Min. price"
													bind:value={filterPrice.min}
													on:input={() => {
														filterPriceIsDirty = true;
													}}
												/>
											</div>
											<div>
												<label>Max. price</label>
												<InputPrice
													placeholder="Max. price"
													bind:value={filterPrice.max}
													on:input={() => {
														filterPriceIsDirty = true;
													}}
												/>
											</div>
										</div>
									{/each}
								{:else}
									{#each filter.values as item, idx}
										{@const id = btoa(crypto.randomUUID())}
										{#if !item.id.includes('hide')}
											<div id="{id}{idx}">
												<label for={id} class="flex justify-stretch w-full cursor-pointer">
													<input
														{id}
														type="checkbox"
														name={selectedFilter.title}
														bind:group={checkedFilters}
														value={JSON.stringify(JSON.parse(item.input))}
														class="shrink mt-1 border-black-9 bg-white-1 rounded-none text-dark-brown-10 focus:ring-dark-brown-10"
													/>
													<Text class="pl-2" type="body-1">{item.label}</Text>
													<span class="grow text-right text-black-4">
														({item.count})
													</span>
												</label>
											</div>
										{/if}
									{/each}
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</div>
			<!-- /Desktop -->

			<!-- Mobile -->
			<div class="lg:hidden h-screen no-scrollbar custom-scrollbar overflow-scroll max-lg:pt-4">
				<div class="flex-col gap-4" bind:this={filterContainer}>
					{#each filters as filter}
						<div>
							<span class="font-semibold">{filter.label}</span>
							{#if filter.type === 'PRICE_RANGE'}
								{#each filter.values as item, idx}
									<div class="flex gap-4">
										<div class="flex-col justify-between items-center w-1/2">
											<label>Min. price</label>
											<InputPrice
												width="w-full"
												placeholder="Min. price"
												bind:value={filterPrice.min}
												on:input={() => {
													filterPriceIsDirty = true;
												}}
											/>
										</div>
										<div class="flex-col justify-between items-center w-1/2">
											<label>Max. price</label>
											<InputPrice
												width="w-full"
												placeholder="Max. price"
												bind:value={filterPrice.max}
												on:input={() => {
													filterPriceIsDirty = true;
												}}
											/>
										</div>
									</div>
								{/each}
							{:else}
								{#each filter.values as item}
									{@const id = btoa(crypto.randomUUID())}
									{#if !item.id.includes('hide')}
										<div>
											<label for={id} class="flex justify-stretch w-full cursor-pointer">
												<input
													{id}
													type="checkbox"
													name={selectedFilter.title}
													bind:group={checkedFilters}
													value={item.input}
													class="shrink mt-1 border-black-9 bg-white-1 rounded-none text-dark-brown-10 focus:ring-dark-brown-10"
												/>
												<Text class="pl-2" type="body-1">{item.label}</Text>
												<span class="grow text-right text-black-4">
													({item.count})
												</span>
											</label>
										</div>
									{/if}
								{/each}
							{/if}
						</div>
						<Hr hrClass="my-2" />
					{/each}
				</div>
			</div>
			<!-- /Mobile -->
		</div>
		<div
			class="fixed bg-white-1 bottom-0 right-0 flex flex-col w-full p-4 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.16),0_0_1px_0_rgba(0,0,0,0.16)] lg:bg-white-2 lg:static lg:shadow-none lg:p-0 lg:flex-row lg:items-center lg:justify-end lg:px-12 lg:py-3"
		>
			<!--			<Text class="pb-4 lg:pr-6 lg:pb-0" type="body-1" color="black-7">xxx Result</Text>-->
			<Button class="w-full lg:w-auto" variant="primary" onClick={applyFilters}>
				Apply Filter(s)
			</Button>
		</div>
	{/if}
</div>
