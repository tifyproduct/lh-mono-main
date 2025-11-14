<script>
	import Watch from '$lib/assets/static/authenticity/watch.png';
	import Clock from '$lib/assets/static/authenticity/clock.png';
	import Certificate from '$lib/assets/static/authenticity/certificate.png';

	const items = [
		{ src: Watch, text: 'Authentication Experts' },
		{ src: Clock, text: '360° Inspection Process' },
		{ src: Certificate, text: 'Money-Back Guarantee' }
	];
</script>

<div class="container max-w-[1600px]">
	<div class="flex bg-[#17181A] gap-8 justify-center p-6 md:p-16 overflow-hidden">
		{#each items as { src, text }}
			<div class="grid md:flex items-center gap-4 text-center">
				<img {src} alt="" class="w-12 h-12 mx-auto" />
				<p class="text-[#FFFFFF] text-xs md:text-base">{text}</p>
			</div>
		{/each}
	</div>
</div>
