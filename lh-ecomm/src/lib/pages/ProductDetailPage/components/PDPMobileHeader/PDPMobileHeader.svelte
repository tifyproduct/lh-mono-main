<script lang="ts">
	import {
		ArrowLeftLineArrows,
		ArrowRightSLineArrows,
		CloseLineSystem,
		FunctionLineSystem,
		HeartLineHealthMedical,
		Home6LineBuildings,
		More2FillSystem,
		ShareLineSystem,
		ShoppingCartLineFinance
	} from 'svelte-remix';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';
	import { showAuthenticationModal, showErrorToast } from '$lib/stores/authentication';
	import Text from '$lib/components/Text/Text.svelte';
	import CartProductCard from '$lib/components/Navbar/components/CartProductCard/CartProductCard.svelte';
	import { Hr, Popover } from 'flowbite-svelte';
	import { browser } from '$app/environment';
	import Button from '$lib/components/Button/Button.svelte';
	import { isTriggerShowCartAddedMobile } from '$lib/stores/cart';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Search from '$lib/components/Search/Search.svelte';
	import { productObjectSchema } from '$lib/utils/createObjectSchema';
	import { metaObjectSearchQueryStatic, searchPredictQueryByHandle } from '$lib/graphql.util';
	import { get } from 'svelte/store';
	import { EXCLUDED_TAGS } from '$lib/constants.util';
	import type { ProductData } from '$lib/types/product';
	import { collectionUrlValidator } from '$lib/utils/validator';
	import Skeleton from '$lib/components/Skeleton/Skeleton.svelte';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import InlineProductCard from '$lib/components/InlineProductCard/InlineProductCard.svelte';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';
	import type { FormattedProduct, RecommendedCollection } from '$lib/components/Search/types';
	import AuthenticationTab from '$lib/components/AuthenticationModal/AuthenticationTab.svelte';
	import AuthenticationModal from '$lib/components/AuthenticationModal/AuthenticationModal.svelte';

	export let isProduction: boolean = false;
	export let credential;
	export let cart;

	let isShowCart = false;

	let showSocialModal = false;

	let cartTimeout: ReturnType<typeof setTimeout>;

	let isNewLoginEnabled: boolean;
	$: {
		isNewLoginEnabled = $featureFlagStore.isNewLoginEnabled;
	}

	let showModal = false;

	const toogleCartShow = async () => {
		if (!$customerProfileStore?.isLoggedIn) {
			if (isNewLoginEnabled) {
				return (showModal = true);
			} else {
				// return ($showAuthenticationModal = true);
				return (showSocialModal = true);
			}
		}

		await goto(`${baseParams}/cart`);
	};

	function cartUpdated() {
		if (browser && $isTriggerShowCartAddedMobile) {
			isShowCart = true;

			cartTimeout = setTimeout(() => {
				isShowCart = false;
			}, 5000);

			$isTriggerShowCartAddedMobile = false;
		}
	}

	$: cart, cartUpdated();

	const goToCart = async (e: Event) => {
		await goto(`/${$page.params.store}/${$page.params.lang}/cart`);
	};

	const goBack = () => {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			window.location.href = '/';
		}
	};

	let isLoading: boolean = false;
	let showSearch = false;
	let keyword: string;

	let productFormatted: FormattedProduct[] | null = null;
	let recommendedCollection: RecommendedCollection[] = [];

	let isSearch = false;
	$: isSearch = productFormatted != null;

	const currentPage = get(page);
	const storeLocation = currentPage.params.store;

	const baseParams = `/${currentPage.params.store}/${currentPage.params.lang}`;

	const searchQuery = searchPredictQueryByHandle();
	const metaSearch = metaObjectSearchQueryStatic();

	const onClickExploreTopPicks = () => {
		googleAnalClickedEvent('click_explore_top_picks', {});
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

	const closeModal = () => {
		showModal = false;
	};

	const closeAuthentication = () => {
		// $showAuthenticationModal = false;
		showSocialModal = false;
	};

	const closeAuthenticationSuccess = () => {
		// $showAuthenticationModal = false;
		showSocialModal = false;
		window.location.reload();
	};

	const gotoWishlist = () => {
		if (!$customerProfileStore?.isLoggedIn) {
			if (isNewLoginEnabled) {
				showModal = true;
			} else {
				// $showAuthenticationModal = true;
				showSocialModal = true;
			}
		} else {
			goto(`${baseParams}/profile?page=wishlist`);
		}
	};

	// Popup
	const goToHome = () => {
		goto('/');
	};

	const goToMenu = () => {
		goto(`${baseParams}/pages/menu`);
	};

	const share = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Discover Luxury on Luxehouze!',
					text: 'View this amazing find on Luxehouze, your destination for buying and selling luxury goods.',
					url: window.location.href
				});
			} catch (error) {
				console.error('Error sharing content:', error);
			}
		} else {
			console.warn('Web Share API is not supported in this browser.');
		}
	};

	const handleAuthenticationError = (event: CustomEvent) => {
		showErrorToast.set(true);
		setTimeout(() => {
			showErrorToast.set(false);
		}, 10000);
	};
</script>

<div class="flex items-center gap-2 h-[54px] bg-white-1 px-4 py-2 shadow">
	<ArrowLeftLineArrows size={24} on:click={goBack} class="cursor-pointer" />

	<div class="grow">
		<Search
			id="pdp-search"
			placeholder="Explore more"
			{showSearch}
			on:search-clicked={handleOnSearchClicked}
			on:search-changed={handleOnSearchChanged}
			on:cancel-clicked={handleOnCancelSearch}
			on:enter-pressed={handleOnEnterPressed}
		/>
	</div>

	<div class="lg:hidden flex items-center justify-end order-2 lg:order-3 gap-4 ml-auto">
		<span class="relative cursor-pointer" role="presentation" on:click={gotoWishlist}>
			<HeartLineHealthMedical size={20} />
		</span>

		<span class="relative cursor-pointer" role="presentation" on:click={toogleCartShow}>
			{#if cart?.totalQuantity > 0 && $customerProfileStore?.isLoggedIn}
				<div
					class="absolute text-xs text-center w-[17px] h-[17px] leading-snug font-semibold top-2 left-2 bg-red-6 border border-px border-white-1 rounded-full text-white-1"
				>
					{cart?.totalQuantity ?? 0}
				</div>
			{/if}

			<ShoppingCartLineFinance size={20} class="cursor-pointer" />
			{#if isShowCart && cart?.id}
				<div
					class="max-lg:top-0 max-lg:fixed max-lg:bottom-0 max-lg:left-0 max-lg:right-0 absolute lg:-translate-x-1/2 z-40"
				>
					<div
						class="max-lg:w-full max-lg:h-full max-lg:bg-[rgb(36,37,43,0.7)] max-lg:flex max-lg:items-end"
					>
						<div
							class="max-lg:w-full shadow-[0_12px_32px_-16px_rgba(0,0,0,0.16),0_0_1px_0_rgba(0,0,0,0.16)] rounded p-4 border border-dark-brown-05 mt-3 bg-white-1 w-[400px]"
						>
							<div class="flex justify-between py-3 lg:hidden">
								<Text type="body-1" weight="semibold">Added to shopping Cart</Text>
								<Button variant="link">
									<CloseLineSystem />
								</Button>
							</div>
							<Text class="max-lg:hidden" type="body-2" weight="semibold">
								Shopping Cart ({cart?.totalQuantity ?? '0'})
							</Text>
							<div class="pt-3 overflow-y-scroll max-h-[500px]">
								{#each cart?.lines?.nodes ?? [] as item}
									<CartProductCard {item} />
									<Hr hrClass="my-3" />
								{/each}
							</div>
							<Button class="w-full mb-2" variant="primary" onClick={goToCart}>VIEW CART</Button>
						</div>
					</div>
				</div>
			{/if}
		</span>

		<span class="relative cursor-pointer" role="presentation" id="click">
			<More2FillSystem size={20} />
		</span>
	</div>
	<Popover
		class="w-[180px] bg-white-1 z-30 p-0!"
		placement="bottom"
		triggeredBy="#click"
		trigger="click"
		offset={18}
	>
		<ul>
			<li>
				<button
					type="button"
					class="flex items-center gap-2 w-full text-left p-2 cursor-pointer"
					on:click={goToHome}
				>
					<Home6LineBuildings size={14} />
					<Text type="body-2" color="black-6" weight="regular">Back to Home</Text>
				</button>
			</li>
			<li>
				<button
					type="button"
					class="flex items-center gap-2 w-full text-left p-2 cursor-pointer"
					on:click={goToMenu}
				>
					<FunctionLineSystem size={14} />
					<Text type="body-2" color="black-6" weight="regular">Back to Menu</Text>
				</button>
			</li>
			<li>
				<button
					type="button"
					class="flex items-center gap-2 w-full text-left p-2 cursor-pointer"
					on:click={share}
				>
					<ShareLineSystem size={14} />
					<Text type="body-2" color="black-6" weight="regular">Share</Text>
				</button>
			</li>
		</ul>
	</Popover>
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

{#if showModal && !$customerProfileStore?.isLoggedIn}
	<AuthenticationTab bind:isModalOpen={showModal} on:closeModal={closeModal} />
{/if}
{#if showSocialModal && !$customerProfileStore?.isLoggedIn}
	<AuthenticationModal
		credentialSoc={credential}
		on:close={closeAuthentication}
		on:close-success={closeAuthenticationSuccess}
		on:error={handleAuthenticationError}
	/>
{/if}
