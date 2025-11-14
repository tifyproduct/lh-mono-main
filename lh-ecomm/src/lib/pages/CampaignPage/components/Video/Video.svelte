<script>
	import { onMount } from 'svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import { VolumeMuteLineMedia } from 'svelte-remix';
	let isMuted = true;

	const toggleMute = () => {
		const video = document.querySelector('video');
		if (video) {
			video.muted = !video.muted;
			isMuted = video.muted;
		}
	};

	onMount(() => {
		const video = document.querySelector('video');
		if (video) {
			video.muted = isMuted;
			video.play();
		}
	});
</script>

<div class="container max-w-[1600px]">
	<div class="relative w-full h-full">
		<video autoplay loop playsinline class="w-full h-auto object-cover md:min-h-none">
			<source
				src="https://cdn.shopify.com/videos/c/o/v/13e9012f88a74f26a83aee2e556c4643.mp4"
				type="video/mp4"
			/>
		</video>
		<button
			on:click={toggleMute}
			class="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg opacity-75 hover:opacity-100 transition-opacity duration-300"
		>
			<VolumeMuteLineMedia color="white" />
		</button>
	</div>
</div>
