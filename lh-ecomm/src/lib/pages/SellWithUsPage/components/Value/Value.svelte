<script>
	import Text from '$lib/components/Text/Text.svelte';

	const Value1 =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/SWU_How_we_value_your_item_1.jpg?v=1730254987';
	const Value2 =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/SWU_How_we_value_your_item_2.jpg?v=1730254988';
	const Value3 =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/SWU_How_we_value_your_item_3.jpg?v=1730255010';
	const Value4 =
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/SWU_How_we_value_your_item_4.jpg?v=1730255010';

	const items = [
		{
			src: Value1,
			alt: '',
			title: '1. Bring your item to our boutique',
			description:
				'Drop off your item at our boutique and enjoy a luxurious experience during your visit.'
		},
		{
			src: Value2,
			alt: '',
			title: '2. Let our staff appraise your item',
			description:
				'Our expert team will use world-class equipment to provide a precise appraisal of your item.'
		},
		{
			src: Value3,
			alt: '',
			title: '3. Discuss your payment option',
			description:
				'Our team will contact you to discuss the price offer and the payment option that suits you best.'
		},
		{
			src: Value4,
			alt: '',
			title: '4. Get paid',
			description: "Once all steps are completed, you'll receive your payment."
		}
	];
</script>

<div class="container max-w-[1600px] text-center mt-8 grid md:px-12">
	<Text type="title-2" weight="semibold" color="black-10" class="!text-xl md:!text-3xl"
		>How We Value Your Item
	</Text>
	<Text type="body-1" color="black-5" class="mt-2 max-w-lg mx-auto">
		We're committed to providing you with fair valuation. From the beginning until the end, every
		step is designed to offer you the utmost ease, professionalism, and transparency.
	</Text>
	<div class="flex overflow-x-auto">
		{#each items as { src, alt, title, description }}
			<div class="w-full mt-10">
				<div class="p-4 text-left">
					<img {src} {alt} class="max-w-xs h-auto object-cover mb-4 rounded" />
					<div class="text-base font-bold text-[#17181A]">{title}</div>
					<div class="text-base font-light text[#666975] max-w-xs">
						<Text type="body-1" color="black-6" weight="regular">{description}</Text>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
