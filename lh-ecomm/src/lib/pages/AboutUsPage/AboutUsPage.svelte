<script>
	import Trusted from '$lib/pages/AboutUsPage/components/Trusted/Trusted.svelte';
	import WhyUs from '$lib/pages/AboutUsPage/components/WhyUs/WhyUs.svelte';
	import Banner from '$lib/components/Banner/Banner.svelte';
	import Offer from '$lib/pages/AboutUsPage/components/Offer/Offer.svelte';
	import BannerImage from '$lib/assets/static/about-us/aboutusimage.webp';
	import Video from '$lib/pages/AboutUsPage/components/Video/Video.svelte';
	import Value from '$lib/pages/AboutUsPage/components/Value/Value.svelte';
	import Guarantee from '$lib/pages/AboutUsPage/components/Guarantee/Guarantee.svelte';
	import Related from '$lib/pages/AboutUsPage/components/Related/Related.svelte';
	const BannerImages = [
		{
			bannerAlt: 'About Us Banner',
			urlBanner: BannerImage,
			urlBannerMobile: 'BannerImage'
		}
	];
</script>

<Trusted />
<WhyUs />
<div class="max-w-[1600px] mx-auto">
	<Banner
		data={[
			{
				urlBanner: BannerImage,
				urlBannerMobile: BannerImage,
				bannerAlt: 'Visit Us',
				urlLink: ''
			}
		]}
	/>
</div>
<Offer />
<Video />
<Value />
<Guarantee />
<Related />
