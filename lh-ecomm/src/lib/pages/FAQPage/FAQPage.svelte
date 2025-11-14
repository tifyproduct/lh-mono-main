<script>
	import { Accordion, AccordionItem } from 'flowbite-svelte';
	import Text from '$lib/components/Text/Text.svelte';

	const faqSections = [
		{
			title: 'GENERAL FAQ',
			items: [
				{
					header: 'WHAT IS LUXEHOUZE?',
					content: `Luxehouze is the leading marketplace to buy and sell authenticated luxury goods. We have rapidly become the most trusted and secure platform for true watch enthusiasts to explore and purchase high-end watches from all the biggest global brands, at the most competitive prices.`
				},
				{
					header: 'HOW DO I SEARCH FOR A PRODUCT ON LUXEHOUZE?',
					content: `The easiest way to search for a specific luxury product on Luxehouze is by clicking the search option on the top right-hand corner of the website, and typing in the name of the product, or the brand.`
				},
				{
					header: 'HOW DO I PLACE AN ORDER AT LUXEHOUZE?',
					content: `When you find a particular model that interests you or you want to purchase, contact us through WhatsApp or place an order through our website.`
				},
				{
					header: 'DO I NEED TO CREATE AN ACCOUNT ON LUXEHOUZE TO PLACE AN ORDER?',
					content: `While all you need is an email address to place an order with us at Luxehouze, we highly recommend that you do create an account for yourself, so that you can utilize the perks of being able to curate a wishlist of your favorite products and enjoy special offers.`
				},
				{
					header: 'HOW DO I KEEP UP WITH LUXEHOUZE LATEST ARRIVALS AND OFFERS?',
					content: `You can sign up for our newsletters by joining our mailing list at the bottom of the website, and keep up with the insider updates on our latest collections, invites to private events, and other personalized offers.`
				},
				{
					header: 'HOW CAN I CONTACT LUXEHOUZE?',
					content: `You can contact us through WhatsApp on +62 812-7565-6510 or E-mail, or by filling out the contact form with your specific query and be assured that our support team will respond to you shortly.`
				}
			]
		},
		{
			title: 'WARRANTY FAQ',
			items: [
				{
					header: 'HOW THE WARRANTY WORKS?',
					content: `If your watch still has a valid manufacturer's warranty, you have the option to send it for repair through Luxehouze or an authorized dealer. In the event that your watch is covered by Luxehouze warranty but not the manufacturer's warranty, we will handle the necessary repairs. For watches not covered by any warranty, you can send them to us to receive a repair quote. Be assured that any servicing carried out by us will be backed by a 1-year Luxehouze warranty.`
				},
				{
					header: 'DOES LUXEHOUZE PROVIDE ANY WARRANTY FOR WATCHES?',
					content: `Luxehouze offers a 1-year warranty on selected watches available on our platform. Each watch's product listing page specifies whether it includes an in-house warranty. If any issues arise with the warranted watch due to Luxehouze's workmanship or parts provided by its technicians within the 1-year period, Luxehouze will, at its sole discretion, either repair or replace any damaged parts and/or rectify the repair execution at no cost to you.`
				},
				{
					header: 'WHEN DOES THE WARRANTY PERIOD START?',
					content: `Luxehouze provides a minimum 1-year warranty on selected pre-owned watches starting from the date of purchase. The date of purchase is considered to be the date mentioned on the sales invoice or any other dated document specified by Luxehouze as proof-of-purchase.`
				},
				{
					header: 'WHAT DOES THE WARRANTY COVER?',
					content: `Please be aware that our warranty specifically covers manufacturing and mechanical defects. There are certain conditions that apply to Luxehouze's 1-year warranty. The warranty does not cover the following circumstances: 1. Any internal or external damage resulting from accidents, including water damage, shock damage, mishandling, or abusive treatment of the watch, or any use that goes beyond the intended limits of a timepiece. 2. Any modifications, attempted repairs, or tampering with the watch, except for strap or bracelet components, done by unauthorized third parties, which will void the warranty. 3. For quartz watches, only use replacement cells prescribed by the manufacturer, as damage caused by unsuitable batteries is not covered under the warranty. Please note that Luxehouze retains the sole discretion to determine the applicability of its warranty to each timepiece for which a warranty claim is submitted.`
				},
				{
					header: 'HOW TO OBTAIN SERVICE?',
					content: `For assistance, kindly reach out to us via email at service@luxehouze.com or through WhatsApp at +62 878-8888-0803. Please note that the repair time for watch services may vary depending on the watch brand and the specific nature of the service required. Typically, warranty service repairs take a minimum of 8 to 12 weeks.`
				}
			]
		}
	];
</script>

<div class="container max-w-[1600px] md:p-20 p-4 grid bg-black-1">
	<Text type="title-3" color="black-9" weight="semibold" class="mx-auto"
		>Frequently Asked Questions</Text
	>

	{#each faqSections as { title, items }}
		<Text type="subtitle-3" color="black-9" weight="semibold" class="mt-8">{title}</Text>
		<Accordion>
			{#each items as { header, content }}
				<AccordionItem class="mt-4 border !rounded bg-white-1">
					<Text type="body-1" slot="header" weight="semibold">{header}</Text>
					<Text type="body-2">{content}</Text>
				</AccordionItem>
			{/each}
		</Accordion>
	{/each}
</div>
