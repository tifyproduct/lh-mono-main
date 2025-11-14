<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Hero from '$lib/pages/ExclusiveDealPage/components/Hero/Hero.svelte';
	import SurabayaCollection from '$lib/pages/ExclusiveDealPage/components/SurabayaCollection/SurabayaCollection.svelte';
	import Banner from '$lib/pages/ExclusiveDealPage/components/ExclusiveBanner/ExclusiveBanner.svelte';
	export let data;
	import { page } from '$app/stores';
	import Watches from '$lib/pages/ExclusiveDealPage/components/Watches/Watches.svelte';
	import LimitedOffer from '$lib/pages/ExclusiveDealPage/components/LimitedOffer/LimitedOffer.svelte';
	import PreOrder from '$lib/pages/ConciergePage/components/PreOrder/PreOrder.svelte';
	import Testimonials from '$lib/pages/HomePage/components/Testimonials/Testimonials.svelte';
	import GoogleReview from '$lib/components/GoogleReviews/GoogleReviews.svelte';
	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const WatchesUrl = `${baseParams}/watch`;
	const LimitedOfferUrl = `${baseParams}/promotions/perfect-companions`;
</script>

<Hero />
<SurabayaCollection items={data.surabayaCollection} />
<Banner
	src="https://id.luxehouze.com/cdn/shop/files/Rolexperience_Separator_Banner_2_1464_x_466_px_x3_1.jpg?v=1721019995&width=1100"
	href={WatchesUrl}
/>
<div class="mt-10 md:mt-[60px]">
	<Watches items={data.watches} />
</div>
<Banner
	src="https://id.luxehouze.com/cdn/shop/files/Accessories_30_Desktop_Homepage_Banner_ID_1544_x_500_px_x3_-1_1880x.jpg?v=1720776835"
	href={LimitedOfferUrl}
	className="mt-8"
/>
<LimitedOffer items={data.limitedOffer} />
<PreOrder items={data.preOrder} />
<div class="mt-10 lg:mt-14">
	<Testimonials />
</div>

<div class="bg-white py-10 lg:pt-10 lg:pb-20">
	<GoogleReview review={data.googleReview} />
</div>
