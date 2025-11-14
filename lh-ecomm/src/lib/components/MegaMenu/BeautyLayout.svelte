<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	import { Accordion, AccordionItem } from 'flowbite-svelte';

	import { ArrowDownSLineArrows, ArrowRightSLineArrows, ArrowUpSLineArrows } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';

	import type { MegaMenuData } from './types';

	export let data: MegaMenuData | undefined = undefined;

	let mainMenus = data?.subs || [];

	let selectedMainMenu: string = mainMenus[0].title;

	$: selectedMainMenuItems = mainMenus.find((main) => main.title === selectedMainMenu)?.menus || [];

	const handleMainMenuClick = (title: string) => {
		selectedMainMenu = title;
	};

	const dispatch = createEventDispatcher();
</script>

<div class="pt-4 lg:pt-8 pb-9 lg:pb-18">
	<div class="flex flex-row justify-start px-[48px] gap-6">
		<div class="flex flex-col gap-6 border-r min-w-[200px]">
			{#each mainMenus as mainMenu}
				<div role="presentation" on:click={() => handleMainMenuClick(mainMenu.title)}>
					<Text
						type="body-1"
						color={selectedMainMenu === mainMenu.title ? 'black-10' : 'black-7'}
						weight={selectedMainMenu === mainMenu.title ? 'semibold' : 'regular'}
						class="cursor-pointer"
					>
						{mainMenu.title.toUpperCase()}
					</Text>
				</div>
			{/each}
		</div>

		<div class="flex flex-wrap flex-1">
			{#each selectedMainMenuItems as mainMenuItems}
				<div class="basis-1/6 px-5">
					<a
						href={mainMenuItems.url}
						on:click={() => {
							dispatch('close-navbar');
						}}
					>
						{#if mainMenuItems.title.toUpperCase().includes('EXPLORE ALL')}
							<span class="flex justify-between items-center">
								<Text type="body-2" color="black-10" class="cursor-pointer">
									{mainMenuItems.title.toUpperCase()}
								</Text>
								<ArrowRightSLineArrows />
							</span>
						{:else}
							<Text
								type="body-2"
								color={`${mainMenuItems?.haveSubs ? 'black-10' : 'black-6'}`}
								weight={`${mainMenuItems?.haveSubs ? 'semibold' : 'regular'}`}
								class={`${mainMenuItems?.haveSubs ? '' : 'cursor-pointer'}`}
							>
								{mainMenuItems.title.toUpperCase()}
							</Text>
						{/if}
					</a>

					{#if mainMenuItems.menus ?? [].length > 0}
						<div class="mt-4">
							{#each mainMenuItems.menus ?? [] as subMenus}
								{#if (subMenus.menus ?? []).length > 0}
									<Accordion flush>
										<AccordionItem
											tag="div"
											borderBottomClass="border-0"
											paddingFlush="pb-3"
											defaultClass="flex gap-1 items-center text-left pb-3"
										>
											<ArrowDownSLineArrows size={24} slot="arrowdown" class="text-black-6" />

											<Text type="body-2" color="black-6" weight="semibold" slot="header">
												{subMenus.title.toUpperCase()}
											</Text>

											<ArrowUpSLineArrows size={24} slot="arrowup" class="text-black-6" />

											<div class="flex flex-col gap-3">
												{#each subMenus.menus ?? [] as subItem}
													<div class={`cursor-pointer ml-3`}>
														<a href={subItem.url}>
															<Text type="body-2" color="black-6">
																{subItem.title.toUpperCase()}
															</Text>
														</a>
													</div>
												{/each}
											</div>
										</AccordionItem>
									</Accordion>
								{:else}
									<div class="mb-3">
										<a href={subMenus.url}>
											<Text type="body-2" color="black-6" class="cursor-pointer">
												{subMenus.title.toUpperCase()}
											</Text>
										</a>
									</div>
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
