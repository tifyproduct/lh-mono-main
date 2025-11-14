<script>
	import { onMount } from 'svelte';
	import Swiper from 'swiper';
	import 'swiper/swiper-bundle.css';

	import Text from '$lib/components/Text/Text.svelte';

	let reels = [
		{
			src: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/c3ee-42e7-a6d1-6ef57cf0d1fe.gif?v=1728633238',
			label: 'How do you define luxury ?',
			link: 'https://www.instagram.com/reel/DA7sg2Kv5HM/?igsh=MXFpZXhzZjBhbDRoZg=='
		},
		{
			src: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/campaign-reels-3.gif?v=1728846097',
			label: "Welcome to Jakarta's house of luxury.",
			link: 'https://www.instagram.com/reel/DBEJhVEBwtD/?igsh=aXl2dWpudW9xZG1q'
		},
		{
			src: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/campaign-reels-4.gif?v=1728846097',
			label: "Welcome to Surabaya's house of luxury",
			link: 'https://www.instagram.com/reel/DB-gHE4PTQ5/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=='
		},
		{
			src: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Calling_all_luxury_watches_enthusiasts_Join_our_exclusive_community_and_be_the_first_to_know_about_our_latest_arrivals_and_best_deals._You_ll_get_early_update_to_new_and_authenthic_hi.gif?v=1730884585',
			label: 'Never miss an update.<br/> Join our community!',
			link: 'https://www.instagram.com/reel/DBqd6TIvLFo/?igsh=bDR6cXo3eGd1a3U5'
		},
		{
			src: 'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/chronondo_has_an_eye_for_excellence_and_a_wit_sharper_than_a_second_hand_at_jwx.official_Watch_as_he_rates_our_coveted_timepiece_collection_focusing_on_craftsmanship_that_ll_make_your.gif?v=1730884842',
			label: 'Mr Watches rating our watch collection at JWX 5.0',
			link: 'https://www.instagram.com/reel/DB6VI5zvzcJ/?igsh=cjZld2wzamIyczBh'
		}
	];

	let swiper;

	onMount(() => {
		swiper = new Swiper('.mySwiper', {
			spaceBetween: 30,
			slidesPerView: 2.2,
			loop: false,
			breakpoints: {
				1028: {
					slidesPerView: 4.5
				}
			},
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev'
			},
			pagination: {
				el: '.swiper-pagination',
				clickable: true
			}
		});
	});
</script>

<div class="container mx-auto text-center mt-10">
	<Text type="subtitle-1">CELEBRATE WITH US</Text>
	<div class="max-w-5xl mx-auto mb-8">
		<Text type="body-1" color="black-4">
			Experience how timepieces can transform your life's milestones. Each tells a story of love,
			legacy, and celebration. Discover the elegance that awaits and inspire you to celebrate every
			moment that matters.
		</Text>
	</div>

	<div class="mySwiper p-4">
		<div class="swiper-wrapper">
			{#each reels as { src, label, link }, index}
				<div class="swiper-slide flex justify-center">
					<a href={link} target="_blank" rel="noopener noreferrer" class="flex flex-col items-left">
						<img {src} alt={`reel-${index}`} class="rounded w-full max-w-[600px] shadow-lg" />
						<Text type="body-1" color="black-5" class="mt-2 text-left">{@html label}</Text>
					</a>
				</div>
			{/each}
		</div>

		<div class="swiper-pagination"></div>
	</div>
</div>

<style>
	.mySwiper {
		padding-bottom: 20px;
		overflow: hidden;
	}
</style>
