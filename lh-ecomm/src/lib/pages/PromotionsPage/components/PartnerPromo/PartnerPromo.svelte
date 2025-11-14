<script>
	import Text from '$lib/components/Text/Text.svelte';
	import { Tabs, TabItem, Card } from 'flowbite-svelte';
	import { page } from '$app/stores';

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const isIdStore = $page.params.store === 'id';

	const promotions = {
		rubberb: {
			url: `${baseParams}/promotions/rubber-b`,
			img: 'https://id.luxehouze.com/cdn/shop/files/600x400_x3_RUBBER_B.jpg?v=1718856428',
			title: 'RUBBER B',
			description: 'RUBBER B STRAPS ARE NOW AVAILABLE AT LUXEHOUZE!'
		}
	};

	if (isIdStore) {
		promotions.legacy = {
			url: `${baseParams}/promotions/legacy-diamond-shield`,
			img: 'https://id.luxehouze.com/cdn/shop/files/600x400_x3_LEGACY.jpg?v=1718856450',
			title: 'LEGACY',
			description: 'LEGACY™ DIAMOND SHIELD IS NOW AVAILABLE AT LUXEHOUZE'
		};
	}

	const initialOpenTab = 'all';
</script>

<div class="container max-w-[1600px] md:p-20 p-4 border-b-2 grid">
	<Text type="subtitle-1" weight="semibold">Official Partners Promotion</Text>
	<Text type="body-1" color="black-5">
		These promotions expire today, so don't miss your chance for new luxe!
	</Text>
	<Tabs class="mt-4" contentClass="bg-none mt-8">
		<TabItem title="All" open={initialOpenTab === 'all'}>
			<div class="grid md:flex gap-8">
				{#each Object.entries(promotions) as [key, promo]}
					<div class="space-y-4">
						<Card href={promo.url} img={promo.img} imgClass="rounded-t" class="rounded-b">
							<div class="grid">
								<Text type="body-1" color="black-5">{promo.title}</Text>
								<Text type="body-1" color="black-9" weight="semibold">
									{promo.description}
								</Text>
							</div>
						</Card>
					</div>
				{/each}
			</div>
		</TabItem>

		{#each Object.entries(promotions) as [key, promo]}
			<TabItem title={promo.title} open={key === initialOpenTab}>
				<div class="space-y-4">
					<Card href={promo.url} img={promo.img}>
						<div class="grid">
							<Text type="body-1" color="black-5">{promo.title}</Text>
							<Text type="body-1" color="black-9" weight="semibold">
								{promo.description}
							</Text>
						</div>
					</Card>
				</div>
			</TabItem>
		{/each}
	</Tabs>
</div>
