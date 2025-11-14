<script lang="ts">
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	import customerProfileStore from '$lib/stores/customerProfileStore';

	import { get } from 'svelte/store';
	import {
		HeartLineHealthMedical,
		ShoppingCartLineFinance,
		CloseFillSystem,
		ArrowRightSLineArrows,
		CloseLineSystem,
		SearchLineSystem
	} from 'svelte-remix';
	import { collectionUrlValidator } from '$lib/utils/validator';
	import { onMount } from 'svelte';
	import { searchPredictQueryByHandle, metaObjectSearchQueryStatic } from '$lib/graphql.util';
	import { productObjectSchema } from '$lib/utils/createObjectSchema';
	import { isTriggerShowCartAdded } from '$lib/stores/cart';
	import type { CustomerProfile } from '$lib/types/customer';
	import type { ProductData } from '$lib/types/product';
	import { EXCLUDED_TAGS } from '$lib/constants.util';
	import Button from '$lib/components/Button/Button.svelte';
	import Search from '$lib/components/Search/Search.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import InlineProductCard from '$lib/components/InlineProductCard/InlineProductCard.svelte';
	import AuthenticationModal from '$lib/components/AuthenticationModal/AuthenticationModal.svelte';
	import AvatarBadge from '$lib/components/AvatarBadge/AvatarBadge.svelte';
	import CartProductCard from './components/CartProductCard/CartProductCard.svelte';
	import { Hr } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { showAuthenticationModal, showErrorToast } from '$lib/stores/authentication';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';
	import Skeleton from '$lib/components/Skeleton/Skeleton.svelte';
	import AuthenticationTab from '../AuthenticationModal/AuthenticationTab.svelte';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';
	import type { FormattedProduct, RecommendedCollection } from '../Search/types';

	// signin function
	export let credential;
	export let showLoginPopup = false;
	export let showGoogleLogin = false;

	let isNewLoginEnabled: boolean;
	$: {
		isNewLoginEnabled = $featureFlagStore.isNewLoginEnabled;
	}

	let tempSocialLogin: boolean;
	$: {
		tempSocialLogin = $featureFlagStore.tempSocialLogin;
	}

	let showSocialModal = false;

	onMount(() => {
		if (showLoginPopup) {
			// $showAuthenticationModal = true;
			showSocialModal = false;
		}
	});

	const closeAuthentication = () => {
		// $showAuthenticationModal = false;
		showSocialModal = false;
	};

	const closeAuthenticationSuccess = () => {
		// $showAuthenticationModal = false;
		showSocialModal = false;
		window.location.reload();
	};

	export let withSearch: Boolean = true;
	export let customer: CustomerProfile | undefined;
	export let withCart: Boolean = true;
	export let cart;
	export let hideMobileHeader: boolean = false;
	export let isProduction: boolean = false;

	const currentPage = get(page);
	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	let showSearch = false;

	const searchQuery = searchPredictQueryByHandle();
	const metaSearch = metaObjectSearchQueryStatic();

	let storeLocation: string = '';
	let path: string = '';
	let keyword: string;
	let isMobile = true;

	onMount(async () => {
		path = window.location.pathname;
		storeLocation = path.substring(1, 3);
		isShowCart = false;
	});

	let productFormatted: FormattedProduct[] | null = null;

	let recommendedCollection: RecommendedCollection[] = [];
	let isSearch = false;
	let isLoading: boolean = false;

	$: isSearch = productFormatted != null;

	let isShowCart = false;
	let isFromHovered = false;
	let cartTimeout: ReturnType<typeof setTimeout>;

	const toogleCartShow = () => {
		if (!customer?.isLoggedIn) return;

		if (isMobile) return;

		isShowCart = !isShowCart;
		keyword = '';
	};

	const hoverCart = () => {
		isFromHovered = true;
		clearTimeout(cartTimeout);
		if (isShowCart === true) {
			return;
		}

		isFromHovered = true;
		toogleCartShow();
	};

	const unHoverCart = () => {
		if (!isFromHovered) return;

		toogleCartShow();
		isFromHovered = false;
	};

	const getSearch = async (value: string) => {
		if (isLoading) return;

		try {
			isLoading = true;
			let wishlistProducts: string[] = [];

			const wishlistCustomer = await fetch(`/api/customer/wishlist`, {
				method: 'GET'
			});

			const wishlists = await wishlistCustomer.json();

			wishlistProducts = wishlists.list;

			const requesPredict = await fetch('/api/graphql.json', {
				method: 'POST',
				body: JSON.stringify({
					query: searchQuery.schema,
					variables: {
						handle: value
					}
				})
			});
			const resultSearch = await requesPredict.json();

			const { predictiveSearch } = resultSearch.data;

			const productFormattedAll: Array<ProductData> = [];

			const processProduct = (data) => {
				productFormattedAll.push(
					productObjectSchema({
						product: data,
						store: currentPage.params.store,
						lang: currentPage.params.lang,
						wishlists: wishlistProducts
					})
				);
			};

			predictiveSearch.products.forEach((data) => {
				if (isProduction) {
					if (!data.tags.some((tag: string) => EXCLUDED_TAGS.includes(tag))) {
						processProduct(data);
					}
				} else {
					processProduct(data);
				}
			});

			productFormatted = productFormattedAll.filter((x: ProductData) =>
				x.tagAll.includes(currentPage.params.store === 'id' ? 'Indonesia' : 'Singapore')
			);

			recommendedCollection = isProduction
				? predictiveSearch.collections.filter(
						(collection: any) =>
							!collection.title.toLowerCase().includes('freebie') &&
							!collection.title.toLowerCase().includes('test')
					)
				: predictiveSearch.collections.map((collection: any) => collection);

			recommendedCollection = recommendedCollection.map((collection: any) => {
				return {
					title: collection.title,
					url: collectionUrlValidator({
						parentMenu: collection.parentMenu?.value,
						category: collection?.category?.value,
						params: currentPage.params,
						handle: collection.handle,
						brandHandle: collection?.parentCollection?.reference?.handle
					}),
					id: collection.id,
					handle: collection.handle
				};
			});
		} catch (error) {
		} finally {
			isLoading = false;
		}
	};

	const getTopPicks = async () => {
		const searchStaticTop = await fetch('/api/graphql.json', {
			method: 'POST',
			body: JSON.stringify({
				query: metaSearch.schema,
				variables: {
					handle: {
						handle: 'top-picks',
						type: 'headless_search_section'
					}
				}
			})
		});

		const resultMetaSearchStaticTop = await searchStaticTop.json();

		const topPickSearchId =
			resultMetaSearchStaticTop.data.metaobject.productsId.references.nodes.map((product) =>
				productObjectSchema({
					product: product,
					store: currentPage.params.store,
					lang: currentPage.params.lang
				})
			);

		const topPickSearchSg =
			resultMetaSearchStaticTop.data.metaobject.productsSg.references.nodes.map((product) =>
				productObjectSchema({
					product: product,
					store: currentPage.params.store,
					lang: currentPage.params.lang
				})
			);

		storeLocation == 'sg'
			? (productFormatted = topPickSearchSg)
			: (productFormatted = topPickSearchId);
	};

	export const handleOnSearchClicked = async () => {
		showSearch = true;
		window.scrollTo({ top: 0 });
		document.body.style.overflow = 'hidden';
		await getTopPicks();
	};

	const handleOnCancelSearch = () => {
		showSearch = false;
		document.body.style.overflow = '';
	};

	const handleOnSearchChanged = (event: any) => {
		getSearch(event.detail);
		keyword = event.detail;
	};

	const handleOnEnterPressed = async (event: any) => {
		handleOnCancelSearch();
		await goto(`${baseParams}/search?keyword=${event.detail}`);
	};

	let showModal = false;

	const closeModal = () => {
		showModal = false;
	};

	const handleSignIn = () => {
		googleAnalClickedEvent('click_sign_in', {});
		if (isNewLoginEnabled) {
			showModal = true;
		} else {
			// $showAuthenticationModal = true;
			showSocialModal = true;
		}
	};

	const handleSignInSocial = () => {
		// $showAuthenticationModal = true;
		showSocialModal = true;
	};

	function goToCart(e: Event) {
		e?.stopPropagation();

		googleAnalClickedEvent('click_cart_page', {});

		goto(`${baseParams}/cart`);
	}

	function goToSWU() {
		googleAnalClickedEvent('click_button_sell_with_us', {
			location: {
				name: 'Mega Menu'
			}
		});

		goto(`${baseParams}/sell-with-us`);
	}

	function cartUpdated() {
		if (browser && $isTriggerShowCartAdded) {
			isShowCart = true;

			cartTimeout = setTimeout(() => {
				isShowCart = false;
			}, 5000);

			$isTriggerShowCartAdded = false;
		}
	}

	$: cart, cartUpdated();

	const checkHasLoggedIn = () => {
		if (!customer?.isLoggedIn) {
			let query = new URLSearchParams($page.url.searchParams.toString());
			query.set('showLogin', 'true');
			query.set('redirect', 'cart');
			goto(`?${query.toString()}`);
			if (isNewLoginEnabled) {
				showModal = true;
			} else {
				// $showAuthenticationModal = true;
				showSocialModal = true;
			}
			return;
		}

		goto(`${baseParams}/cart`);
	};

	onMount(() => {
		const updateScreenSize = () => {
			isMobile = window.innerWidth <= 640;
		};

		updateScreenSize();
		window.addEventListener('resize', updateScreenSize);

		return () => {
			window.removeEventListener('resize', updateScreenSize);
		};
	});

	const onClickExploreTopPicks = () => {
		googleAnalClickedEvent('click_explore_top_picks', {});
	};

	const gotoWishlist = () => {
		goto(`${baseParams}/profile?page=wishlist`);

		if (!$customerProfileStore?.isLoggedIn) {
			if (isNewLoginEnabled) {
				showModal = true;
			} else {
				// $showAuthenticationModal = true;
				showSocialModal = true;
			}
		}
	};

	const handleAuthenticationError = (event: CustomEvent) => {
		showErrorToast.set(true);
		setTimeout(() => {
			showErrorToast.set(false);
		}, 10000);
	};
</script>

<nav>
	<div
		class:max-lg:hidden={hideMobileHeader}
		class="flex items-center justify-between gap-1 sm:gap-4 px-4 lg:px-12 pt-3 sm:pt-5 py-0 lg:py-5 order-1 flex-wrap lg:flex-nowrap"
		class:max-lg:py-2={showSearch}
	>
		<a data-sveltekit-reload href={baseParams} class="order-1" class:max-lg:hidden={showSearch}>
			<!-- TODO: use svg assets file, like pure svg not png wrappers -->
			<img
				class="max-w-32 sm:max-w-52 w-full hidden sm:block"
				src="/img/main-logo.png"
				alt="Luxehouze Logo"
			/>
			<img class="w-[20px] block sm:hidden" src="/img/main-logo-mobile.png" alt="Luxehouze Logo" />
		</a>

		{#if withSearch || showSearch}
			<div
				class={`order-3 lg:order-2 mt-0 flex flex-col 
				${isMobile && showSearch ? 'w-full' : 'w-8/12 sm:w-full lg:w-6/12'}`}
			>
				<div class="flex">
					<button
						class="mr-2 lg:hidden"
						class:max-lg:hidden={!showSearch}
						on:click={handleOnCancelSearch}
					>
						<CloseFillSystem />
					</button>
					<div class="grow">
						<Search
							id="navbar-search"
							placeholder="What are you looking for?"
							{showSearch}
							on:search-clicked={handleOnSearchClicked}
							on:search-changed={handleOnSearchChanged}
							on:cancel-clicked={handleOnCancelSearch}
							on:enter-pressed={handleOnEnterPressed}
						/>
					</div>
				</div>
			</div>
		{/if}

		<div
			class="flex items-center order-3 sm:order-2 lg:order-3 gap-4 cursor-pointer"
			class:max-lg:hidden={showSearch}
		>
			<HeartLineHealthMedical size={20} on:click={gotoWishlist} />
			{#if $page.params.store === 'id'}
				<span
					class="relative"
					role="presentation"
					on:mouseleave={unHoverCart}
					on:mouseenter={hoverCart}
					on:click={checkHasLoggedIn}
					class:hidden={!withCart}
				>
					<div
						class="absolute text-xs text-center w-[17px] h-[17px] leading-snug font-semibold top-2 left-2 bg-red-6 border border-px border-white-1 rounded-full text-white-1"
						class:hidden={!customer?.isLoggedIn}
					>
						{cart?.totalQuantity ?? 0}
					</div>
					<ShoppingCartLineFinance size={20} class="cursor-pointer" />
					{#if isShowCart && cart?.id}
						<div
							class="max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 absolute lg:-translate-x-1/2 z-40"
						>
							<div
								class="max-lg:w-full max-lg:h-dvh max-lg:bg-[rgb(36,37,43,0.7)] max-lg:flex max-lg:items-end"
							>
								<div
									class="max-lg:w-full shadow-[0_12px_32px_-16px_rgba(0,0,0,0.16),0_0_1px_0_rgba(0,0,0,0.16)] rounded p-4 border border-dark-brown-05 mt-3 bg-white-1 w-[400px]"
								>
									<div class="flex justify-between py-3 lg:hidden">
										<Text type="body-1" weight="semibold">Added to shopping Cart</Text>
										<CloseLineSystem on:click={toogleCartShow} />
									</div>
									<Text class="max-lg:hidden" type="body-2" weight="semibold">
										Shopping Cart ({cart?.totalQuantity ?? '0'})
									</Text>
									<div class="pt-3 overflow-y-scroll lg:max-h-[500px]">
										{#each cart?.lines?.nodes ?? [] as item}
											<CartProductCard {item} />
											<Hr hrClass="my-3" />
										{/each}
									</div>
									<Button class="w-full" variant="primary" onClick={goToCart}>VIEW CART</Button>
								</div>
							</div>
						</div>
					{/if}
				</span>
			{/if}

			<span class="hidden lg:block">
				{#if !customer?.isLoggedIn}
					<Button variant="link" padding={'px-3 py-2'} onClick={handleSignIn}>SIGN IN</Button>
					{#if tempSocialLogin}
						<Button variant="link" padding={'px-3 py-2'} onClick={handleSignInSocial}>SOCIAL</Button
						>
					{/if}
				{:else}
					<AvatarBadge {customer} />
				{/if}
			</span>

			<span class="hidden lg:block">
				<Button variant="primary" padding="px-3 py-2 whitespace-nowrap" onClick={() => goToSWU()}>
					SELL YOUR ITEM
				</Button>
			</span>
		</div>
	</div>

	{#if showSearch}
		<div
			class="absolute left-0 search__wrapper w-full h-[100vh] z-40"
			on:click={handleOnCancelSearch}
			role="presentation"
		>
			<div
				role="presentation"
				class="bg-white-1 p-4 pb-6 h-full overflow-y-scroll no-scrollbar"
				on:click|stopPropagation
			>
				<div class="pb-5">
					<Text type="body-1" weight="semibold" color="black-7">
						{isSearch && keyword ? 'Search Result' : 'Top Picks'}
					</Text>
				</div>
				<div class="hidden lg:flex overflow-y-scroll gap-8">
					{#if isLoading}
						{#each Array(6) as _}
							<div>
								<Skeleton width="w-[208px]" height="h-[356px]" />
							</div>
						{/each}
					{:else if !isLoading}
						{#if productFormatted}
							{#each productFormatted as item}
								{@const productItem = {
									name: item.title,
									description: item.vendor,
									initialPrice: item.normalPrice,
									discountPrice: item.salePrice,
									discountPercentage: item.percentage ?? 0,
									imageURL: item.image?.url,
									tags: item.tags,
									tagAll: item.tagAll,
									imageHeight: 'h-[330px]',
									url: item.url,
									showPrice: item.showPrice,
									productId: item.id,
									wishlisted: item.wishlisted,
									discount: item.discount,
									preOrder: item.preOrder,
									outOfStock: item.outOfStock,
									newArrival: item.newArrival
								}}

								<div class="[&:not(:last-child)]:pr-4 max-h-[450px] max-w-[276px]">
									<ProductCard
										on:clicked={() => {
											setTimeout(() => {
												handleOnCancelSearch();
											}, 0);
										}}
										googleEvent="click_search_product_recommendation"
										class="cursor-pointer shrink-0 basis-36 md:basis-80 2xl:basis-[19rem] snap-start "
										{...productItem}
									/>
								</div>
							{/each}
						{/if}
					{/if}
				</div>
				<div class="flex flex-wrap lg:hidden">
					{#if isLoading}
						<div class="flex gap-2 flex-wrap">
							{#each Array(6) as _}
								<Skeleton width="w-[150px]" height="h-[56px]" />
							{/each}
						</div>
					{:else if !isLoading}
						{#if productFormatted}
							{#each productFormatted as item}
								<div class="w-1/2 even:pl-2 odd:pr-2">
									<InlineProductCard
										googleEvent="click_search_product_recommendation"
										description={item.title}
										imageURL={item.image.src}
										url={item.url}
									/>
								</div>
							{/each}
						{/if}
					{/if}
				</div>

				{#if !keyword}
					<div class="pt-4 -px-2 lg:pt-5">
						<a
							href={`${baseParams}/watch/popular-watches`}
							class="flex items-center cursor-pointer"
							on:click={onClickExploreTopPicks}
						>
							<Text color="black-10" type="body-1" weight="regular">Explore Top Picks</Text>
							<span class="ml-4">
								<ArrowRightSLineArrows />
							</span>
						</a>
					</div>
				{/if}
				{#if recommendedCollection.length > 0}
					<div class="pb-5 pt-6">
						<Text type="body-1" weight="semibold" color="black-7">Recommended Collections</Text>
					</div>
					<div class="flex flex-wrap gap-y-7 gap-x-2">
						{#each recommendedCollection as col}
							{#if col.url}
								<a
									on:click={() =>
										googleAnalClickedEvent('click_collection_search', {
											product: { collection: col.title },
											reference: { name: keyword }
										})}
									href={col.url}
								>
									<span class="bg-dark-brown-05 rounded-xl p-3 mb-2">
										<Text color="black-7" type="body-2" weight="regular">{col.title}</Text>
									</span>
								</a>
							{/if}
						{/each}
					</div>
				{/if}
			</div>
		</div>
	{/if}
	{#if showModal && !customer?.isLoggedIn}
		<AuthenticationTab
			bind:isModalOpen={showModal}
			on:closeModal={closeModal}
			credentialSoc={credential}
			on:close-success={closeAuthenticationSuccess}
			{showGoogleLogin}
			{customer}
		/>
	{/if}
	{#if showSocialModal && !customer?.isLoggedIn}
		<AuthenticationModal
			credentialSoc={credential}
			on:close={closeAuthentication}
			on:close-success={closeAuthenticationSuccess}
			on:error={handleAuthenticationError}
		/>
	{/if}
</nav>

<style>
	.search__wrapper {
		background-color: rgba(36, 37, 43, 0.5);
	}
</style>
