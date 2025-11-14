<script>
	import Text from '$lib/components/Text/Text.svelte';
	const videoSrc = 'https://cdn.shopify.com/videos/c/o/v/70af8b784b69476f936e1523103cb8be.mp4';
</script>

<div
	class="container max-w-[1600px] p-4 flex flex-col lg:flex-row place-content-center items-center py-16 bg-[#F8F9FB] mt-20"
>
	<Text type="subtitle-1" weight="semibold" class="md:max-w-md mb-4 md:mb-0">
		More about Luxehouze consignment
	</Text>

	<video src={videoSrc} controls class="w-full max-w-lg rounded">
		Your browser does not support the video tag.
	</video>
</div>
