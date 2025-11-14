<script>
	import Check from '$lib/assets/static/authenticity/svg/check.svg';
	import Glass from '$lib/assets/static/authenticity/svg/glass.svg';
	import Tools from '$lib/assets/static/authenticity/svg/tools.svg';
	import Luxe360 from '$lib/assets/static/authenticity/360.webp';

	const inspectionItems = [
		{
			img: Check,
			title: 'Complete Set Verification',
			text: 'We ensure not only the watch itself but also its completeness (e.g: box, papers, are included and aligned with the standards of authenticity.'
		},
		{
			img: Glass,
			title: 'Serial Numbers Inspection',
			text: "We ensure the serial and model numbers match in all documents and across the watch's components, and confirm them through the brand's database."
		},
		{
			img: Tools,
			title: 'Functionality Assessment',
			text: "We assess the watch's movement performance, timing accuracy, and aesthetic condition to identify any signs of wear or damage."
		}
	];
</script>

<div class="container max-w-[1600px]">
	<div class="bg-[#24252B] text-center p-8">
		<h1 class="text-xl text-[#FFFFFF] font-bold">LUXEHOUZE 360° INSPECTION</h1>
		<p class="text-[#FFFFFF] text-sm font-light max-w-2xl mt-2 mx-auto">
			We guarantee the quality and authenticity of every luxury watch we sell through an
			all-encompassing, meticulous examination process involving careful examination of its
			components and functionality, as well as verification of any relevant documentation.
		</p>
		<div class="flex flex-col-reverse md:flex-row mt-16">
			<div class="w-full md:w-1/2 flex flex-col items-center md:items-center">
				<img src={Luxe360} class="w-full md:hidden mb-4" alt="Luxe360 Image" />
				{#each inspectionItems as { img, title, text }}
					<div class="text-left max-w-sm mb-4 md:mb-20 mt-8 md:mt-0 flex items-start">
						<img src={img} class="mr-4" alt={title} />
						<div>
							<h2 class="text-[#FFFFFF] text-md md:text-xl font-bold mt-2">{title}</h2>
							<p class="text-[#858895] text-sm mt-1">{text}</p>
						</div>
					</div>
				{/each}
			</div>
			<div class="w-full md:w-1/2 flex items-center justify-center">
				<img src={Luxe360} class="hidden md:block w-full" alt="Luxe360 Image" />
			</div>
		</div>
	</div>
</div>
