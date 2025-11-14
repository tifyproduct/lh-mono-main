<script lang="ts">
	import { page } from '$app/stores';
	import Text from '$lib/components/Text/Text.svelte';
	import Swiper from 'swiper';
	import 'swiper/swiper-bundle.css';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	const currentPage = get(page);
	const store = currentPage.params.store;

	const promotionData = store === 'id' ? $page.data.promotionDataID : $page.data.promotionDataSG;
	const baseParams = `/${$page.params.store}/${$page.params.lang}`;

	let swiper;
	onMount(() => {
		swiper = new Swiper('.swiper-container', {
			slidesPerView: 1.2,
			spaceBetween: 10,
			breakpoints: {
				768: {
					slidesPerView: 2
				}
			}
		});
	});
</script>

<div class="container max-w-[1600px] md:p-20 p-4">
	<Text type="subtitle-1" color="black-9" weight="semibold">Featured Promos</Text>
	<div class="mt-4 grid grid-cols-2 gap-4 hidden md:grid">
		{#if promotionData && promotionData.length > 0}
			{#each promotionData as promo}
				<div class="flex min-h-52 overflow-hidden">
					<img
						src={promo.image.url}
						alt={promo.title.value}
						class="w-1/2 h-full object-cover rounded-l"
					/>
					<div class="w-1/2 flex flex-col border justify-between p-4 rounded-r">
						<Text type="body-1" color="black-9" weight="semibold" class="text-lg font-semibold"
							>{promo.title.value}
						</Text>
						<Text type="body-2" color="black-5">{promo.description.value}</Text>
						<a class="mt-auto mx-auto" href={`${baseParams}/promotions/${promo.handle}`}>
							<Text type="body-1" color="black-9" weight="semibold">SEE PROMO</Text>
						</a>
					</div>
				</div>
			{/each}
		{/if}
	</div>

	<div class="block md:hidden lg:hidden">
		<div class="swiper-container mt-8 overflow-hidden md:hidden">
			<div class="swiper-wrapper">
				{#if promotionData && promotionData.length > 0}
					{#each promotionData as promo}
						<div class="swiper-slide">
							<div class="flex flex-col">
								<img
									src={promo.image.url}
									alt="Promo Banner"
									class="w-full aspect-[4/3] object-cover rounded-t"
								/>

								<div class="border p-4 grid min-h-[212px] rounded-b">
									<div class="grid mb-10">
										<Text type="body-1" color="black-9" weight="semibold">
											{promo.title.value}
										</Text>
										<Text type="body-2" color="black-5">
											{promo.description.value}
										</Text>
									</div>
									<a class="mt-auto mx-auto" href={`${baseParams}/promotions/${promo.handle}`}>
										<Text type="body-1" color="black-9" weight="semibold">SEE PROMO</Text>
									</a>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</div>
</div>
