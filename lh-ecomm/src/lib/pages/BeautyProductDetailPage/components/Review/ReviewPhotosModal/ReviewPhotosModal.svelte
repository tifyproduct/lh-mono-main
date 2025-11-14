<script lang="ts">
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	import Modal from '$lib/components/Modal/Modal.svelte';
	import Divider from '$lib/components/Divider/Divider.svelte';

	import getImageSrc from '$lib/utils/getImageSrc';

	export let isOpen: boolean;
	export let onClose: () => void;
	export let images: Array<string> = [];

	$: currentImageIndex = 0;

	const onClickPrevImage = () => {
		currentImageIndex = currentImageIndex - 1;
	};

	const onClickNextImage = () => {
		currentImageIndex = currentImageIndex + 1;
	};

	const onClickThumbnail = (index: number) => {
		currentImageIndex = index;
	};
</script>

<div>
	<Modal title="Photos & Videos from Customer" {isOpen} {onClose}>
		<div class="relative w-full h-[480px]">
			<div class="absolute inset-y-0 left-0 flex items-center">
				<button on:click={onClickPrevImage} disabled={currentImageIndex === 0}>
					<ArrowLeftSLineArrows class="cursor-pointer" />
				</button>
			</div>

			<img
				src={images[currentImageIndex]}
				alt={images[currentImageIndex]}
				class="w-full h-full object-contain rounded"
			/>

			<div class="absolute inset-y-0 right-0 flex items-center">
				<button on:click={onClickNextImage} disabled={currentImageIndex === images.length - 1}>
					<ArrowRightSLineArrows class="cursor-pointer" />
				</button>
			</div>
		</div>

		<Divider />

		<div class="flex overflow-auto gap-3">
			{#each images as image, index}
				<img
					src={image}
					alt={image}
					class="w-[90px] h-[90px] object-contain rounded cursor-pointer"
					role="presentation"
					on:click={() => onClickThumbnail(index)}
				/>
			{/each}
		</div>
	</Modal>
</div>
