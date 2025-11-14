<script lang="ts">
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows, CloseFillSystem } from 'svelte-remix';
	import Text from '../Text/Text.svelte';
	import type { HTMLImgAttributes } from 'svelte/elements';

	import { createEventDispatcher, onMount } from 'svelte';
	import watermarkLogo from '$lib/assets/static/watermark-logo.png';

	export let images: Array<HTMLImgAttributes> = [];
	export let selectedImageCarouselIndex: number = 0;

	let selectedIndex: number = selectedImageCarouselIndex;

	let isZoomed = false;
	let isMobile = false;

	const dispatch = createEventDispatcher();

	const handlePrevClicked = () => {
		isZoomed = false;
		if (selectedIndex > 0) {
			selectedIndex--;
			return;
		}

		selectedIndex = images.length - 1;
	};

	const handleNextClicked = () => {
		isZoomed = false;

		if (selectedIndex < images.length - 1) {
			selectedIndex++;
			return;
		}

		selectedIndex = 0;
	};

	const toogleZoom = () => {
		if (!isMobile) {
			isZoomed = !isZoomed;
		}
	};

	const handleCloseClicked = () => {
		dispatch('close-modal');
	};

	let xDown: number | null = null;
	let yDown: number | null = null;

	const getTouches = (evt: TouchEvent): TouchList => {
		return evt.touches;
	};

	const handleTouchStart = (evt: TouchEvent) => {
		const firstTouch = getTouches(evt)[0];
		xDown = firstTouch.clientX;
		yDown = firstTouch.clientY;
	};

	const handleTouchMove = (evt: TouchEvent) => {
		if (!xDown || !yDown) {
			return;
		}

		var xUp = evt.touches[0].clientX;
		var yUp = evt.touches[0].clientY;

		var xDiff = xDown - xUp;
		var yDiff = yDown - yUp;

		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			if (xDiff > 0) {
				handleNextClicked();
			} else {
				handlePrevClicked();
			}
		}
		/* reset values */
		xDown = null;
		yDown = null;
	};

	onMount(() => {
		const updateScreenSize = () => {
			isMobile = window.innerWidth < 768;
			isZoomed = false;
		};

		updateScreenSize();
		window.addEventListener('resize', updateScreenSize);

		document.addEventListener('touchstart', handleTouchStart, false);
		document.addEventListener('touchmove', handleTouchMove, false);

		return () => {
			window.removeEventListener('resize', updateScreenSize);
		};
	});
</script>

<div class="bg-black-10 absolute w-full h-[100vh] left-0 top-0 z-50 lg:p-12 overflow-auto">
	<div class="relative text-center max-lg:p-4">
		<CloseFillSystem
			size={28}
			class="text-white-1 absolute cursor-pointer"
			on:click={handleCloseClicked}
		/>
		<Text type="subtitle-1" weight="semibold" color="white-1">
			{selectedIndex + 1}/{images.length}
		</Text>
	</div>
	<div class="lg:mt-12 flex justify-around w-full relative items-center max-lg:h-[90vh]">
		<ArrowLeftSLineArrows
			size={40}
			class="text-white-1 cursor-pointer max-lg:hidden"
			on:click={handlePrevClicked}
		/>
		<div
			class="max-w-[78vh] max-h-[900px] overflow-auto relative"
			on:click={toogleZoom}
			role="presentation"
		>
			<div class="overflow-auto h-full w-full relative">
				<div class="cursor-zoom-in transform duration-250 ease-linear">
					<img
						src={watermarkLogo}
						class="absolute w-[23px] lg:w-[50px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
						alt="watermark"
						class:lg:w-[70px]={isZoomed}
					/>
					<img
						class="pointer-events-none"
						src={images[selectedIndex].src}
						alt={images[selectedIndex].src}
						class:scale-[1.6]={isZoomed}
						class:cursor-zoom-out={isZoomed}
					/>
				</div>
			</div>
		</div>

		<ArrowRightSLineArrows
			size={40}
			class="text-white-1 cursor-pointer max-lg:hidden"
			on:click={handleNextClicked}
		/>
	</div>
</div>
