<script>
	import Text from '$lib/components/Text/Text.svelte';

	const criteria = [
		{
			title: '1) Identical to the Qualified Competitor item.',
			text: 'The item must be identical – it must have matching attributes including, but not limited to, brand, model number, full reference number, configuration, mechanisms, color, material, size, dial, bezel, casing, dial hands, bracelet/strap, clasp, packaging box, instruction manual, authenticity certificate/warranty card, condition, and warranty date (within a range of 2 months) to qualify.'
		},
		{
			title: '2) Ready stock locally at a Qualified Competitor.',
			text: 'The item must be immediately available for store pickup from a local Qualified Competitor.'
		},
		{
			title: '3) Quoted in the same currency.',
			text: 'The item must be quoted in the same currency as the quote you received from Luxehouze.'
		},
		{
			title: '4) Not be a consigned item.',
			text: 'The item must not be sold on a consignment basis (whether from Luxehouze or from a Qualified Competitor).'
		},
		{
			title:
				'5) Pricing must be accessible to the general public online on the Qualified Competitor website.',
			text: 'a. The item’s pricing must be not only available to select groups of customers including Membership Program members, loyalty offers, or paid loyalty programs. \n b. Customer must direct Luxehouze (by providing a Qualified Competitor’s URL) to the ad or website that is displaying the current lower price that customerwould like to beat.'
		},
		{
			title: "6) Not shown on Luxehouze's exclusions list.",
			text: 'Exclusions apply including, but not limited to, items sold by Marketplace vendors, special daily or hourly sales, items on sale at a Qualified Competitor, and any financing offers, bundle offers, items included in bundle offers, free items, pricing errors, mail-in offers, coupon offers, items that are advertised as limited quantity, out of stock items, clearance items, open-box items, refurbished items, credit card offers, gift card offers, items included in gift card offers, Point of Sale Activation cards, discounts related to a membership program, and voice-only deals, whether offered by us or a Qualified Competitor.'
		}
	];
</script>

<div class="container max-w-[1600px]">
	<div class="max-w-xl mx-auto py-4 md:py-16">
		<img
			src="https://id.luxehouze.com/cdn/shop/files/Price_Match_Promise_1600x1200_1.jpg?v=1730281760"
			alt="Best Price Program"
		/>
		<div class="mt-4 p-4 md:p-0">
			<Text type="subtitle-1" color="black-9" weight="semibold">Best Price Program</Text>
		</div>
		<div class="py-8 p-4 md:p-0 md:py-8">
			<Text type="body-1" color="black-6" weight="semibold">
				<i>What qualifies? Your item may be eligible for price beating if it is:</i>
			</Text>
		</div>
		{#each criteria as { title, text }}
			<div class="grid p-4 md:p-0">
				<Text type="body-2">{title}</Text>
				<Text type="body-2" class="ml-4">{text}</Text>
			</div>
		{/each}

		<div class="mt-16 p-4 md:p-0">
			<Text type="body-1" color="black-6" weight="semibold">
				Best Price Program Qualified Competitor (Competitors we price will beat) criteria:
			</Text>
		</div>
		<div class="mt-8">
			<ul style="list-style: disc;" class="ml-4">
				<li class="ml-4">
					<Text type="body-2">
						Competitor is an entity that is registered in Singapore or Indonesia.
					</Text>
				</li>
				<li class="ml-4">
					<Text type="body-2">
						Competitor must have a physical brick and mortar store in Singapore or Indonesia.
					</Text>
				</li>
				<li class="ml-4">
					<Text type="body-2">
						Competitor is not an Authorized Dealer of the item that customer wants Luxehouze to beat
						in terms of pricing.
					</Text>
				</li>
				<li class="ml-4">
					<Text type="body-2">Competitor must have more than 250 Google reviews.</Text>
				</li>
			</ul>
		</div>
	</div>
</div>
