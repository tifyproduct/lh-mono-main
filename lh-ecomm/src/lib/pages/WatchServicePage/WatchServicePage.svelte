<script>
	import RelatedArticle from '$lib/components/RelatedArticle/RelatedArticle.svelte';
	import USP from '$lib/pages/WatchServicePage/components/USP/USP.svelte';
	import Brands from '$lib/pages/WatchServicePage/components/Brands/Brands.svelte';
	import Services from '$lib/pages/WatchServicePage/components/Services/Services.svelte';
	import PricingTable from '$lib/pages/WatchServicePage/components/PricingTable/PricingTable.svelte';
	import USPCard from '$lib/pages/WatchServicePage/components/USPCard/USPCard.svelte';
	import SeeTheDifference from '$lib/pages/WatchServicePage/components/SeeTheDifference/SeeTheDifference.svelte';
	import FAQ from '$lib/pages/WatchServicePage/components/FAQ/FAQ.svelte';
	import Equipment from './components/Equipment/Equipment.svelte';
	import BlogID1 from '$lib/assets/static/watch-service/blog-1.png';
	import BlogID2 from '$lib/assets/static/watch-service/blog-2.webp';
	import BlogSG2 from '$lib/assets/static/watch-service/blog-sg-2.webp';
	import Hero from '$lib/pages/WatchServicePage/components/Hero/Hero.svelte';

	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	const currentPage = get(page);
	const store = currentPage.params.store;

	let equipment = [
		{
			title: 'Waterproof Tester',
			description:
				"To ensure your timepiece performs at its peak, we use modern waterproof tester to measure your watch case's water resistance. This device uses compressed air and an extremely sensitive sensor to measure minute fluctuations in the watch's size under high pressure.",
			image:
				'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/headless-waterproof.png?v=1728552457'
		},
		{
			title: 'Microscope',
			description:
				"This tool allows us to examine gears, screws, and jewels at a magnified level, so we can identify any wear, damage, or misalignment that could affect your watch's performance. By using a microscope, we guarantee that your timepiece is maintained with the utmost precision, ensuring it continues to function flawlessly.",
			image:
				'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/microscope-service-new.png?v=1727428200'
		},
		{
			title: 'Timegrapher',
			description:
				"To ensure your timepiece performs at its peak, we provide the most accurate watch diagnostics with our state-of-the-art chronoscope. This incredible device measures your watch's beat rate, beat error, and amplitude to finally indicate if your watch needs adjustment, repair, or maintenance.",
			image:
				'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/timegrapher-service-new.png?v=1727428201'
		}
	];

	let articles = [];

	if (store === 'id') {
		articles = [
			{
				slug: '/article-1',
				image: BlogID1,
				title: 'Spotting an Authentic Rolex: 7 Crucial Features to Look For',
				summary: 'Jun 11, 2024'
			},
			{
				slug: '/article-2',
				image: BlogID2,
				title: "Cracking the Code: Here's How to Spot a Fake Patek Philippe",
				summary: 'Jul 04, 2024'
			}
		];
	} else {
		articles = [
			{
				slug: '/article-3',
				image: BlogID1,
				title: 'Spotting an Authentic Rolex: 7 Crucial Features to Look For',
				summary: 'Jun 11, 2024'
			},
			{
				slug: '/article-4',
				image: BlogSG2,
				title: 'Spotting Fake vs. Authentic Hublot Watches: A How-To Guide',
				summary: 'Jun 07, 2024'
			}
		];
	}

	const faqs = [
		{
			title: 'HOW LONG DOES THE WATCH REPAIR TAKE?',
			content:
				"It'll depend on the type of repairs. Simple fixes such as minor scratches, or loose screws can take no more than a few hours. Major repairs may take longer depending on the brand, model, repair procedures, and replacement parts."
		},
		{
			title: 'WHAT TYPE OF PAYMENTS DO YOU ACCEPT?',
			content:
				'We accept Cash, Bank Transfers and Debit/Credit Card payments (there may be corresponding fees applied).'
		},
		{
			title: 'HOW OFTEN SHOULD I SERVICE MY WATCH?',
			content:
				'Swiss-standard manufacturers would recommend watch servicing once every 3 years, but it would depend entirely on the frequency of usage, the length of time the watch is unworn and the storage condition.'
		},
		{
			title: 'WHEN IS THE PAYMENT DUE?',
			content: "You'll need to make payment once the repair work or service has been completed"
		},
		{
			title: 'WHAT ARE THE SIGNS THAT MY WATCH NEEDS REPAIR?',
			content:
				"Signs that your watch may need repair include a scratched or damaged crystal, a loose or broken crown, unusual noises, rapid battery drain, a faded or discolored dial, and a loose or damaged bracelet or strap. If you notice any of these signs, it's best to have your watch inspected by a qualified professional to prevent further damage."
		},
		{
			title: 'CAN I GET A QUOTE BEFORE SENDING MY WATCH FOR REPAIR?',
			content:
				"We'll provide you with an estimated cost of repair through WhatsApp once you’ve made a request. You may choose to continue and fill out the inquiry form if you're satisfied with the quote."
		},
		{
			title: "WHAT'S INCLUDED WITH THE SERVICE?",
			content:
				"Each service at Luxehouze comes with a 1-year Luxehouze Warranty. The repairs offered may vary depending on the issues. You have the option to polish or change your timepiece's strap when completing the inquiry form provided by our team."
		}
	];
</script>

<div>
	<Hero />
	<USP
		items={[
			{
				src: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/service-1.png?v=1727341343',
				title: 'Swiss-Brand Trained Expertise',
				description:
					'Our watch experts bring unparalleled precision and skill in using Swiss-grade equipment, honed by the best in Switzerland.'
			},
			{
				src: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/service-2.png?v=1727341399',
				title: 'Quick Service Time',
				description:
					'We commit to delivering swift service without compromising quality. For comprehensive overhauls or full restorations, expect meticulous care within only 3-7 weeks.'
			},
			{
				src: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/service-3.png?v=1727341428',
				title: '1-Year Luxecare Warranty',
				description:
					"We ensure your peace of mind with a full year of guaranteed support after service. We'll repair or replace any damaged parts due to issues related to the original diagnosis."
			}
		]}
	/>

	<Brands
		topBrands="RICHARD MILLE, AUDEMARS PIGUET, PATEK PHILLIPE, ROLEX, OMEGA"
		bottomBrands="PANERAI, FRANCK MULLER, HUBLOT, TAG HEUER"
		sectionTitle="Brands We Accept"
		additionalText="(Please reach out if your watch brand is not listed here)"
		moreBrandsText="+ many more..."
	/>
	<Services />
	<div class="container max-w-[1600px]">
		<PricingTable />
	</div>
	<USPCard />
	<Equipment slides={equipment} />
	<SeeTheDifference />
	<div class="px-4 py-4 mt-8 container max-w-[1600px]">
		<RelatedArticle {articles} {store} />
	</div>
	<FAQ {faqs} />
</div>
