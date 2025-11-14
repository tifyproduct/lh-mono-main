<script lang="ts">
	import Banner from '$lib/components/Banner/Banner.svelte';
	import RelatedArticle from '$lib/components/RelatedArticle/RelatedArticle.svelte';
	import ExploreByBrand from '$lib/pages/CollectionLandingPage/components/ExploreByBrand/ExploreByBrand.svelte';
	import ExploreByStyle from '$lib/pages/CollectionLandingPage/components/ExploreByStyle/ExploreByStyle.svelte';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';
	import OurPicks from './components/OurPicks/OurPicks.svelte';
	import CompleteCollection from './components/CompleteCollection/CompleteCollection.svelte';

	export let data;

	let topBannerData: any = [];

	const topBannerFormatter = () => {
		const rawBanner = data.topBanner;

		for (let i = 0; i < rawBanner?.desktop?.length; i++) {
			topBannerData[i] = {
				urlBanner: rawBanner.desktop[i].banner,
				urlLink: rawBanner.desktop[i].link
			};
		}

		for (let i = 0; i < rawBanner?.mobile?.length; i++) {
			topBannerData[i] = { ...topBannerData[i], urlBannerMobile: rawBanner.mobile[i].banner };
		}
	};

	$: data && topBannerFormatter();
</script>

<div class="pb-10 lg:pb-[110px]">
	{#if topBannerData?.length > 0}
		<div class="container max-w-[1600px]">
			<Banner bannerHeightDesktop="!h-[340px]" data={topBannerData} />
		</div>
	{/if}

	{#if data.subBrands?.length > 0}
		<div class="container px-4">
			<ExploreByBrand data={data.subBrands} collectionType={data.type} />
		</div>
	{/if}

	{#if data.exploreBy?.list?.length > 0}
		<ExploreByStyle data={data.exploreBy} collectionType={data.type} />
	{/if}

	{#if data.topPicks[0]}
		<OurPicks productData={data.topPicks[0]} collectionType={data.type} />
	{/if}

	{#if data.completeCollection?.products?.length > 0}
		<CompleteCollection productData={data.completeCollection} />
	{/if}

	{#if data?.bannerPromoted?.banner}
		<div class="container px-4 overflow-hidden pt-10 lg:pt-20">
			<a
				href={data.bannerPromoted.link}
				on:click={() => {
					googleAnalClickedEvent('click_sell_now', {
						product: {
							category: data.type
						}
					});
				}}
			>
				<img
					src={data.bannerPromoted.banner}
					alt=""
					class="h-full w-full object-cover rounded"
					loading="lazy"
				/>
			</a>
		</div>
	{/if}

	{#if data?.articles && data?.articles?.length > 0}
		<div class="container px-4 pt-10 lg:pt-[60px]">
			<RelatedArticle articles={data.articles} />
		</div>
	{/if}
</div>
