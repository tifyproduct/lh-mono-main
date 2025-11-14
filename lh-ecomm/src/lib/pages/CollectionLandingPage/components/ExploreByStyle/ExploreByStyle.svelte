<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import { afterUpdate } from 'svelte';

	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let data;
	export let collectionType: string;

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

	const onClickStyle = (styleName: string) => {
		googleAnalClickedEvent('click_explore_by', {
			product: {
				category: collectionType,
				style: styleName
			}
		});
	};
</script>

<div class="container relative px-4 pt-8 lg:pt-[60px]">
	<div class="flex lg:justify-center lg:pb-7">
		<Text type="subtitle-1" weight="semibold" color="black-10">{data.title.toUpperCase()}</Text>
	</div>
	{#if scrollable}
		<button
			on:click={() => {
				scroll(-200);
			}}
			class="cursor-pointer hidden xl:block absolute -left-8 top-1/2 -translate-y-1/2"
		>
			<ArrowLeftSLineArrows size="28" />
		</button>
	{/if}
	<div
		bind:this={scrollContainer}
		class:custom-scrollbar={scrollable}
		class:justify-center={!scrollable}
		class="box-content flex flex-nowrap gap-4 snap-mandatory snap-x pt-4 pb-8 overflow-x-scroll {scrollable
			? ''
			: 'no-scrollbar'}"
	>
		{#each data.list as item}
			<a
				href={`${item.url}`}
				class="flex items-center text-center lg:basis-[31rem] flex-col min-w-[156px] max-w-[156px] lg:min-w-[318px] lg:max-w-[318px] flex-grow"
				on:click={() => onClickStyle(item.title)}
			>
				<img
					src={item.image}
					alt=""
					class="h-[172px] lg:h-[331px] w-full mb-2 object-cover rounded"
				/>
				<Text color="black-10" type="subtitle-2" weight="semibold">{item.title.toUpperCase()}</Text>
			</a>
		{/each}
	</div>
	{#if scrollable}
		<button
			on:click={() => {
				scroll(200);
			}}
			class="cursor-pointer hidden xl:block absolute -right-8 top-1/2 -translate-y-1/2"
		>
			<ArrowRightSLineArrows size="28" />
		</button>
	{/if}
</div>
