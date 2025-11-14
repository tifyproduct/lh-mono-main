<script>
	import Banner from '$lib/components/Banner/Banner.svelte';
	import OurStore from '$lib/pages/VisitUsPage/components/OurStore/OurStore.svelte';

	import BannerImage from '$lib/assets/static/visit-us/banner.png';
	const BannerImages = [
		{
			bannerAlt: 'Visit Us Banner',
			urlBanner: BannerImage,
			urlBannerMobile: '/path/to/mobile/image.png'
		}
	];
</script>

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
<OurStore />
