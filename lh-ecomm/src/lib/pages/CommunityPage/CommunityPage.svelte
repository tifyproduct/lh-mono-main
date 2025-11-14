<script>
	import Hero from '$lib/pages/CommunityPage/components/Hero/Hero.svelte';
	import Offers from '$lib/pages/CommunityPage/components/Offers/Offers.svelte';
	import CommunityCard from '$lib/pages/CommunityPage/components/CommunityCard/CommunityCard.svelte';
	import FAQ from '$lib/pages/CommunityPage/components/FAQ/FAQ.svelte';
	const faqs = [
		{
			title: 'WHAT IS THE LUXEHOUZE CLUB?',
			content:
				'The Luxehouze Club is a community on Telegram and WhatsApp where we share updates related to Luxehouze.'
		},
		{
			title: 'HOW MANY LUXEHOUZE CLUBS ARE THERE?',
			content:
				'The Luxehouze Club is one big community, but we have dedicated channels for watches, bags, and beauty.'
		},
		{
			title: 'WHAT TYPE OF CONTENT DO YOU SHARE ON THE COMMUNITY?',
			content:
				'We strive to keep our community engaged with daily catalog updates, exclusive offers, special content, and announcements.'
		},
		{
			title: 'HOW CAN I GET ASSISTANCE OR SUPPORT WITHIN THE LUXEHOUZE CLUB?',
			content:
				'For any inquiries related to our products, our team will be pleased to assist you through our official WhatsApp contact numbers:<br> @ID: +62 878-8888-0803 <br>@SG: +65 9862 5974'
		},
		{
			title: 'HOW FREQUENTLY DO YOU SHARE UPDATES & PROMOTIONS ON THESE PLATFORMS?',
			content:
				"We share daily updates every day. We also share exclusive promos. Make sure to join so you'll be among the first to know about our offers."
		}
	];
</script>

<Hero />
<Offers />
<CommunityCard />
<FAQ {faqs} />
