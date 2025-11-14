<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { ArrowRightLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	import type { MegaMenuData, MegaMenuSubs } from './types';
	import { afterUpdate } from 'svelte';

	export let data: MegaMenuData | undefined = undefined;

	let slicedData: MegaMenuData | undefined = undefined;

	const sliceData = (data: MegaMenuData): MegaMenuData => {
		if (data.haveSubs) {
			return {
				...data,
				subs: data.subs.map((sub) => {
					if (sub.menus && sub.menus.length > 6) {
						const exploreItem: MegaMenuSubs | undefined = sub.menus.find((menu) =>
							menu.title.includes('EXPLORE ALL')
						);

						let newProcessedMenus = [...sub.menus.slice(0, 6)];

						exploreItem ? newProcessedMenus.push(exploreItem) : newProcessedMenus;

						return {
							...sub,
							menus: newProcessedMenus,
							sliced: true
						};
					}
					return sub;
				})
			};
		}
		return data;
	};

	const dispatch = createEventDispatcher();

	afterUpdate(() => {
		if (data) {
			slicedData = sliceData(data);
		}
	});
</script>

<div class="flex justify-center gap-[81px] pt-4 lg:pt-8 pb-9 lg:pb-18">
	{#each slicedData?.subs ?? [] as sub}
		<div>
			<Text type="body-1" color="black-7" weight="semibold" class="pr-4">
				{sub.title.toUpperCase()}
			</Text>
			{#each sub.menus || [] as subItem}
				<div class="mt-[15px]">
					<a
						href={subItem.url}
						on:click={() => {
							dispatch('close-navbar');
						}}
					>
						{#if subItem.title.toUpperCase().includes('EXPLORE ALL')}
							<span class="flex justify-between items-center">
								<Text type="body-2" color="black-10" class="cursor-pointer">
									{subItem.title.toUpperCase()}
								</Text>
								<ArrowRightSLineArrows />
							</span>
						{:else}
							<Text type="body-2" color="black-6" class="cursor-pointer">
								{subItem.title.toUpperCase()}
							</Text>
						{/if}
					</a>
				</div>
			{/each}
			<!-- {#if sub.sliced}
				<a
					href={`${slicedData?.url}`}
					on:click={() => {
						dispatch('close-navbar');
					}}
					class="mt-[15px] flex items-center gap-4 cursor-pointer"
				>
					<Text type="body-2" color="black-10">EXPLORE ALL</Text>
					<ArrowRightSLineArrows size={16} />
				</a>
			{/if} -->
		</div>
	{/each}

	{#if data?.promotedSection}
		<div>
			<Text type="body-1" color="black-7" weight="semibold">PROMOTED</Text>
			<img class="max-w-[409px] w-full mt-4" alt="promoted" src={data?.promotedSection?.banner} />
			<div class="mt-4">
				<Button variant="link" padding="p-0" href={data?.promotedSection?.bannerLink}>
					READ MORE
					<ArrowRightLineArrows size={20} class="ml-[8px]" />
				</Button>
			</div>
		</div>
	{/if}
</div>
