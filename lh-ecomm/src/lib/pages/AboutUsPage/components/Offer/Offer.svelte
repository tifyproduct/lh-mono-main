<script lang="ts">
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import 'swiper/swiper-bundle.css';
	import Text from '$lib/components/Text/Text.svelte';
	import {
		HandCoinLineFinance,
		MoneyDollarBoxLineFinance,
		ArrowLeftRightLineArrows,
		ShieldStarLineSystem,
		ShoppingBagLineFinance
	} from 'svelte-remix';

	let swiperContainer: HTMLDivElement | null = null;

	let USPcards = [
		{
			title: 'CONSIGNMENT SERVICE',
			description:
				'Consign your luxury item with us. Enjoy competitive consignment fees and get access to our extensive list of global clientele and promotion channels.',
			icon: HandCoinLineFinance
		},
		{
			title: 'DIRECT SELLING SERVICE',
			description:
				'We directly purchase your luxury item. Sell your luxury items through a fast process, get the best offering price, and enjoy instant payment.',
			icon: MoneyDollarBoxLineFinance
		},
		{
			title: 'TRADE-IN SERVICE',
			description:
				'Trade-in your old luxury item with a new one. Sell your old piece at the best price, pay the difference, and bring home your new luxury item.',
			icon: ArrowLeftRightLineArrows
		},
		{
			title: 'CONCIERGE SERVICE',
			description:
				"Getting your dream luxury items is now easier than ever. From a highly in-demand item to the rarest piece, we'll find it for you. Pre-order now through our Concierge Service.",
			icon: ShieldStarLineSystem
		},
		{
			title: 'PERSONAL SHOPPING SERVICE',
			description:
				'From shopping in the comfort of your home to getting your item delivered to your doorstep, the choices are yours. Just let us know how we can help you.',
			icon: ShoppingBagLineFinance
		}
	];

	onMount(() => {
		if (swiperContainer) {
			new Swiper(swiperContainer, {
				spaceBetween: 20,
				slidesPerView: 1,
				loop: false,
				breakpoints: {
					640: { slidesPerView: 1.5 },
					768: { slidesPerView: 2, spaceBetween: 30 },
					1024: { slidesPerView: 4.5, spaceBetween: 20 }
				}
			});
		}
	});
</script>

<div class="container max-w-[1600px] overflow-hidden">
	<div class="text-center p-5 sm:p-10 md:p-20 grid">
		<Text weight="semibold" type="title-3">WHAT WE OFFER</Text>
		<Text type="subtitle-3" class="mt-4">
			Whether you're a buyer or a seller, we ensure you get the best shopping experience through our
			five-star services.
		</Text>
	</div>

	<div class="swiper-container" bind:this={swiperContainer}>
		<div class="swiper-wrapper md:px-4">
			{#each USPcards as card}
				<div class="swiper-slide flex justify-center px-4 md:px-0">
					<div
						class="bg-white-1 rounded-lg w-[100%] h-auto p-6 md:min-h-52 border flex flex-col items-center text-center"
					>
						<svelte:component this={card.icon} class="w-8 h-8" />
						<Text type="body-1" weight="semibold" class="mt-4">{card.title}</Text>
						<Text type="caption-2" class="mt-2">{card.description}</Text>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
