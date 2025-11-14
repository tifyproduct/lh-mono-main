<script lang="ts">
	import type { BrandListItem } from './type.ts';
	import Text from '$lib/components/Text/Text.svelte';
	import { Hr, Input } from 'flowbite-svelte';
	import { BRAND_LIST } from './brandList';
	import {
		ArrowLeftSLineArrows,
		HeartLineHealthMedical,
		SearchLineSystem,
		ShoppingCartLineFinance
	} from 'svelte-remix';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;

	let stickyEl: HTMLElement | undefined;
	let isSticky = false;

	const type: string = $page.params.type ?? 'all';
	let category: string[] | undefined;
	let brandList: BrandListItem[] | undefined;
	let keyword: string = '';
	let selectedGroup = 'A';

	const handleCartClicked = () => {
		goto(`${baseParams}/cart`);
	};

	const handleHeartClicked = () => {
		goto(`${baseParams}/profile?page=wishlist`);
	};

	const handleBack = () => {
		if (browser) window.history.back();
	};

	$: {
		switch (type) {
			case 'all':
				category = ['beauty', 'watch', 'bag', 'jewelry'];
				break;
			case 'beauty':
				category = ['beauty'];
				break;
			case 'watch':
				category = ['watch'];
				break;
			case 'fashion':
				category = ['bag', 'jewelry'];
				break;
		}

		brandList = BRAND_LIST.map((group) => ({
			title: group.title,
			items: group.items.filter(
				(item) =>
					item.location == $page.params.store &&
					item.lang == $page.params.lang &&
					category?.includes(item.category) &&
					item.name.toLowerCase().includes(keyword?.toLowerCase())
			)
		}));
	}

	const checkStickyState = () => {
		console.log(isSticky);
		if (stickyEl) {
			if (stickyEl.getBoundingClientRect().top === 0 && !isSticky) {
				console.log('a');
				isSticky = true;
			} else if (stickyEl.getBoundingClientRect().top > 0 && isSticky) {
				console.log('b');
				isSticky = false;
			}
		}
	};

	if (typeof window !== 'undefined') {
		window.addEventListener('scroll', checkStickyState);
	}

	const goToSection = (id: string | undefined) => {
		if (!id) return;

		selectedGroup = id.slice(0, id.indexOf('-sec'));

		const targetElement = document.getElementById(id);

		if (targetElement) {
			const offset = 200; // Adjust this value to account for sticky header height
			const elementPosition = targetElement.getBoundingClientRect().top + window.scrollY;
			const scrollToPosition = elementPosition - offset;

			window.scrollTo({
				top: scrollToPosition,
				behavior: 'smooth'
			});
		}
	};
</script>

<div class="mb-10">
	<div>
		<div
			class={`sticky top-0 bg-white-1 transition-shadow max-lg:shadow-md ${isSticky ? 'lg:border-b-2 lg-pb-5 lg:pt-1 ' : ''}`}
			bind:this={stickyEl}
		>
			<div class="container px-4">
				<div
					class="flex flex-row items-center gap-2 cursor-pointer py-4 lg:hidden"
					role="presentation"
				>
					<div>
						<ArrowLeftSLineArrows on:click={handleBack} />
					</div>
					<div class="flex justify-between w-full">
						<div>
							<Text type="subtitle-3" color="black-10" weight="semibold">Brands</Text>
						</div>
						<div class="flex gap-4">
							<HeartLineHealthMedical size={20} on:click={handleHeartClicked} />
							<ShoppingCartLineFinance
								size={20}
								on:click={handleCartClicked}
								class="cursor-pointer"
							/>
						</div>
					</div>
				</div>
				<!-- MOBILE -->
				<div class="py-2 block lg:hidden">
					<Input
						type="text"
						placeholder="Search Brand"
						class="border border-black-5 rounded py-2 px-4 placeholder-black-4 text-black-10 bg-white"
						bind:value={keyword}
					>
						<div slot="left">
							<SearchLineSystem class="text-black-6" size={20} />
						</div>
					</Input>
				</div>
				<!-- <div class="bg-black-2 h-[300px]"></div> -->
				<div class="lg:mt-11 flex justify-between">
					<Text class="hidden lg:block" type="subtitle-1" weight="semibold">Brands</Text>
					<div class="w-1/3 block max-lg:hidden">
						<Input
							type="text"
							placeholder="Search Brand"
							class="border border-black-5 rounded py-2 px-4 placeholder-black-4 text-black-10 bg-white"
							bind:value={keyword}
						>
							<div slot="left">
								<SearchLineSystem class="text-black-6" size={20} />
							</div>
						</Input>
					</div>
				</div>
				{#if brandList}
					<div class="flex py-3 lg:mt-8 overflow-scroll max-w-full no-scrollbar">
						{#each brandList as group, index}
							<span class="mr-6 rounded px-3" class:bg-beige-10={selectedGroup == group.title}>
								<a
									href={undefined}
									on:click={() =>
										goToSection(group.items.length > 0 ? `${group.title}-sec` : undefined)}
									class={`${group.items.length < 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
								>
									<Text
										type="subtitle-3"
										color={group.items.length < 1
											? 'black-2'
											: selectedGroup == group.title
												? 'white-1'
												: 'beige-10'}
									>
										{group.title}
									</Text>
								</a>
							</span>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<div class="container px-4">
			{#if brandList}
				<Hr />
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full">
					{#each brandList as group}
						{#if group.items.length > 0}
							<div id={`${group.title}-sec`}>
								<div class="pb-5 mb-5 border-b border-black-2">
									<Text type="subtitle-1" weight="semibold">{group.title}</Text>
								</div>
								<div class="flex flex-col">
									{#each group.items as brandItem}
										<a
											href={`/${$page.params.store}/${$page.params.lang}/${brandItem.category}/${brandItem.handle}`}
										>
											<Text type="subtitle-3" class="mb-7">{brandItem.name}</Text>
										</a>
									{/each}
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>
