<!-- <script>
	import ThoseWhoSell from '$lib/assets/static/sell-with-us/thosewhosell.png';
	import { Rating, Star } from 'flowbite-svelte';

	let reviews = [
		{
			image: ThoseWhoSell,
			rating: 4.5,
			text: 'Exclusive place to find luxurious watches. Staff are very friendly and helpful. Top service.',
			author: 'John Doe',
			time: '2 days ago'
		},
		{
			image: ThoseWhoSell,
			rating: 4.5,
			text: 'Another great review from a happy customer.',
			author: 'Jane Smith',
			time: '3 days ago'
		},
		{
			image: ThoseWhoSell,
			rating: 4.5,
			text: 'Best watch platform ever.',
			author: 'Michael Johnson',
			time: '1 week ago'
		}
	];
</script>

<div class="text-center mt-8 md:mt-24">
	<h1 class="text-xl md:text-3xl md:text-center text-left px-4 !font-semibold !text-[#24252B]">
		THOSE WHO HAVE SOLD WITH LUXEHOUZE
	</h1>
	<div class="flex flex-col lg:flex-row place-content-center mt-8 gap-4">
		{#each reviews as review}
			<div class="bg-[#F8F9FB] px-4 py-4 max-w-md text-left">
				<img src={review.image} alt="" />
				<Rating size={20} total={5} rating={review.rating} icon={Star} class="mt-4" />
				<p class="!text-base !font-light !text-[#17181A]">{review.text}</p>
				<p class="text-[#666975] text-xs font-light mt-1">{review.author}, {review.time}</p>
			</div>
		{/each}
	</div>
</div> -->
