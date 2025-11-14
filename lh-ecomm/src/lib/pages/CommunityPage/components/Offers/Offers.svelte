<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Img1 from '$lib/assets/static/community/svg/notification-4-line.svg';
	import Img2 from '$lib/assets/static/community/svg/hand-coin-line.svg';
	import Img3 from '$lib/assets/static/community/svg/coupon-3-line.svg';
	import Img4 from '$lib/assets/static/community/svg/price-tag-3-line.svg';
	import Swiper from 'swiper';
	import 'swiper/swiper-bundle.css';

	let swiper;
	import { onMount } from 'svelte';
	onMount(() => {
		swiper = new Swiper('.swiper-container', {
			loop: true,
			autoplay: {
				delay: 3000,
				disableOnInteraction: false
			},
			slidesPerView: 2,
			spaceBetween: 16,
			breakpoints: {
				640: {
					slidesPerView: 1
				},
				768: {
					slidesPerView: 2
				},
				1024: {
					slidesPerView: 4
				}
			}
		});
	});

	const items = [
		{
			img: Img1,
			title: 'Daily Updates',
			description: 'Get a chance to receive news and updates every day before anyone else.',
			width: 'w-60'
		},
		{
			img: Img2,
			title: 'Exclusive Offers',
			description: 'Enjoy unique deals and discounts available only to our community members',
			width: 'w-60'
		},
		{
			img: Img3,
			title: 'Event, Content and Promo Updates',
			description:
				'Make the most of our promo announcements, insightful content, and exclusive event invitations.',
			width: 'w-80'
		},
		{
			img: Img4,
			title: 'Special Pre-Order',
			description: "Secure new releases before they're available on our website to the public.",
			width: 'w-60'
		}
	];
</script>

<div class="text-center py-8 place-items-center overflow-hidden">
	<Text type="subtitle-1" class="text-2xl px-4 !font-semibold">WHAT OUR COMMUNITY OFFERS</Text>
	<div class="swiper-container py-8 px-4">
		<div class="swiper-wrapper">
			{#each items as { img, title, description, width }}
				<div class="swiper-slide">
					<div
						class={`text-left sm:text-center flex flex-col items-start sm:items-center ${width}`}
					>
						<img src={img} alt={title} />
						<Text type="body-1" class="!text-[#33353D] text-sm !font-semibold mt-2">{title}</Text>
						<Text type="body-1" class="!text-[#858895] text-xs">{description}</Text>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.swiper-container {
		width: 100%;
	}
	.swiper-slide {
		display: flex;
		justify-content: center;
	}
</style>
