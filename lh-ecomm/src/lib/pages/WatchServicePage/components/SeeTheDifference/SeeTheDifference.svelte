<script>
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import 'swiper/swiper-bundle.css';
	import Text from '$lib/components/Text/Text.svelte';

	const images = [
		{
			url: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/before2.jpg?v=1728272713',
			description: 'Richard Mille . Polishing Service'
		},
		{
			url: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/before3.jpg?v=1728283909',
			description: 'Patek Philippe . Polishing Service'
		}
	];

	let swiperContainer;

	onMount(() => {
		if (swiperContainer) {
			new Swiper(swiperContainer, {
				spaceBetween: 20,
				slidesPerView: 1.2,
				loop: false,
				breakpoints: {
					640: {
						slidesPerView: 1,
						spaceBetween: 20
					},
					768: {
						slidesPerView: 1,
						spaceBetween: 30
					},
					1024: {
						slidesPerView: 1,
						spaceBetween: 20
					}
				}
			});
		}
	});
</script>

<div class="container max-w-[1600px]">
	<div class="flex items-center px-4 md:px-16">
		<div class="w-full md:w-1/3 mb-0 md:mb-0">
			<Text type="title-3" weight="semibold" class="block text-xl md:text-3xl pb-4 pt-4 mt-8">
				Our Service Results
			</Text>

			<Text type="body-1" class="block text-xs md:text-base pb-4 text-gray-500">
				View some remarkable watch services we have completed for our happy clients.
			</Text>
		</div>
		<div class="flex-grow border-t border-gray-300 mx-4"></div>
	</div>

	<div class="md:flex gap-8 justify-center hidden mt-8">
		<div class="grid gap-2">
			<img
				src="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/before2.jpg?v=1728272713"
				style="max-width: 486px; max-height:300px; border-radius: 4px;"
				alt="Richard Mille"
			/>
			<Text type="body-1" color="black-5">Richard Mille . Polishing Service</Text>
		</div>
		<div class="grid gap-2">
			<img
				src="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/before3.jpg?v=1728283909"
				style="max-width: 486px; max-height:300px; border-radius: 4px;"
				alt="Patek Philippe"
			/>
			<Text type="body-1" color="black-5">Patek Philippe . Polishing Service</Text>
		</div>
	</div>
	<div
		class="swiper-container overflow-hidden md:overflow-visible max-w-xl mt-0 md:hidden"
		bind:this={swiperContainer}
	>
		<div class="swiper-wrapper">
			{#each images as { url, description }}
				<div class="swiper-slide">
					<img src={url} class="w-full h-auto object-cover" alt="Service Result" />
					<Text type="body-1" class="mt-4 text-left" color="black-5">
						{description}
					</Text>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.swiper-container {
		width: 100%;
		height: auto;
		padding-left: 0px;
	}

	.swiper-slide {
		display: flex;
		flex-direction: column;
	}

	.swiper-slide img {
		width: 100%;
		height: auto;
		object-fit: cover;
		margin: 0;
	}

	.swiper-slide .text-left {
		font-size: 14px;
		margin-top: 8px;
		text-align: left;
		width: 100%;
	}
</style>
