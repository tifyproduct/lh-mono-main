<script lang="ts">
	import { googleAnalClickProduct } from '$lib/utils/googleAnalytics';

	import Text from '../Text/Text.svelte';
	import watermarkLogo from '$lib/assets/static/watermark-logo.png';

	export let description: string;
	export let imageURL: string;
	export let imageHeight = 'h-16';
	export let minImageHeight = 'min-h-16';
	export let imageWidth = 'w-16';
	export let minImageWidth = 'min-w-16';
	export let url;
	export let googleEvent: string = '';
</script>

<a
	on:click={() => googleAnalClickProduct(googleEvent, { name: description })}
	href={url}
	class="ipc__wrapper flex items-center mb-3"
>
	<div class="relative ipc__image pr-2 {minImageHeight} {minImageWidth} {imageWidth} {imageHeight}">
		<img
			src={watermarkLogo}
			class="absolute w-[8px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pr-2"
			alt="watermark"
		/>
		<img
			class="object-cover pointer-events-none"
			src={imageURL}
			alt={description}
			crossorigin="anonymous"
		/>
	</div>
	<div class="ipc__desc flex">
		<Text color="black-6" type="caption-2" weight="regular">{description}</Text>
	</div>
</a>
