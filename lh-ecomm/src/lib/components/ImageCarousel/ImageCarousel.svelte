<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { Carousel } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let data: HTMLImgAttributes[] = [];
	export let focusedImage: HTMLImgAttributes | null = null;

	let focusedIndex: number = 0;
	const dispatch = createEventDispatcher();

	const handleOnImageClicked = () => {
		dispatch('image-clicked', focusedIndex);
	};

	$: {
		if (focusedImage) {
			focusedIndex = data.findIndex((image) => image.id === focusedImage.id);
		}
	}
</script>

<div class="w-full relative">
	<Carousel images={data} index={focusedIndex} let:Controls imgClass="object-contain">
		<div slot="slide" let:Slide let:index on:click={handleOnImageClicked} role="presentation">
			<Slide image={data[index]} class="object-contain" loading="eager" />
		</div>

		<slot name="imageOverlay" />

		{#if (data ?? []).length > 1}
			<Controls class="z-10" />
		{/if}
	</Carousel>
</div>
