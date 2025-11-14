<script>
	import { Carousel } from 'flowbite-svelte';
	import { ArrowLeftLineArrows, ArrowRightLineArrows } from 'svelte-remix';
	import Text from '$lib/components/Text/Text.svelte';

	let currentIndex = 0;
	const videos = [
		'https://www.youtube.com/embed/FWLgrOikv8Q?si=nkb1nKC75H1X_o1k',
		'https://www.youtube.com/embed/rTAdnOyfjxo?si=8wN9u2vjFINxkxY5',
		'https://www.youtube.com/embed/PSD947Epu4A?si=YemCMetet4DBpj0j',
		'https://www.youtube.com/embed/Udd7yBlfhS4?si=L5KoJibFBVPNBoBA',
		'https://www.youtube.com/embed/pI96mD1eA-w?si=iRYuK5DunTFil6qb'
	];

	function next() {
		currentIndex = (currentIndex + 1) % videos.length;
	}

	function previous() {
		currentIndex = (currentIndex - 1 + videos.length) % videos.length;
	}
</script>

<div class="container max-w-[1600px]">
	<div class="grid text-center justify-center p-6 md:p-0 md:mt-20">
		<Text weight="semibold" color="black-9" type="title-3">Tried and Trusted by People</Text>
		<Text weight="regular" type="body-1" color="black-5" class="max-w-lg md:max-w-4xl mt-4">
			We don't just guarantee you our promise, we deliver them. You are at the center of our service
			and excellency. Watch and see what hundreds of our happy customers are saying about our
			service.
		</Text>
	</div>

	<div class="flex items-center justify-center">
		<button on:click={previous} class="md:block hidden bg-black-9 text-white p-2 rounded-full">
			<ArrowLeftLineArrows fill="white" />
		</button>
		<iframe
			class="p-4 md:p-20 rounded-lg md:w-[60%] md:min-h-[500px]"
			src={videos[currentIndex]}
			title={`YouTube video ${currentIndex + 1}`}
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>

		<button on:click={next} class="md:block hidden bg-black-9 text-white p-2 rounded-full">
			<ArrowRightLineArrows fill="white" />
		</button>
	</div>

	<div class="flex justify-center space-x-2 mb-8">
		{#each videos as _, i}
			<button
				class="w-3 h-3 md:w-4 md:h-4 rounded-full"
				style="background-color: {i === currentIndex
					? 'var(--color-black-9)'
					: 'var(--color-black-5)'}"
				on:click={() => (currentIndex = i)}
			/>
		{/each}
	</div>
</div>
