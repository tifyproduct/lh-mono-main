<script>
	import Text from '$lib/components/Text/Text.svelte';
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	import { ActiveTabSWU } from '../HowItWorks/ActiveTabStore';
	import { onDestroy } from 'svelte';

	const faqItems = [
		{
			question: "HOW DO I SELL MY LUXURY ITEM THROUGH LUXEHOUZE'S CONSIGNMENT SERVICE?",
			answer: `
				You can consign your luxury item at Luxehouze in four easy steps: <br />
				1. Complete our online form with details of the luxury item you want to sell. We will provide
				a price estimate within 48 hours.<br />
				2. Drop off your luxury item at our boutique. Our expert authenticators will check its condition and authenticity.<br />
				3. Leave your luxury item with us. We will list your item for sale and offer it to our global clientele.<br />
				4. Once your luxury item is sold, we will transfer the payment to you within 3 business days.
			`
		},
		{
			question: "HOW DO I SELL MY LUXURY ITEM THROUGH LUXEHOUZE'S DIRECT SELLING SERVICE?",
			answer: `
				You can sell your luxury item through Luxehouze's Direct Selling service in four easy steps:<br />
				1. Complete our online form with details of the luxury item you want to sell. We will provide an offer within 48 hours.<br />
				2. Wait for our Client Advisor to contact you regarding the sale details.<br />
				3. Drop off your luxury item at our boutique. Our expert authenticators will check its condition and authenticity.<br />
				4. Once the inspection is complete, we will transfer your payment within 24 hours.
			`
		},
		{
			question: 'HOW DO I TRADE IN MY LUXURY ITEM FOR A NEW ONE AT LUXEHOUZE?',
			answer:
				'You can trade in your luxury item for a new one at Luxehouze in four easy steps: 1. Complete our online form with details of the luxury item you want to trade. We will provide an offer within 48 hours. 2. Wait for our Client Advisor to contact you regarding the trade-in details. 3. Drop off your luxury item at our boutique. Our expert authenticators will check its condition and authenticity. 4. Once the inspection is complete, pay the difference and take home your new luxury item.'
		},
		{
			question: 'HOW DO I GET APPROVED AS A SELLER?',
			answer:
				'To ensure only authentic, high-quality items are sold at Luxehouze, we implement strict criteria for seller approval. We select trusted parties with proven credibility. As part of the assessment process, our Client Advisor will contact you and conduct a product inspection before approving your registration.'
		},
		{
			question: 'WHAT ARE THE BENEFITS OF SELLING WITH LUXEHOUZE?',
			answer:
				'There are five key benefits to selling your luxury items with Luxehouze: 1. Fair valuation 2. Fast and easy process 3. Prompt valuation responses 4. Maximum confidentiality 5. New and pre-owned items accepted'
		},
		{
			question: 'HOW IS THE SELLING PRICE DEFINED?',
			answer:
				"The selling price for each item is based on an agreement between the seller and Luxehouze. The seller proposes a price, and Luxehouze determines the final price based on the item's condition and current market trends."
		},
		{
			question: 'WHAT ITEMS DOES LUXEHOUZE ACCEPT?',
			answer:
				'We accept luxury watches from brands <br/><br/> Consignment:<br/> A. LANGE & SÖHNE, ANGELUS, ARTISANS DE GENÈVE, ATELIER WEN, AUDEMARS PIGUET, BALTIC, BAMFORD, BELL & ROSS, BLANCPAIN, BREGUET, BREITLING, BULGARI, CARTIER, CHOPARD, DE BETHUNE, FRANCK MULLER, F.P. JOURNE, GIRARD-PERREGAUX, GREUBEL FORSEY, GRAND SEIKO, HERMÈS, H MOSER & CIE, HUBLOT, HYT, IWC, JACOB & CO., JAEGER-LECOULTRE, JAQUET DROZ, MB&F, MONTBLANC, OMEGA, PANERAI, PARMIGIANI FLEURIER, PATEK PHILIPPE, PIAGET, RICHARD MILLE, ROGER DUBUIS, ROLEX, TAG HEUER, TUDOR, ULYSSE NARDIN, UNIMATIC, URWERK, VACHERON CONSTANTIN, VAN CLEEF & ARPELS, ZENITH, Others <br/><br/>Trade-in & Direct Sell:<br/> A. LANGE & SÖHNE, AUDEMARS PIGUET, BELL & ROSS, BREITLING, CARTIER, CHOPARD, FRANCK MULLER, F.P. JOURNE, GIRARD-PERREGAUX, HUBLOT, IWC, JACOB & CO., JAEGER-LECOULTRE, MB&F, OMEGA, PANERAI, PATEK PHILIPPE, PIAGET, RICHARD MILLE, ROGER DUBUIS, ROLEX, TAG HEUER, TUDOR, URWERK, VACHERON CONSTANTIN, ZENITH<br/><br/>Please contact our Client Advisor for a complete list of accepted luxury brands.'
		}
	];
</script>

<div class="container max-w-[1600px] px-14 py-16 text-center">
	<Text weight="semibold" type="subtitle-1">FAQ</Text>

	<Accordion flush class="mt-8 text-left">
		{#each faqItems as item}
			<AccordionItem>
				<span slot="header">
					<Text weight="semibold">{item.question}</Text>
				</span>
				<Text type="body-1" color="black-5">{@html item.answer}</Text>
			</AccordionItem>
		{/each}
	</Accordion>
</div>
