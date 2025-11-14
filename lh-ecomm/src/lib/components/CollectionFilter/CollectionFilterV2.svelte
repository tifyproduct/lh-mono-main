<script lang="ts">
	import { ArrowLeftSLineArrows, CloseFillSystem, FilterFillSystem } from 'svelte-remix';
	import Button from '$lib/components/Button/Button.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import InputPrice from '$lib/components/CollectionFilter/InputPrice.svelte';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';
	import { page } from '$app/stores';
	import { Hr } from 'flowbite-svelte';
	import { decodeFilterParams, encodeFilterParams } from '$lib/utils/modifyUrlString';

	interface FilterValue {
		minPrice?: string;
		maxPrice?: string;
	}

	interface Filter {
		key: string;
		label: string;
		type: 'checkbox' | 'range';
		value: string[] | FilterValue[];
	}

	interface Sort {
		key: string;
		label: string;
		value: string;
	}

	export let filters: Filter[] = [];
	export let sorts: Sort[] = [];
	export let collectionType: string;

	let isFilterOpened = false;
	let filterContainer: HTMLDivElement;

	let selectedFilter = [];
	$: selectedFilter = filters.find((f) => !isEmptyFilter(f)) ?? filters[0] ?? [];

	let activeFilters = [];
	let checkedFilters = [];
	let searchParams = new URLSearchParams();
	let activeSort = '';
	let filterPrice = {
		min: 0,
		max: 0
	};
	let filterPriceIsDirty = false;

	$: if (filterContainer) {
		filterContainer.style.height = `${filterContainer.scrollHeight * 1.2}px`;
	}

	const toggleFilter = () => {
		isFilterOpened = !isFilterOpened;
	};

	const handleSelectedFilterChange = (filter) => {
		selectedFilter = filter;
	};

	function applyFilters() {
		// Get existing URL params
		const urlParams = new URLSearchParams($page.url.search);
		searchParams = new URLSearchParams();

		searchParams.set('page', '1');

		// Preserve sort parameters if they exist
		const sortKey = urlParams.get('sortKey');
		const sortValue = urlParams.get('sortValue');
		if (sortKey && sortValue) {
			searchParams.set('sortKey', sortKey);
			searchParams.set('sortValue', sortValue);
		}

		const filterArray = [];

		// Handle price filter
		if (filterPriceIsDirty) {
			if (filterPrice.min > 0) {
				filterArray.push({
					field: 'price',
					relation: 'greater_than',
					value: filterPrice.min.toString()
				});
			}
			if (filterPrice.max > 0) {
				filterArray.push({
					field: 'price',
					relation: 'less_than',
					value: filterPrice.max.toString()
				});
			}
		}

		checkedFilters.forEach((filter) => {
			const parsedFilter = JSON.parse(filter);
			const [key, value] = Object.entries(parsedFilter)[0];

			// Skip price filter as it's handled separately
			if (key !== 'price') {
				filterArray.push({
					field: key,
					relation: 'equals',
					value: value
				});
			}
		});

		if (filterArray.length > 0) {
			searchParams.set('filters', encodeFilterParams(JSON.stringify(filterArray)));
		}

		googleAnalClickedEvent('click_filter', {
			product: {
				category: collectionType
			},
			filter: filterArray
		});

		goto(`?${searchParams.toString()}`, {
			noScroll: true,
			replaceState: true,
			keepFocus: true
		});

		isFilterOpened = false;
		filterPriceIsDirty = false;
	}

	async function removeFilter(filter) {
		checkedFilters = checkedFilters.filter((cf) => cf !== JSON.stringify(filter));
		activeFilters = activeFilters.filter((cf) => JSON.stringify(cf) !== JSON.stringify(filter));
		await tick();
		applyFilters();
	}

	function resetFilter() {
		// Get existing URL params
		const urlParams = new URLSearchParams($page.url.search);
		searchParams = new URLSearchParams();

		// Preserve sort parameters if they exist
		const sortKey = urlParams.get('sortKey');
		const sortValue = urlParams.get('sortValue');
		if (sortKey && sortValue) {
			searchParams.set('sortKey', sortKey);
			searchParams.set('sortValue', sortValue);
		}

		activeFilters = [];
		checkedFilters = [];
		applyFilters();
	}

	function applySort(sortKey: string, sortValue: string) {
		// Get existing URL params
		const urlParams = new URLSearchParams($page.url.search);
		searchParams = new URLSearchParams();

		// Preserve filter parameters if they exist
		const filters = urlParams.get('filters');
		if (filters) {
			searchParams.set('filters', filters);
		}

		// Set new sort parameters
		searchParams.set('sortKey', sortKey);
		searchParams.set('sortValue', sortValue);
		activeSort = `${sortKey}_${sortValue}`;

		googleAnalClickedEvent('click_sort', {
			product: {
				category: collectionType
			},
			sortBy: `${sortKey}_${sortValue}`
		});

		goto(`?${searchParams.toString()}`, {
			noScroll: true,
			replaceState: true,
			keepFocus: true
		});
	}

	function formatFilterPrice(price): string {
		return new Intl.NumberFormat('id-ID').format(price);
	}

	onMount(() => {
		activeFilters = [];

		// Initialize from URL params
		const urlParams = new URLSearchParams($page.url.search);
		const filterParams = urlParams.get('filters');
		const sortKey = urlParams.get('sortKey');
		const sortValue = urlParams.get('sortValue');

		if (filterParams) {
			try {
				const decodedFilters = decodeFilterParams(filterParams);
				const parsedFilters = JSON.parse(decodedFilters);

				activeFilters = parsedFilters;

				// Handle price filters separately
				const priceFilters = parsedFilters.filter((f) => f.field === 'price');
				if (priceFilters.length > 0) {
					filterPrice.min = Number(
						priceFilters.find((f) => f.relation === 'greater_than')?.value || 0
					);
					filterPrice.max = Number(
						priceFilters.find((f) => f.relation === 'less_than')?.value || 0
					);
					filterPriceIsDirty = true;
				}

				// Handle non-price filters
				const nonPriceFilters = parsedFilters.filter((f) => f.field !== 'price');
				checkedFilters = nonPriceFilters.map((f) => JSON.stringify({ [f.field]: f.value }));
			} catch (error) {
				console.error('Error parsing filter params:', error);
			}
		}

		if (sortKey && sortValue) {
			activeSort = `${sortKey}_${sortValue}`;
		}

		// Initialize price filter range if available
		const priceFilter = filters.find((filter) => filter.key === 'price');
		if (priceFilter && Array.isArray(priceFilter.value) && !filterPriceIsDirty) {
			filterPrice.min = Number(priceFilter.value[0]?.minPrice || 0);
			filterPrice.max = Number(priceFilter.value[0]?.maxPrice || 0);
		}
	});

	const isEmptyFilter = (filter: Filter) => {
		if (!filter || !filter.value) {
			return true;
		}

		if (Array.isArray(filter.value)) {
			return filter.value.length === 0;
		}

		return false;
	};
</script>

<!-- Reusing the template structure from CollectionFilter.svelte -->
<div
	class="container z-50 {isFilterOpened
		? 'bg-[rgb(36,37,43,0.7)] fixed z-10 top-0 mt-0 h-full w-full min-w-[100%] lg:px-12'
		: ''}"
	class:mt-5={!isFilterOpened}
	class:lg:mt-10={!isFilterOpened}
>
	<!-- Mobile Header -->
	{#if isFilterOpened}
		<div class="bg-white-1 py-3 px-4 lg:hidden">
			<button class="flex items-center" on:click={toggleFilter}>
				<ArrowLeftSLineArrows />
				<Text class="pl-2" type="body-1" color="black-7">Filter</Text>
			</button>
		</div>
	{/if}

	<!-- Sort Buttons -->
	<div
		class="bg-white-2 rounded overflow-x-scroll no-scrollbar px-4 flex lg:flex"
		class:hidden={isFilterOpened}
	>
		<Button
			onClick={toggleFilter}
			variant="primary"
			class="bg-dark-brown-10 ml-3 my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl flex items-center"
		>
			<FilterFillSystem class="pr-2 text-white-1" />
			<Text type="body-1" weight="semibold" color="white-1">
				Filter {#if activeFilters.length > 0}({activeFilters.length}){/if}
			</Text>
		</Button>

		{#each sorts as sort}
			<button
				class:text-white-1={activeSort === `${sort.key}_${sort.value}`}
				class:bg-black-9={activeSort === `${sort.key}_${sort.value}`}
				class="text-sm font-medium border border-black-9 cursor-pointer my-3 mr-3 whitespace-nowrap px-4 py-3 rounded-3xl"
				on:click={() => applySort(sort.key, sort.value)}
			>
				{sort.label}
			</button>
		{/each}
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
					{@const filterValue = filter.value.find((f) => {
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
									class:font-semibold={filter.key === selectedFilter.key}
									class="font-normal [&:not(:last-child)]:pb-6">{filter.label}</span
								>
							</Button>
						{/if}
					{/each}
				</div>

				<div class="overflow-x-scroll">
					{#each filters as filter, index}
						{#if selectedFilter.key === filter.key}
							<div
								id="selectedFilter{index}"
								class="justify-start gap-x-4 gap-y-1 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
							>
								{#if filter.type === 'range'}
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
								{:else if filter.type === 'checkbox' && Array.isArray(filter.value)}
									{#each filter.value as item}
										{@const id = btoa(crypto.randomUUID())}
										<div>
											<label for={id} class="flex justify-stretch w-full cursor-pointer">
												<input
													{id}
													type="checkbox"
													name={filter.label}
													bind:group={checkedFilters}
													value={JSON.stringify({ [filter.key]: item })}
													class="shrink mt-1 border-black-9 bg-white-1 rounded-none text-dark-brown-10 focus:ring-dark-brown-10"
												/>
												<Text class="pl-2" type="body-1">{item}</Text>
											</label>
										</div>
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
							{#if filter.type === 'range'}
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
							{:else if filter.type === 'checkbox' && Array.isArray(filter.value)}
								{#each filter.value as item}
									{@const id = btoa(crypto.randomUUID())}
									<div>
										<label for={id} class="flex justify-stretch w-full cursor-pointer">
											<input
												{id}
												type="checkbox"
												name={filter.label}
												bind:group={checkedFilters}
												value={JSON.stringify({ [filter.key]: item })}
												class="shrink mt-1 border-black-9 bg-white-1 rounded-none text-dark-brown-10 focus:ring-dark-brown-10"
											/>
											<Text class="pl-2" type="body-1">{item}</Text>
										</label>
									</div>
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
