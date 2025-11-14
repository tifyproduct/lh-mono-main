<script lang="ts">
	import Banner from '$lib/pages/AuthenticityPage/components/Banner/Banner.svelte';
	import USP from '$lib/pages/AuthenticityPage/components/USP/USP.svelte';
	import Inspection from '$lib/pages/AuthenticityPage/components/Inspection/Inspection.svelte';
	import InspectionList from '$lib/pages/AuthenticityPage/components/InspectionList/InspectionList.svelte';
	import Equipment from '$lib/pages/WatchServicePage/components/Equipment/Equipment.svelte';
	import ItemsOnDemand from '$lib/pages/AuthenticityPage/components/ItemsOnDemand/ItemsOnDemand.svelte';
	import RelatedArticle from '$lib/components/RelatedArticle/RelatedArticle.svelte';
	import FAQ from '$lib/pages/CommunityPage/components/FAQ/FAQ.svelte';
	import BlogID1 from '$lib/assets/static/watch-service/blog-1.png';
	import BlogID2 from '$lib/assets/static/watch-service/blog-2.webp';
	import BlogSG2 from '$lib/assets/static/watch-service/blog-sg-2.webp';
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	const currentPage = get(page);
	const store = currentPage.params.store;

	let equipment = [
		{
			title: 'Timegrapher',
			description:
				"To ensure your timepiece performs at its peak, we provide the most accurate watch diagnostics with our state-of-the-art chronoscope. This incredible device measures your watch's beat rate, beat error, and amplitude to finally indicate if your watch needs adjustment, repair, or maintenance.",
			image:
				'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/timegrapher-service-new.png?v=1727428201'
		},
		{
			title: 'Microscope',
			description:
				"This tool allows us to examine gears, screws, and jewels at a magnified level, so we can identify any wear, damage, or misalignment that could affect your watch's performance. By using a microscope, we guarantee that your timepiece is maintained with the utmost precision, ensuring it continues to function flawlessly.",
			image:
				'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/microscope-service-new.png?v=1727428200'
		},
		{
			title: 'Waterproof Tester',
			description:
				"To ensure your timepiece performs at its peak, we use modern waterproof tester to measure your watch case's water resistance. This device uses compressed air and an extremely sensitive sensor to measure minute fluctuations in the watch's size under high pressure.",
			image:
				'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/waterproof-service-new.png?v=1727428201'
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
			title: 'WHY IS A WATCH AUTHENTICITY IMPORTANT?',
			content:
				'Watch authenticity is significant because it assures you of the quality, craftsmanship, and value of your timepiece. Authentic watches are made with high-quality materials, precise movements, and detailed craftsmanship that replicas or fakes cannot match.'
		},
		{
			title: 'WHAT HAPPENS IF THE WATCH I PURCHASE FROM LUXEHOUZE IS NOT AUTHENTIC ?',
			content:
				'Every watch we sell is guaranteed to be 100% authentic. Nonetheless, if you find your item to be inauthentic despite our rigorous inspection process, we stand by our promise to refund the full purchase price. Please note that you will need to provide proof that the watch you purchased from Luxehouze is indeed a counterfeit.'
		},
		{
			title: "HOW DOES LUXEHOUZE'S AUTHENTICATION PROCESS WORK ?",
			content:
				"We proudly call our authentication process Luxehouze's 360° Inspection Process. Our quality and authenticity inspection process involves a multi-step verification procedure, which has been summarized above. If you would like to learn more about our 360° Inspection Process, feel free to reach out to our Client Advisors."
		},
		{
			title: 'DOES OPENING THE WATCH FOR AUTHENTICATION VOID THE WARRANTY ?',
			content:
				'Yes, opening a watch for authentication can void its warranty if not handled by trained professionals. Proper opening and closing are crucial to avoid leaving marks or handling traces inside and out. This is particularly important for watches with screwed-on back cases, such as Rolex, where the back must be resealed with precise torque to ensure it is tight without being over-tightened. However, if you prefer to avoid this risk, please inform our team. Be aware that skipping this process means we cannot validate the movement’s originality or any modifications/parts replacement inside your watch.'
		},
		{
			title: 'WHAT ARE THE COMMON SIGNS OF A COUNTERFEIT WATCH ?',
			content:
				'Common signs of a counterfeit watch include poor quality craftsmanship, incorrect logos or branding, mismatched serial numbers, and inferior materials. However, some counterfeits are very high-quality, and these signs may not be apparent. As mentioned, professional authentication is recommended for complete assurance.'
		},
		{
			title: 'IS THE AUTHENTICATION PROCESS SAFE FOR MY WATCH ? ',
			content:
				'Yes, the authentication process is designed to be completely safe for your watch. Our experienced professionals handle each timepiece with the utmost care, using specialized tools and techniques to ensure its safety. We adhere to the highest safety standards throughout the examination to protect your watch from any damage. Rest assured, your timepiece is in expert hands during the authentication process.'
		},
		{
			title: "WHAT EQUIPMENT IS USED IN LUXEHOUZE'S AUTHENTICATION PROCESS ?",
			content:
				'We use various advanced equipment depending on the brand and model of the watch, and you can find the list above. If you would like to learn more about our state-of-the-art equipment, feel free to reach out to our Client Advisors.'
		},
		{
			title: 'HOW LONG DOES IT TAKE TO GET MY WATCH AUTHENTICATED ?',
			content:
				'The authentication of your watch generally takes a maximum of 60 minutes per watch. However, the duration can vary based on the current queue.'
		},
		{
			title: 'CAN I AUTHENTICATE A WATCH BY MYSELF ?',
			content:
				'While there are certain signs you can look for to determine if a watch is fake, professional authentication is recommended for complete assurance. Counterfeit watches can be extremely convincing and may fool even an experienced eye.'
		}
	];
	export let data;
	let filteredTopPicks = data.topPicks.filter((item) => item.title === 'Watches');
</script>

<Banner />
<USP />
<Inspection />
<InspectionList />
<Equipment slides={equipment} />
<div class="px-4 py-4 mt-8 container max-w-[1600px]" id="related-articles">
	<RelatedArticle {articles} {store} />
</div>
<ItemsOnDemand items={filteredTopPicks} />
<FAQ {faqs} />
