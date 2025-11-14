<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Related from '$lib/pages/PromotionsPage/components/Related/Related.svelte';

	export let data;

	const bulletPoints = [
		'- Calibrated to perfection',
		'- Crafted for unrivaled quality',
		'- Fit for adventures'
	];

	const descriptions = [
		'Rubber B is a company that pioneers the development of luxurious, integrated rubber watch straps, always at the forefront of innovation. Crafted at the most prestigious strap factory in Switzerland, these straps are the first of their kind, setting trends in the Swiss-watch industry.',
		'Each Rubber B strap contains a solid Titanium insert housing the pin shaft, ensuring a secure, motionless, and aesthetically pleasing mount. Every strap is calibrated to precisely fit and complement the quality and beauty of your luxury watches.',
		"Whether you're an athlete, avid diver, or outdoor enthusiast with a passion for luxury watches, Rubber B rubber straps offer a unique and comfortable alternative to metal bracelets or leather bands. Discover the exclusive collection at Luxehouze, now an authorized reseller of Rubber B."
	];
</script>

<div class="container max-w-[1600px] md:p-20 p-4">
	<div class="max-w-lg mx-auto grid">
		<img
			src="https://id.luxehouze.com/cdn/shop/files/600x400_x3_RUBBER_B.jpg?v=1718856428"
			alt="Promo Banner"
			width="100%"
			class="h-full object-cover"
		/>
		<Text type="subtitle-2" weight="semibold" class="mt-8">
			Rubber B straps are available at Luxehouze!
		</Text>
		{#each bulletPoints as point}
			<Text type="body-1" color="black-5" class="mt-2">
				{point}
			</Text>
		{/each}
		{#each descriptions as description}
			<Text type="body-1" color="black-5" class="mt-4">
				{description}
			</Text>
		{/each}
	</div>
	<div class="mt-10">
		<Related items={data.happeningNow} />
	</div>
</div>
