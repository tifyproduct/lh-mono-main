<script lang="ts">
	import { sineIn } from 'svelte/easing';

	import { Drawer } from 'flowbite-svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';

	import type { MenuPageData } from './types';
	import { page } from '$app/stores';
	import { exploreAllMapping } from '$lib/utils/megaMenuHelper';
	import { featureFlagStore } from '$lib/stores/featureFlag';

	export let data: MenuPageData | undefined = undefined;

	let isBrandListPageEnabled = false;

	$: {
		isBrandListPageEnabled = $featureFlagStore.isBrandListPageEnabled;
	}

	let selectedMenuTitle: string | null = null;
	$: selectedMenu = data && data.subs.find((item) => item.title === selectedMenuTitle);

	let selectedSubMenuTitle: string | null = null;
	$: selectedSubMenu = selectedMenu?.menus
		?.find((menu) => menu.menus?.some((subMenu) => subMenu.title === selectedSubMenuTitle))
		?.menus?.find((subMenu) => subMenu.title === selectedSubMenuTitle);

	// Drawer 1 | Menu Drawer
	let hideDrawerLevel1 = true;

	const onClickMenu = (menuTitle: string) => {
		selectedMenuTitle = menuTitle;
		hideDrawerLevel1 = false;
	};

	const onClickBackMenu = () => {
		selectedMenuTitle = null;
		hideDrawerLevel1 = true;
	};

	// Drawer 2 | SubMenu Drawer
	let hideDrawerLevel2 = true;

	const onClickSubMenu = (subMenuTitle: string) => {
		selectedSubMenuTitle = subMenuTitle;
		hideDrawerLevel2 = false;
	};

	const onClickBackSubMenu = () => {
		selectedSubMenuTitle = null;
		hideDrawerLevel2 = true;
	};

	let transitionParams = {
		x: 300,
		duration: 100,
		easing: sineIn
	};
</script>

<div>
	<div class="mb-6">
		<a href={data?.url} class="flex justify-between items-center">
			<Text type="subtitle-3" weight="semibold">
				VIEW {data?.type === 'COLLECTION' ? `COLLECTIONS` : 'PAGE'}
			</Text>
			<ArrowRightSLineArrows />
		</a>
	</div>
	<div class="flex flex-col gap-6">
		{#each data?.subs ?? [] as sub}
			<div
				class="flex flex-row items-center justify-between cursor-pointer"
				role="presentation"
				on:click={() => onClickMenu(sub.title)}
			>
				<div>
					<Text type="subtitle-3" color="black-10" weight="semibold">{sub.title}</Text>
				</div>
				<div>
					<ArrowRightSLineArrows />
				</div>
			</div>
		{/each}
	</div>
	{#if data?.type === 'COLLECTION'}
		<div class="mt-6">
			<a
				href={`/${$page.params.store}/${$page.params.lang}/${exploreAllMapping(data?.title)?.categoryHandle}`}
				class="flex justify-between items-center"
			>
				<Text type="subtitle-3" weight="semibold">
					EXPLORE ALL {exploreAllMapping(data?.title)?.title}
				</Text>
				<ArrowRightSLineArrows />
			</a>
		</div>
	{/if}

	<!-- Menu Drawer -->
	<Drawer
		bgColor="bg-white-1"
		transitionType="fly"
		{transitionParams}
		bind:hidden={hideDrawerLevel1}
		id="drawer-1"
		activateClickOutside={false}
		width="w-full"
		class="overflow-y-auto z-50 p-4 pb-10"
	>
		<div>
			<div
				class="flex flex-row items-center gap-2 cursor-pointer"
				role="presentation"
				on:click={() => onClickBackMenu()}
			>
				<div>
					<ArrowLeftSLineArrows />
				</div>
				<div>
					<Text type="subtitle-3" color="black-10" weight="semibold">{selectedMenu?.title}</Text>
				</div>
			</div>

			<div class="mt-7 flex flex-col gap-6">
				{#if selectedMenu?.title.toUpperCase().includes('CATEGORIES')}
					<a
						href={`/${$page.params.store}/${$page.params.lang}/${exploreAllMapping(data?.title ?? '')?.categoryHandle}`}
						class="cursor-pointer flex justify-between"
					>
						<Text type="subtitle-3" color={'black-10'} weight={'semibold'}>
							EXPLORE ALL CATEGORIES
						</Text>
						<ArrowRightSLineArrows />
					</a>
				{:else if selectedMenu?.title.toUpperCase().includes('BRANDS') && isBrandListPageEnabled}
					<a
						href={`/${$page.params.store}/${$page.params.lang}/brand/${exploreAllMapping(data?.title ?? '')?.brandHandle}`}
						class="cursor-pointer flex justify-between"
					>
						<Text type="subtitle-3" color={'black-10'} weight={'semibold'}>EXPLORE ALL BRANDS</Text>
						<ArrowRightSLineArrows />
					</a>
				{/if}

				{#each selectedMenu?.menus || [] as menu}
					<div>
						<a href={!menu?.haveSubs && menu?.url ? menu.url : ''} class="cursor-pointer">
							<Text
								type="subtitle-3"
								color={`${menu?.haveSubs ? 'black-10' : 'black-6'}`}
								weight={`${menu?.haveSubs ? 'semibold' : 'regular'}`}
							>
								{menu.title.toUpperCase()}
							</Text>
						</a>

						<div class="mt-3">
							{#if menu?.haveSubs}
								<div class="flex flex-col gap-4">
									{#each menu.menus || [] as subMenu}
										{#if subMenu?.menus?.length ?? 0 > 0}
											<div
												class="flex flex-row items-center justify-between cursor-pointer"
												role="presentation"
												on:click={() => onClickSubMenu(subMenu.title)}
											>
												<div>
													<Text type="subtitle-3" color="black-6">
														{subMenu.title.toUpperCase()}
													</Text>
												</div>
												<div>
													<ArrowRightSLineArrows />
												</div>
											</div>
										{:else}
											<a href={subMenu.url} class="cursor-pointer">
												<Text type="subtitle-3" color="black-6">{subMenu.title.toUpperCase()}</Text>
											</a>
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Drawer>

	<!-- SubMenu Drawer -->
	<Drawer
		bgColor="bg-white-1"
		transitionType="fly"
		{transitionParams}
		bind:hidden={hideDrawerLevel2}
		id="drawer-2"
		activateClickOutside={false}
		width="w-full"
		class="overflow-y-auto z-50 p-4 pb-10"
	>
		<div>
			<div
				class="flex flex-row items-center gap-2 cursor-pointer"
				role="presentation"
				on:click={() => onClickBackSubMenu()}
			>
				<div>
					<ArrowLeftSLineArrows />
				</div>
				<div>
					<Text type="subtitle-3" color="black-10" weight="semibold">
						{selectedSubMenu?.title?.toUpperCase()}
					</Text>
				</div>
			</div>

			<div class="mt-7 flex flex-col gap-6">
				{#each selectedSubMenu?.menus || [] as subMenu}
					<div>
						<a href={subMenu.url} class="cursor-pointer">
							<Text type="subtitle-3" color="black-6">{subMenu.title.toUpperCase()}</Text>
						</a>
					</div>
				{/each}
			</div>
		</div>
	</Drawer>
</div>
