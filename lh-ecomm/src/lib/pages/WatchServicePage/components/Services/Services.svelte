<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { WhatsappLineLogos } from 'svelte-remix';
	const imageSrc = [
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Overhaul.gif?v=1727340674',
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Inspection.gif?v=1727339286',
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Polishing.gif?v=1727340799',
		'https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Quick_service_-_battery_replacement.gif?v=1730442751'
	];

	const texts = [
		{
			topText: 'Inspection',
			description: 'Thorough check-up to ensure optimal watch performance.',
			bottomText: '30 mins - 1 hour'
		},
		{
			topText: 'Overhaul',
			description: 'Complete disassembly, cleaning, and precision reassembly.',
			bottomText: '3-7 Weeks*'
		},
		{
			topText: 'Polishing',
			description: 'Restore exterior shine by removing scratches and blemishes.',
			bottomText: '1-2 Weeks'
		},
		{
			topText: 'Quick Service',
			description: 'Efficient fixes for common issues without full disassembly.',
			bottomText: '30 mins - 1 hour'
		}
	];
</script>

<div class="container max-w-[1600px]">
	<Text
		type="subtitle-1"
		weight="semibold"
		class="mx-auto block text-center text-xl md:text-3xl pb-4 pt-8"
	>
		The Expert Care Your Timepiece Deserves
	</Text>

	<Text
		type="body-1"
		class="mx-auto block text-center md:text-base max-w-3xl font-bold pb-4 text-gray-500"
	>
		We blend cutting-edge tech and expertise to restore your watch. Our comprehensive services cover
		everything from inspection to repairs, ensuring pristine condition.
	</Text>

	<div class="md:flex grid mx-auto justify-center gap-4 mt-6 mb-12">
		<Button
			variant="primary"
			class="gap-2 p-4 min-w-60"
			href="https://wa.me/6287778115835?text=Hi%20Luxehouze%20Care,%20I%20have%20checked%20your%20website%20and%20I’d%20like%20to%20find%20out%20more%20about%20your%20watch%20service"
			><WhatsappLineLogos /> HOW CAN WE HELP YOU?</Button
		>
		<a
			href="https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Luxehouze_ID_Watch_Service_and_Polishing_Catalog_WIP_compressed.pdf?v=1728354037"
			target="_blank"
			rel="noopener noreferrer"
		>
			<Button variant="secondary" class="gap-2 p-4 min-w-60">SEE FULL PRICE LIST</Button>
		</a>
	</div>

	<div class="grid grid-cols-2 gap-4 md:grid-cols-4 justify-items-center mt-8 px-4">
		{#each imageSrc as image, index}
			<div class="relative w-full box-border">
				<img
					src={image}
					alt={['Overhaul', 'Inspection', 'Polishing', 'Quick Service'][index]}
					class="w-full h-auto rounded"
				/>
				<div class="absolute top-0 bg-black md:p-4 rounded-md grid p-2">
					<Text type="subtitle-2" color="white-1" weight="semibold">
						{texts[index].topText}
					</Text>
					<Text type="body-1" color="white-1" weight="regular">
						{texts[index].description}
					</Text>
				</div>
				<div
					class="absolute bottom-2 text-white gap-1 font-bold text-lg md:p-4 rounded-md grid md:flex p-2"
				>
					<Text type="body-2" color="white-1" weight="semibold">Turnaround Time:</Text>
					<Text type="body-2" color="white-1">
						{texts[index].bottomText}
					</Text>
				</div>
			</div>
		{/each}
	</div>
</div>
