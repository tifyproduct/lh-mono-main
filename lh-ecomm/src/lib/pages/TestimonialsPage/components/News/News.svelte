<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import Swiper from 'swiper';
	import { Navigation } from 'swiper/modules';
	import 'swiper/swiper-bundle.css';
	import { onMount } from 'svelte';
	import TechinAsia from '$lib/assets/static/testimonials/techinasia.avif';
	import Tatler from '$lib/assets/static/testimonials/tatler.avif';
	import Woman from '$lib/assets/static/testimonials/woman.avif';
	import Tempo from '$lib/assets/static/testimonials/tempo.avif';
	import InfoBrand from '$lib/assets/static/testimonials/infobrand.avif';
	import { ArrowLeftLineArrows, ArrowRightLineArrows } from 'svelte-remix';

	let swiperContainer: HTMLDivElement | null = null;

	let USPcards = [
		{
			description: 'Luxehouze, Luxury Marketplace Pilihan untuk Penjual dan Pembeli Barang Mewah',
			img: TechinAsia
		},
		{
			description:
				'Surga Penikmat Barang Mewah, Luxehouze Jadi Andalan untuk Belanja Luxury Fashion',
			img: Tatler
		},
		{
			description:
				'Perayaan Eksklusif: Mine Personalised Skin Clinic Rayakan Tahun Pertama dengan Luxehouze',
			img: Woman
		},
		{
			description: 'Cantik Berburu Koleksi Barang Mewah Luxehouze Hadir di Jakarta',
			img: Tempo
		},
		{
			description: 'Setelah Hadir di Singapura, Luxehouze Juga Hadirkan Toko Offline di Indonesia',
			img: InfoBrand
		}
	];

	onMount(() => {
		if (swiperContainer) {
			new Swiper(swiperContainer, {
				modules: [Navigation],
				spaceBetween: 0,
				slidesPerView: 1,
				loop: false,
				breakpoints: {
					640: { slidesPerView: 1 },
					768: { slidesPerView: 2, spaceBetween: 30 },
					1024: { slidesPerView: 3.5, spaceBetween: 0 }
				}
			});
		}
	});
</script>

<div class="container max-w-[1600px] overflow-hidden">
	<div class="relative swiper-container mt-4 md:mt-8" bind:this={swiperContainer}>
		<div class="flex items-center justify-between px-4 py-4">
			<Text type="subtitle-1" weight="semibold">As Mentioned in The News</Text>
			<div class="flex-1 mx-4">
				<hr class="bg-black-1 h-1 w-full" />
			</div>
		</div>
		<div class="swiper-wrapper mb-8">
			{#each USPcards as card}
				<div class="swiper-slide flex justify-center px-4">
					<div class="bg-white-1 rounded-lg p-0 flex flex-col items-center text-center">
						<img src={card.img} alt="" class="w-48 h-24 object-contain rounded-lg" />
						<Text type="subtitle-3" weight="semibold" class="line-clamp-2">{card.description}</Text>
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
