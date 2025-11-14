<script>
	import Video from '$lib/pages/CampaignPage/components/Video/Video.svelte';
	import Banner from '$lib/pages/CampaignPage/components/Banner/Banner.svelte';
	import Slide from '$lib/pages/CampaignPage/components/Slide/Slide.svelte';
	import Boutique from '$lib/pages/CampaignPage/components/Boutique/Boutique.svelte';
	import ProductBanner from '$lib/pages/CampaignPage/components/ProductBanner/ProductBanner.svelte';
	import ProductBannerReversed from '$lib/pages/CampaignPage/components/ProductBannerReversed/ProductBannerReversed.svelte';
	import ProductSlider from '$lib/pages/CampaignPage/components/ProductSlider/ProductSlider.svelte';
	import Celebrate from '$lib/pages/CampaignPage/components/Celebrate/Celebrate.svelte';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import Reels from '$lib/pages/WatchServicePage/components/Reels/Reels.svelte';
	const currentPage = get(page);
	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const store = currentPage.params.store;

	export let data;
	const separatorHref =
		store === 'id'
			? `${baseParams}/watch/category/celebrate-the-new-beginning-with-these-masterpieces-id`
			: `${baseParams}/watch/category/celebrate-the-new-beginning-with-these-masterpieces-sg`;

	const separatorHref2 =
		store === 'id' ? `${baseParams}/watch/delugs` : `${baseParams}/watch/delugs`;

	const separatorImg =
		store === 'sg'
			? 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Desktop_separator_banner_for_new_watch_reco_1544_x_246.jpg?v=1736406769'
			: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Desktop_separator_banner_for_new_watch_reco_1544_x_246.jpg?v=1736406769';

	const separatorImgMobile =
		store === 'sg'
			? 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Mobile_separator_banner_for_new_watch_reco_328_x_136.jpg?v=1736406783'
			: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Mobile_separator_banner_for_new_watch_reco_328_x_136.jpg?v=1736406783';

	const separatorImg2 =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Desktop_separator_banner_for_Delugs_1544_x_246.jpg?v=1736406898';

	const separatorImgMobile2 =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Mobile_separator_banner_for_delugs_328_x_136.jpg?v=1736406900';
</script>

<Video />
<Banner />
<ProductBanner
	items={data.topPicks}
	backgroundImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/subbanner-01.jpg?v=1728542548"
	mobileImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/mobile-1.jpg?v=1728627814"
	backgroundHref="watch/the-connoisseur"
	mobileHref="watch/the-connoisseur"
/>

<ProductBannerReversed
	items={data.muse}
	backgroundImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/subbanner-02.jpg?v=1728628539"
	mobileImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/mobile-banner-02.jpg?v=1728629268"
	backgroundHref="watch/the-muse"
	mobileHref="watch/the-muse"
/>

<ProductBanner
	items={data.achiever}
	backgroundImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/subbanner03.jpg?v=1728630852"
	mobileImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/subbannermobile03.jpg?v=1728630841"
	backgroundHref="watch/the-achiever"
	mobileHref="watch/the-achiever"
/>

<ProductBannerReversed
	items={data.trend}
	backgroundImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/subbanner04.jpg?v=1728631230"
	mobileImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/subbannermobile04.jpg?v=1728631212"
	backgroundHref="watch/the-trendsetter"
	mobileHref="watch/the-trendsetter"
/>

<ProductBanner
	items={data.rising}
	backgroundImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/subbanner05.jpg?v=1728631658"
	mobileImageUrl="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/subbanner05mobile.jpg?v=1728631645"
	backgroundHref="watch/the-rising-star"
	mobileHref="watch/the-rising-star"
/>

<Slide href={separatorHref} imgSrc={separatorImg} mobileSrc={separatorImgMobile} />
<ProductSlider items={data.anniv} />

<Slide href={separatorHref2} imgSrc={separatorImg2} mobileSrc={separatorImgMobile2} />
<ProductSlider items={data.gift} />

<Celebrate />
<Boutique />
