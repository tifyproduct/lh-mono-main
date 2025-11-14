<script>
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
</script>

<div class="container max-w-[1600px]">
	<div class="relative w-full h-full">
		<video
			autoplay
			loop
			muted={isMuted}
			playsinline
			class="w-full h-auto object-cover min-h-[230px] md:min-h-none"
		>
			<source
				src="https://cdn.shopify.com/videos/c/o/v/70af8b784b69476f936e1523103cb8be.mp4"
				type="video/mp4"
			/>
		</video>
		<div class="absolute inset-0 flex flex-col items-center justify-center space-y-4">
			<Text type="title-2" weight="semibold" color="white-1">LUXECARE</Text>
			<Text type="subtitle-2" color="white-1" class="max-w-lg text-center">
				LUXEHOUZE'S PREMIUM WATCH SERVICE IN THE HEART OF JAKARTA
			</Text>
		</div>

		<button
			on:click={toggleMute}
			class="absolute bottom-4 right-4 bg-black text-white px-4 py-2 rounded-lg opacity-75 hover:opacity-100 transition-opacity duration-300"
		>
			<VolumeMuteLineMedia color="white" />
		</button>
	</div>
</div>
