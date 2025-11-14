<script lang="ts">
	import { onMount } from 'svelte';

	import { Carousel } from 'flowbite-svelte';

	import Skeleton from '$lib/components/Skeleton/Skeleton.svelte';

	import type { BannerData } from './types';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let isLoading = false;
	export let data: BannerData[] | undefined = undefined;
	export let showIndicator = false;

	export let bannerHeightMobile = '!h-[300px]';
	export let bannerHeightTablet = '!h-[600px]';
	export let bannerHeightDesktop = '!h-[470px]';

	let isMobile = false;
	let isTablet = false;

	onMount(() => {
		const updateScreenSize = () => {
			isMobile = window.innerWidth < 768;
			isTablet = window.innerWidth >= 768 && window.innerWidth <= 1200;
		};

		updateScreenSize();
		window.addEventListener('resize', updateScreenSize);

		return () => {
			window.removeEventListener('resize', updateScreenSize);
		};
	});

	$: imagesToShow =
		data?.map((item) => {
			if (isTablet || isMobile) {
				return {
					alt: item.bannerAlt || 'Banner',
					src: item.urlBannerMobile,
					url: item.urlLink
				};
			}
			return {
				alt: item.bannerAlt || 'Banner',
				src: item.urlBanner,
				url: item.urlLink
			};
		}) || [];

	$: imageClass = isMobile
		? bannerHeightMobile
		: isTablet
			? bannerHeightTablet
			: bannerHeightDesktop;

	const handleClickImage = () => {
		googleAnalClickedEvent('click_slider_banner', {});
	};
</script>

<div>
	{#if isLoading}
		<div>
			<Skeleton width="w-full min-h-[460px]" />
		</div>
	{:else}
		<Carousel
			class="{imageClass} rounded-none"
			imgClass="{imageClass} object-cover"
			images={imagesToShow}
			duration={5000}
			let:Controls
			disableSwipe
			let:Indicators
		>
			{#if showIndicator}
				<Indicators />
			{/if}
			<a
				slot="slide"
				href={imagesToShow[index]?.url}
				target="_blank"
				let:Slide
				let:index
				on:click={handleClickImage}
			>
				<Slide image={imagesToShow[index]} loading="eager" />
			</a>
			{#if (data ?? []).length > 1}
				<Controls let:changeSlide let:ControlButton>
					<ControlButton
						name="Previous"
						forward={false}
						on:click={() => {
							changeSlide(false);

							googleAnalClickedEvent('click_navigation_slider_banner', {
								action: 'Previous'
							});
						}}
					/>
					<ControlButton
						name="Next"
						forward
						on:click={() => {
							changeSlide(true);

							googleAnalClickedEvent('click_navigation_slider_banner', {
								action: 'Next'
							});
						}}
					/>
				</Controls>
			{/if}
		</Carousel>
	{/if}
</div>
