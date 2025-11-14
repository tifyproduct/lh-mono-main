<script>
	import Reel1 from '$lib/assets/static/watch-service/reel-1.png';
	import Reel2 from '$lib/assets/static/watch-service/reel-2.png';
	import Reel3 from '$lib/assets/static/watch-service/reel-3.png';
	import Reel4 from '$lib/assets/static/watch-service/reel-4.png';

	let images = [Reel1, Reel2, Reel3, Reel4];
</script>

<div class="overflow-x-auto flex gap-4 pb-8 bg-[#F1EFED]">
	{#each images as image, index}
		<div class="flex-shrink-0 bg-white rounded-lg p-6 w-80 snap-center ml-4">
			<a href="#">
				<img src={image} alt={`reels-${index}`} />
			</a>
		</div>
	{/each}
</div>
