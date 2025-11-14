<script>
	import { Carousel } from 'flowbite-svelte';
	import Image1 from '$lib/assets/static/visit-us/1.png';
	import Image2 from '$lib/assets/static/visit-us/2.png';
	import Image3 from '$lib/assets/static/visit-us/3.png';
	import Image4 from '$lib/assets/static/visit-us/4.jpg';
	import Image5 from '$lib/assets/static/visit-us/5.jpg';
	import Image6 from '$lib/assets/static/visit-us/6.jpg';
	import Image7 from '$lib/assets/static/visit-us/7.png';
	import Image8 from '$lib/assets/static/visit-us/8.png';
	import Image9 from '$lib/assets/static/visit-us/9.jpg';
	import SG from '$lib/assets/static/visit-us/svg/sg.svg';
	import ID from '$lib/assets/static/visit-us/svg/id.svg';
	import Circle from '$lib/assets/static/visit-us/svg/circle.svg';
	import { PhoneFillDevice, MailSendFillBusiness, Map2LineMap } from 'svelte-remix';

	let sgImages = [
		{ src: Image1, alt: 'Image 1' },
		{ src: Image2, alt: 'Image 2' },
		{ src: Image3, alt: 'Image 3' }
	];
	let jktImages = [
		{ src: Image4, alt: 'Image 4' },
		{ src: Image5, alt: 'Image 5' },
		{ src: Image6, alt: 'Image 6' }
	];
	let sbyImages = [
		{ src: Image7, alt: 'Image 7' },
		{ src: Image8, alt: 'Image 8' },
		{ src: Image9, alt: 'Image 9' }
	];

	let cards = [
		{
			images: sgImages,
			flag: SG,
			location: 'Singapore Boutique',
			address: '390 Orchard Road, #02-03, Palais Renaissance Singapore 238871',
			hours: 'Monday - Sunday: 11 AM - 7.45 PM',
			phone: '+65 6539 9380',
			email: 'info@luxehouze.com',
			mapLink: 'https://goo.gl/maps/47UiYsvdTvRGQFNb9'
		},
		{
			images: jktImages,
			flag: ID,
			location: 'Jakarta Boutique',
			address:
				'Prosperity Tower 8th floor unit A-F Jl Jend. Sudirman kav. 52 - 53, Indonesia, Jakarta Selatan, 12190',
			hours: 'Monday - Friday 11am - 7pm, Saturday - Sunday 11am - 5pm',
			phone: '+62 878 8888 0803, (021) 50111285',
			email: 'info@luxehouze.com',
			mapLink: 'https://goo.gl/maps/FHLLyvKMqpqnTJwP6'
		},
		{
			images: sbyImages,
			flag: ID,
			location: 'Surabaya Boutique',
			address:
				'Pakuwon Trade Center Jalan Puncak Indah Lontar II.05 Level UG unit F3/03, Surabaya, East Java 60227',
			hours: 'Monday - Sunday 11am - 8pm',
			phone: '+62 878 8888 0803, (031) 35973025',
			email: 'info@luxehouze.com',
			mapLink: 'https://maps.app.goo.gl/BzLvLrkPRC7vsz6V9'
		}
	];
</script>

<div class="text-center p-4 md:p-20">
	<h1 class="text-3xl font-bold">OUR STORE</h1>
	<p class="text-sm font-normal mt-4 md:max-w-xl mx-auto">
		Luxehouze's exclusive collections are also available offline. Get exclusive shopping experience
		and visit us at these locations:
	</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-16 mb-20">
	{#each cards as card}
		<div class="border max-w-xl rounded">
			<Carousel class="rounded-t rounded-b-none" images={card.images} let:Indicators>
				<Indicators />
			</Carousel>
			<div class="p-4 md:p-8">
				<img src={card.flag} alt="Location Icon" class="w-[46px] h-[32px]" />
				<h1 class="text-xl font-semibold mt-4 mb-2">{card.location}</h1>
				<div class="md:h-20">
					<p class="text-sm font-normal max-w-xs break-words">{card.address}</p>
				</div>
				<div class="flex items-start gap-2 mt-8 md:items-center">
					<img src={Circle} alt="Hours Icon" class="w-[16px] h-[16px]" />
					<p class="text-xs md:text-sm">{card.hours}</p>
				</div>
				<div class="grid md:flex mt-4 gap-4 items-center gap-y-2">
					<div class="flex gap-2 items-center">
						<PhoneFillDevice class="w-[16px] h-[16px]" />
						<p class="text-sm font-semibold">{card.phone}</p>
					</div>
					<div class="flex gap-2 items-center">
						<MailSendFillBusiness alt="Mail Icon" class="w-[16px] h-[16px]" />
						<p class="text-sm font-semibold">{card.email}</p>
					</div>
				</div>
				<a href={card.mapLink}>
					<button class="flex gap-2 items-center mt-8 border p-4 font-semibold">
						<Map2LineMap alt="Map Icon" />
						<p>View in Google Maps</p>
					</button>
				</a>
			</div>
		</div>
	{/each}
</div>
