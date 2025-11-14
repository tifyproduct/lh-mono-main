<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Related from '$lib/pages/PromotionsPage/components/Related/Related.svelte';

	export let data;

	const descriptions = [
		"LEGACY™ Established in 2019, Legacy™ offers a complete, premium protection for your luxury watches and bags as a legacy you intend to pass on. Legacy™ Diamond Shield, their notable product, is the industry's highest quality and most durable protection film for your hardware. This exquisite shield is sold only by a handful of sole authorized distributors, and Luxehouze is one of them.",
		'Legacy™ Diamond Shield is almost invisible, crystal clear, and does not stress your items. It highlights four unique features: real skin, real fit, real seamless, and real finish. It guarantees the same finishing and feel of metal, maximum coverage and perfect contour fit, smooth rounded and transparent edges, as well as a flawless final result.',
		"Through these features, Legacy™ Diamond Shield protects your precious pieces from potential damage or scratches against the harsh conditions the outside world brings. Quoting Legacy™, the first scratch hurts the most. Don't let the regret be yours."
	];
</script>

<div class="container max-w-[1600px] md:p-20 p-4">
	<div class="max-w-lg mx-auto grid">
		<img
			src="https://id.luxehouze.com/cdn/shop/files/NEW_Banner_362_x_262_LEGACY_2.jpg?v=1686810136"
			alt="Promo Banner"
			width="100%"
			class="h-full object-cover"
		/>
		<Text type="subtitle-1" weight="semibold" class="mt-8">LEGACY™ DIAMOND SHIELD</Text>
		<Text type="body-1" color="black-5" class="mt-4">
			LEGACY™ DIAMOND SHIELD IS NOW AVAILABLE AT LUXEHOUZE
		</Text>
		{#each descriptions as point}
			<Text type="body-1" color="black-5" class="mt-2">
				{point}
			</Text>
		{/each}
	</div>
	<div class="mt-10">
		<Related items={data.happeningNow} />
	</div>
</div>
