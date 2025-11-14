<script>
	import Text from '$lib/components/Text/Text.svelte';
	import BannerImage from '$lib/assets/static/authenticity/bannerimage.webp';
	import { page } from '$app/stores';

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const WatchesUrl = `${baseParams}/watch`;
</script>

<div class="container max-w-[1600px]">
	<div class="relative w-full h-[400px] md:h-[500px]">
		<img src={BannerImage} alt="Authenticity Banner" class="w-full h-full object-cover" />
		<div
			class="absolute inset-0 flex flex-col items-start justify-center text-left p-8 bg-black bg-opacity-50"
		>
			<Text color="white-1" type="title-3" weight="semibold">Shop with Confidence</Text>
			<Text color="white-1" type="body-1" class="max-w-lg mt-4" weight="regular"
				>Your peace of mind is our top priority. Every timepiece we sell is authenticated through a
				comprehensive 360-degree inspection process done by our Authentication Experts. If you find
				your item to be inauthentic despite our rigorous process, we stand by our promise to refund
				you the full purchase price.</Text
			>

			<a href={WatchesUrl}>
				<button
					class="rounded text-black-10 bg-white-1 px-6 py-3 mt-8 border border-black-9 font-bold"
				>
					BROWSE OUR WATCHES
				</button>
			</a>
		</div>
	</div>
</div>
