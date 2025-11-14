<script lang="ts">
	import { page } from '$app/stores';

	import { get } from 'svelte/store';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';
	import { afterUpdate, onMount } from 'svelte';

	import type { SubBrand } from './types';

	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let collectionType: string;

	const currentPage = get(page);

	let isRightMost = false;
	let isLeftMost = false;

	let scrollContainer: HTMLDivElement;

	const scroll = (howMuch: number) => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: howMuch, behavior: 'smooth' });
		}
	};

	let scrollable = false;

	let updateScrollContainer = () => {
		if (scrollContainer) {
			if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
				scrollable = true;
				return;
			}

			scrollable = false;
		}
	};

	afterUpdate(() => {
		updateScrollContainer();
	});

	onMount(() => {
		isLeftMost = scrollContainer.scrollLeft == 0;
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', () => {
				isLeftMost = scrollContainer.scrollLeft == 0;

				isRightMost =
					scrollContainer.scrollLeft == scrollContainer.scrollWidth - scrollContainer.clientWidth;
			});
		}
	});

	export let subBrandList: SubBrand[];

	const onClickSubBrand = (subBrandName: string) => {
		googleAnalClickedEvent('click_brand_collection', {
			product: {
				category: collectionType,
				collection: subBrandName
			}
		});
	};
</script>

<div class="relative py-6 bg-dark-brown-10 mt-10 lg:mt-14">
	{#if scrollable}
		<button
			on:click={() => {
				scroll(-200);
			}}
			class="cursor-pointer hidden lg:block absolute left-10 top-[45%] z-10"
		>
			<ArrowLeftSLineArrows size="28" class="text-white-1" />
		</button>
	{/if}
	{#if !isLeftMost && scrollable}
		<div
			class="bg-gradient-to-r to-[#FFFFFF00] from-[#302B29] absolute left-0 top-0 h-full w-[80px]"
		/>
	{/if}
	<div
		bind:this={scrollContainer}
		class:custom-scrollbar={scrollable}
		class:justify-center={!scrollable}
		class="justify-center items-start box-content flex flex-nowrap gap-4 snap-mandatory snap-x pt-4 pb-8 overflow-x-scroll"
	>
		{#each subBrandList as item}
			<Button
				variant="link"
				class="p-0 first:ml-4 last:mr-4 flex items-center text-center lg:basis-[31rem] flex-col min-w-[206px] max-w-[206px] lg:min-w-[318px] lg:max-w-[318px] flex-grow "
				href={`${currentPage.url.pathname}/${item.handle}`}
				onClick={() => onClickSubBrand(item.title)}
			>
				<img
					src={item.image}
					alt=""
					class="h-[214px] rounded lg:h-[331px] w-full mb-2 object-cover"
				/>
				<Text color="brown-05" type="subtitle-2" weight="semibold" variant="h2">{item.title}</Text>
			</Button>
		{/each}
	</div>
	{#if !isRightMost && scrollable}
		<div
			class="bg-gradient-to-r from-[#FFFFFF00] to-[#302B29] absolute right-0 top-0 h-full w-[80px]"
		/>
	{/if}
	{#if scrollable}
		<button
			on:click={() => {
				scroll(200);
			}}
			class="cursor-pointer hidden lg:block absolute right-10 top-[45%] z-10"
		>
			<ArrowRightSLineArrows size="28" class="text-white-1" />
		</button>
	{/if}
</div>
