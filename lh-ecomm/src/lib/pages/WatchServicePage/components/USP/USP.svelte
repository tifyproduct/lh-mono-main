<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import 'swiper/swiper-bundle.css';
	import type { Item } from './types.ts';
	import { page } from '$app/stores';

	let swiperContainer;

	export let items: Item[] = [];

	onMount(() => {
		document.body.style.overflowX = 'hidden';

		const swiper = new Swiper(swiperContainer, {
			slidesPerView: 1,
			spaceBetween: 10,
			loop: true,
			breakpoints: {
				768: {
					slidesPerView: 3
				}
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			}
		});

		return () => {
			document.body.style.overflowX = '';
		};
	});
</script>

<div class="container max-w-[1600px]">
	<Text
		type="subtitle-1"
		weight="semibold"
		class="mx-auto block text-center text-xl md:text-3xl mt-8 pb-4 pt-4"
	>
		WHY LUXEHOUZE ?
	</Text>

	<div class="swiper-container overflow-hidden" bind:this={swiperContainer}>
		<div class="swiper-wrapper flex">
			{#each items as { src, alt, title, description }}
				<div class="swiper-slide w-full px-4 mt-10">
					<div class="bg-white p-4 rounded-lg">
						<img {src} {alt} class="w-full h-auto object-cover mb-4 rounded" />
						<div class="text-xl font-semibold mb-2">{title}</div>
						<div class="text-gray-600">{description}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
