<script>
	import Text from '$lib/components/Text/Text.svelte';
	import { page } from '$app/stores';

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const SellUrl = `${baseParams}/sell-with-us`;
	const BestPriceProgramUrl = `${baseParams}/best-price-program`;

	const tnc = {
		general: [
			{
				question: 'Is Luxehouze an Authorized Dealer of the watch brands it sells',
				answer:
					'Luxehouze is not an authorized dealer of the watch brands it sells, unless it is specifically stated otherwise.'
			},
			{
				question: 'Are your watches genuine?',
				answer:
					'All watches we sell are verified to be authentic and in working condition. We <b>DO NOT</b> sell “replica” or fake watches. <br/><br/> When purchasing or accepting watches as part of an exchange, we will thoroughly inspect the watch, including its movement. It will be immediately rejected should it display characteristics or serial markings known to be associated with “replica” watches.'
			},
			{
				question: 'Are your watches new?',
				answer: `Because we purchase the watches that we sell, they are no longer classed as “new”. Luxehouze has owned them prior to the onward sale to the purchasing customer. Therefore, they are classed as “unworn” because the purchasing customer would become the second owner of the watch. Beyond wording, there is no difference between the two above, but we cannot technically class our watches as “new” as it would be inaccurate and unfair to do so.`
			},
			{
				question: 'Can I order watches that are not listed on your website?',
				answer: `Yes, you may contact us to enquire about purchasing watches that are not listed on our website. We have the ability and resources to source for various different models and brands of watches that you seek.`
			},
			{
				question: 'Can I get a refund for my purchase?',
				answer:
					'Unfortunately, all sales are final and we are unable to offer refunds for reasons other than defects or damages once a watch has been deemed sold. <br/> <br/> If you receive a watch that is defective or damaged, you must immediately notify Luxehouze, provide details of the defect or damage, and obtain our authorization prior to returning it. Luxehouze takes no responsibility whatsoever for any loss or damage to an item once you have signed for the package upon delivery by the courier. It is therefore your sole responsibility to ensure that all items are intact and in good working condition before signing for the delivery to indicate receipt and acceptance of the item. You must retain all packaging in which the item was shipped with to qualify for a refund or replacement. If we provide you with authorization to return the item, we will either send you a replacement at our expense or issue you a refund, at our sole discretion. Refunds will be made within a reasonable period of time to the original payment method after the return is successful. If a replacement is no longer available, we will issue you a refund.'
			},
			{
				question: 'Can I get a refund for my deposit?',
				answer:
					'All deposits received by Luxehouze for goods that have been ordered by Customers are strictly non-refundable. Deposits that have been received by Luxehouze are applied to the purchase of the specific goods that have been confirmed by the Customer. For the avoidance of any doubt, deposits paid for the order of any goods by Customers are neither refundable nor transferrable/creditable towards any other goods should the Customer choose to cancel his/her order.'
			},
			{
				question: 'Do you accept trade-ins or buy preowned watches?',
				answer:
					'Yes, we do, subject to approval on a case-by-case basis. <br/> <br/> If you wish to trade in or sell your watch, please complete the form in the link below to start the process: <a href="' +
					SellUrl +
					'" style="color:#2E04FF">Luxehouze Selling Guide</a>'
			},
			{
				question: 'Do I have to pay Taxes on my purchase?',
				answer:
					'Payment of all Taxes is the sole responsibility of you as the customer. Prices contained on our website are in ID Rupiah, SG Dollars, and US Dollars, and exclude shipping, delivery costs, and sales taxes or any applicable federal, state, local, or foreign taxes, duties, levies, or charges in any jurisdiction throughout the world related to the purchase or the delivery thereof (collectively referred to as “Taxes”).'
			},
			{
				question: 'Speciality Orders: ',
				answer:
					"We are one of the best in the industry at sourcing and supplying hard to find and rare watches. Limited edition Richard Mille, full factory diamond Nautilus, A.P ceramic tourbillons and open worked, Jacob & Co Astronomia etc. We can find them all as we have a global network. <br/> To order speciality, rare, or high value pieces, we require full payment in advance prior to placing the order. We wouldn't expect our suppliers to send on a “pay you later” promise under these circumstances. <br/> We hear “make me a sensible offer” “make me a reasonable offer” every day but cannot be both buyer and seller. If we know how much you're looking for then we can happily match it or negotiate. We're a simple and transparent lot. Please extend us the same courtesy. Offers are for Ebay."
			},
			{
				question: 'Over the phone.',
				answer:
					"We don't give values over the phone. We need to see the watch. <br/> We are not being difficult but definitions regarding condition can vary wildly. A “couple of hairlines” to one person could equal “have you been at this with an angle grinder?” to another. People may think that their watch is in excellent condition because it's all shiny with no scratches, but seeing it could reveal that its gleaming because its been really badly over polished to the point that the lugs are like toothpicks and the case is soft. Alternatively it could be unmarked because its spent its life in a safe and seen very little wear, in which case absolute happy days. We can't call any of this without visual inspection and we wouldn't want to disappoint anybody by having to revoke or reduce what we offer. We cannot give “ballpark figures” over the phone. We need to see the watch. We are often asked to give a ballpark figure over the phone. This tends to be so that people can call up other dealers to let them know that Official offered X, so they would like XX. We like to keep our friends in the industry."
			},
			{
				question: 'What is the ordering process?',
				answer:
					"You can contact us via email <a style='color:#2E04FF'>info@luxehouze.com</a> if you have something specific in mind that isn't on our site. <br/> To place an order, we would require a 30% deposit. Once we have received the deposit, we will place the order with our suppliers. When the watch arrives in our showroom, we will let you know and arrange payment of the remaining 70% prior to dispatch."
			},
			{
				question: 'What if you cannot get the watch? ',
				answer:
					'In the unlikely event that we cannot deliver - we would let you know as soon as possible and refund you in full.'
			},
			{
				question: 'Why are some of your watches priced so cheap?',
				answer:
					'We can offer big discounts on some brands of watches - Hublot, Omega, Breitling, IWC, Jaeger LeCoultre, Jacob&Co, etc. <br/> We work closely with a huge network of suppliers and trade partners. Because we have spent years building up good relationships with our colleagues across the world. We are treated well and given the best prices because we buy (and sell) regularly and reliably. '
			}
		]
	};
</script>

<div class="container max-w-[1600px] md:p-20 p-4 grid">
	<Text type="title-3" color="black-9" weight="semibold" class="mx-auto">Terms And Conditions</Text>

	{#each tnc.general as { question, answer }}
		<div class="grid">
			<Text type="subtitle-3" color="black-9" weight="semibold" class="mt-4">{question}</Text>
			<Text type="body-2" color="black-9" weight="regular" class="mt-2">{@html answer}</Text>
		</div>
	{/each}
	<div class="mt-8 grid">
		<Text type="subtitle-3" color="black-9" weight="semibold" class="mt-8"
			>About our best price program</Text
		>
		<Text type="body-2" color="black-9" weight="regular" class="mt-2">
			Please visit this <a href={BestPriceProgramUrl} style="color:#2E04FF">page</a> for further details
			on our best price program.
		</Text>
	</div>
	<div class="mt-8 grid">
		<Text type="subtitle-3" color="black-9" weight="semibold" class="mt-8">DISCLAIMER</Text>
		<Text type="body-2" color="black-9" weight="regular" class="mt-2"
			>We are not affiliated, associated, authorized, endorsed by, or in any way officially
			connected with the brands we illustrate, and those listed on our site. <br /><br />All product
			and company names are trademarks or registered trademarks of their respective holders. The use
			of any of them is for identification and reference purposes only and does not imply any
			association with the trademark holder of their product brand.</Text
		>
	</div>
</div>
