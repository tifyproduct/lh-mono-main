<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import Swiper from 'swiper';
	import 'swiper/swiper-bundle.css';
	import { onMount } from 'svelte';
	import {
		Number1Editor,
		Number2Editor,
		Number3Editor,
		Number4Editor,
		Number5Editor
	} from 'svelte-remix';

	let swiperContainer: HTMLDivElement | null = null;

	let USPcards = [
		{
			title: 'INTEGRITY',
			description:
				'We live in accordance with our deepest values, always ensuring an alignment between what we do and say.',
			icon: Number1Editor
		},
		{
			title: 'TEAMWORK',
			description:
				'Our company values people relationships. Whether it is with other businesses or within our own family, we aim to build trust with anyone.',
			icon: Number2Editor
		},
		{
			title: 'OWNERSHIP',
			description:
				'Every employee is the owner of the company. Each takes meaningful actions to bring positive results.',
			icon: Number3Editor
		},
		{
			title: 'LEARNING AND IMPROVEMENT',
			description:
				'All of us continuously grow and develop new things to improve our business mindset, both as individuals and as a company.',
			icon: Number4Editor
		},
		{
			title: 'CUSTOMER OBSESSION',
			description:
				'We always listen to our customers’ voices to be able to keep improving our services and delivering five-star customer experience.',
			icon: Number5Editor
		}
	];
	onMount(() => {
		if (swiperContainer) {
			new Swiper(swiperContainer, {
				spaceBetween: 20,
				slidesPerView: 1,
				loop: true,
				breakpoints: {
					640: { slidesPerView: 1 },
					768: { slidesPerView: 2, spaceBetween: 30 },
					1024: { slidesPerView: 4.5, spaceBetween: 20 }
				}
			});
		}
	});
</script>

<div class="container max-w-[1600px] overflow-hidden">
	<div class="text-center p-5 sm:p-10 md:p-4 grid">
		<Text weight="semibold" type="title-3">WHAT WE VALUE</Text>
	</div>

	<div class="swiper-container mt-4 md:mt-8" bind:this={swiperContainer}>
		<div class="swiper-wrapper md:px-20 md:px-4 mb-8">
			{#each USPcards as card}
				<div class="swiper-slide flex justify-center px-4">
					<div
						class="bg-white-1 rounded w-[100%] h-auto p-6 min-h-52 border flex flex-col items-center text-center"
					>
						<svelte:component this={card.icon} class="w-8 h-8" />
						<Text type="body-1" weight="semibold" class="mt-1">{card.title}</Text>
						<Text type="caption-1" class="mt-0">{card.description}</Text>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.swiper-slide {
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
