<script>
	import Inspection1 from '$lib/assets/static/inspection-list/inspection1.svg';
	import Inspection2 from '$lib/assets/static/inspection-list/inspection2.svg';
	import Inspection3 from '$lib/assets/static/inspection-list/inspection3.svg';
	import Inspection4 from '$lib/assets/static/inspection-list/inspection4.svg';
	import Inspection5 from '$lib/assets/static/inspection-list/inspection5.svg';
	import Inspection6 from '$lib/assets/static/inspection-list/inspection6.svg';
	import Inspection7 from '$lib/assets/static/inspection-list/inspection7.svg';
	import { page } from '$app/stores';

	let sections = [
		{
			id: 1,
			title: 'Documentation / Papers',
			description:
				"Documentations and other papers such as certificate can determine the watch's collection and its guarantee. Serial numbers within the documentation(s) should also match the watch and in the right format.",
			inspections: ['Originality', 'Matching Serial Number with Watch', 'Serial Number Format'],
			imgSrc: Inspection1
		},
		{
			id: 2,
			title: 'Glass / Crystal',
			description:
				"For watches which have gemstones, our team will usually test out its quality using stone testing. We'll also look out for any fading, damage or wear on glass surfaces on the watch.",
			inspections: [
				'Quality',
				'Scratches',
				'Fading, Damage, Wear',
				"Gemstones' Origins (if applicable)",
				'Dimension'
			],
			imgSrc: Inspection2
		},
		{
			id: 3,
			title: 'Dial, Hands and Lume',
			description:
				'Our team meticulously inspects every watches down to its minutes detail: from date window, to something as small as the detailed engravings on the watch dial.',
			inspections: [
				'Functionality',
				'Engravings',
				'Index / Diamonds',
				'Date',
				'Date Window',
				'Wording',
				'Fitting and Alignment',
				'Lume Brightness',
				"Hands' Consistency"
			],
			imgSrc: Inspection3
		},
		{
			id: 4,
			title: 'Crown',
			description:
				"The operation of the watch's crown can determine the quality of its build. Authentic watches' crown operation should work properly",
			inspections: ['Operation', 'Threading', 'Winding'],
			imgSrc: Inspection4
		},
		{
			id: 5,
			title: 'Back Case',
			description:
				'The most meticulously crafted part of the watch. Back case can give us a glimpse into its build quality as well as several hallmarks and engravings which can determined its authenticity',
			inspections: [
				'Markings & Engravings',
				'Screws',
				'Hallmarks',
				'Fading, Damage, Wear, Scratches'
			],
			imgSrc: Inspection5
		},
		{
			id: 6,
			title: 'Bracelet & Clasp',
			description:
				"A watch's bracelet function and mechanism can tell its build quality. Our team also checks down to its distinctive marks and engravings",
			inspections: [
				'Markings and Engravings',
				'Clasp Hook',
				'Number of Links (if applicable)',
				'Hallmarks',
				'Fading, Damage, Wear, Scratches'
			],
			imgSrc: Inspection6
		},
		{
			id: 7,
			title: 'Mechanism & Other Functions',
			description:
				'Some watch brands have unique functionality that are hard to replicate in inauthentic reproductions. Our team also check for the timing and movement of the watch.',
			inspections: ['Timing', 'Date', 'Caliber', 'Functionality'],
			imgSrc: Inspection7
		}
	];

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const AuthenticityUrl = `${baseParams}/authenticity`;
</script>

<div class="text-center p-20">
	<h1 class="text-4xl font-bold">LUXEHOUZE 360° INSPECTION LIST</h1>
	<p class="text-sm text-[#666975] max-w-2xl mx-auto mt-4">
		Our meticulous authentication process involves checking multiple points throughout the
		timepiece, leaving no detail unnoticed. From the precision of the movement to the quality of
		materials used.
	</p>
	<a href={AuthenticityUrl}>
		<button class="bg-[#24252B] text-[#FFFFFF] text-xs font-bold px-6 py-4 mt-8"
			>MORE ABOUT AUTHENTICITY</button
		>
	</a>

	{#each sections as section}
		<div class="flex flex-col lg:flex-row mt-20">
			<!-- Text Section -->
			<div class="w-full lg:w-[40%] flex gap-2 text-left items-start">
				<p
					class="border border-black bg-[#24252B] text-[#FFFFFF] rounded-full w-10 h-10 flex items-center justify-center shrink-0"
				>
					{section.id}
				</p>
				<div>
					<h1 class="text-3xl font-bold">{section.title}</h1>
					<p class="text-xs font-light text-[#666975] max-w-md mt-2">
						{section.description}
					</p>
					<hr class="border-t-2 border-black-300 mt-4 w-[100%]" />
					<div class="flex gap-8 mt-4">
						<div>
							<p class="text-xs">What We Inspect</p>
						</div>
						<div>
							{#each section.inspections as item}
								<p class="text-xs font-light text-[#666975] mb-2">{item}</p>
							{/each}
						</div>
					</div>
				</div>
			</div>

			<!-- Image Section -->
			<hr class="border-t-2 border-black-300 mt-4" />
			<div class="w-full lg:w-[50%] flex justify-end mt-4 lg:mt-0">
				<img src={section.imgSrc} alt="" class="object-contain" />
			</div>
		</div>
	{/each}
</div>
