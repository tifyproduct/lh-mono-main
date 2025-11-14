<script>
	import Text from '$lib/components/Text/Text.svelte';
	import { Carousel } from 'flowbite-svelte';
	import InspectionList1 from '$lib/assets/static/authenticity/svg/inspectionlist1.svg';
	import { page } from '$app/stores';

	const images = [{ src: InspectionList1, alt: 'Inspection List 1' }];
	let index = 0;

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const inspectionListUrl = `${baseParams}/inspection-list`;

	function scrollToRelatedArticle() {
		const element = document.getElementById('related-articles');
		if (element) {
			element.scrollIntoView({ behavior: 'smooth' });
		}
	}
</script>

<div class="container max-w-[1600px]">
	<div class="text-center p-20">
		<h1 class="font-bold text-2xl">LUXEHOUZE 360° INSPECTION LIST</h1>
		<a href={inspectionListUrl}>
			<button class="rounded mt-8 bg-[#24252B] text-[#FFFFFF] px-4 py-4 font-semibold text-xs">
				VIEW COMPLETE LIST
			</button>
		</a>

		<div class="max-w-3xl mx-auto">
			<Carousel
				{images}
				class="min-h-[400px] md:min-h-[800px] items-center"
				imgClass="object-contain h-auto w-auto rounded-sm"
			/>
		</div>

		<div
			class="bg-black-1 flex flex-col md:flex-row justify-center md:max-w-fit mx-auto px-4 md:px-16 py-8 md:py-12 gap-8 rounded mt-8"
		>
			<div class="text-left grid">
				<Text type="body-2" color="black-5">
					This list is based on Luxehouze's Inspection Process.
				</Text>
				<Text type="subtitle-3" weight="semibold" color="black-9">
					Want to know how you can do it on your own?
				</Text>
			</div>
			<button
				class="rounded bg-white-1 text-black-9 border-black-9 border p-4 font-bold"
				on:click={scrollToRelatedArticle}
			>
				READ OUR BLOG
			</button>
		</div>
	</div>
</div>
