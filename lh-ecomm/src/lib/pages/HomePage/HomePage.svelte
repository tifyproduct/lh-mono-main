<script lang="ts">
	import { BardLineLogos, VipDiamondLineFinance, FunctionLineSystem } from 'svelte-remix';
	import Banner from '$lib/components/Banner/Banner.svelte';
	import Divider from '$lib/components/Divider/Divider.svelte';
	import GoogleReviews from '$lib/components/GoogleReviews/GoogleReviews.svelte';
	import UserSellingPoint from './components/UserSellingPoint/UserSellingPoint.svelte';
	import Testimonials from './components/Testimonials/Testimonials.svelte';
	import FlashSale from '$lib/pages/HomePage/components/FlashSale/FlashSale.svelte';
	import OurPicks from '$lib/pages/HomePage/components/OurPicks/OurPicks.svelte';
	import { onMount } from 'svelte';
	import type { HomepageSales } from '$lib/types/homepageSales';
	import type { BannerData } from '$lib/components/Banner/types';

	export let data;

	let isLoadingBanner: boolean = true;
	let bannerData: BannerData[];

	let isLoadingSales: boolean = true;
	let salesData: HomepageSales[];

	let isLoadingOurPicks: boolean = true;
	let ourPicksData: HomepageSales[];

	const fetchBanners = async () => {
		try {
			const bannerResp = await fetch(`/api/banner/homepage?store=${data.params.store}`, {
				method: 'GET'
			}).then(async (response) => {
				const bannerResp = await response.json();

				bannerData = bannerResp.list;
				isLoadingBanner = false;
			});
		} catch (error) {
			console.error('Failed to fetch banner data:', error);
		}
	};

	const fetchSales = async () => {
		try {
			await fetch(
				`/api/collections/homepage-sales?store=${data.params.store}&lang=${data.params.lang}`,
				{
					method: 'GET'
				}
			).then(async (response) => {
				const salesTabResp = await response.json();

				salesData = salesTabResp.list;
				isLoadingSales = false;
			});
		} catch (error) {
			console.error('Failed to fetch sales tab data:', error);
		}
	};

	const fetchOurPicks = async () => {
		try {
			await fetch(
				`/api/collections/top-picks/homepage?store=${data.params.store}`,
				{
					method: 'GET'
				}
			).then(async (response) => {
				const ourPicksResp = await response.json();

				ourPicksData = ourPicksResp.list;
				isLoadingOurPicks = false;
			});
		} catch (error) {
			console.error('Failed to fetch sales tab data:', error);
		}
	};

	onMount(async () => {
		await fetchBanners();
		await fetchSales();
		await fetchOurPicks();
	});
</script>

<div>
	<div class="container max-w-[1600px]">
		<Banner data={bannerData} isLoading={isLoadingBanner} showIndicator />
	</div>

	<div class="mt-10 md:mt-[60px]">
		<FlashSale items={salesData} isLoading={isLoadingSales} />
	</div>

	<div class="mt-10 md:mt-[60px]">
		<OurPicks items={ourPicksData} isLoading={isLoadingOurPicks} />
	</div>

	<div class="mt-10 lg:mt-[120px]">
		<div class="hidden lg:block">
			<Divider />
		</div>

		<UserSellingPoint
			data={[
				{
					title: '100% Authentic',
					description:
						"All the goods listed on our platform have been authenticated by our team of experts. In the unlikely event that you find it to be inauthentic, we'll refund 100% of its price.",
					icon: BardLineLogos
				},
				{
					title: 'Best Price Program',
					description:
						'Every transaction at Luxehouze is protected by our Best Price Program! Should you receive a better price elsewhere, we will beat it*! <br/><p style="font-size: 10px;">*T&Cs apply</p>',
					icon: VipDiamondLineFinance
				},
				{
					title: 'A Wide collection of brands',
					description:
						"We offer a wide collection of luxury goods from the world's finest brands, from the most popular and sought-after names to rare and niche labels.",
					icon: FunctionLineSystem
				}
			]}
		/>

		<div class="hidden lg:block">
			<Divider />
		</div>
	</div>

	<div class="mt-10 lg:mt-14">
		<Testimonials />
	</div>

	<div class="bg-white py-10 lg:pt-10 lg:pb-20">
		<GoogleReviews review={data.googleReview} />
	</div>
</div>
