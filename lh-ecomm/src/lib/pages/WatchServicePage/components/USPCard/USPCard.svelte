<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Svg1 from '$lib/assets/static/watch-service/svg/customer-service-2-line.svg';
	import Svg2 from '$lib/assets/static/watch-service/svg/money-dollar-box-line.svg';
	import Svg3 from '$lib/assets/static/watch-service/svg/settings-5-line.svg';
	import Svg4 from '$lib/assets/static/watch-service/svg/hand-coin-line.svg';
	import { WhatsappFillLogos } from 'svelte-remix';

	let USPcards = [
		{
			id: 1,
			title: '1. Get a personalized consultation',
			description:
				"Contact us to receive an initial estimate. We'll assess your watch and provide a detailed cost estimate for the required services.",
			imgSrc: Svg1
		},
		{
			id: 2,
			title: '2. Make a down payment',
			description:
				'To proceed with the service, a 50% deposit is required. The deposit covers initial service costs.',
			imgSrc: Svg2
		},
		{
			id: 3,
			title: '3. Wait for the service proccess',
			description:
				'Sit back and relax as your watch undergoes a meticulous service process performed by our experts and is restored to its optimal condition.',
			imgSrc: Svg3
		},
		{
			id: 4,
			title: '4. Pick up and complete your payment',
			description:
				'Once your watch is ready, visit us to collect it and pay the remaining balance.',
			imgSrc: Svg4
		}
	];
</script>

<div class="bg-brown-05 container max-w-[1600px]">
	<Text
		type="subtitle-1"
		weight="semibold"
		class="mx-auto block text-center text-xl md:text-3xl pb-4 pt-8"
	>
		Entrust your timepiece to our expert care.
	</Text>

	<div class="overflow-x-auto flex gap-8 pb-8">
		{#each USPcards as card}
			<div class="bg-[#FFFFFF] flex-shrink-0 bg-white rounded-lg p-6 w-80 snap-center ml-4">
				<img src={card.imgSrc} alt={card.title} class="w-8 h-8 object-cover" />
				<h2 class="font-bold text-lg mt-4">{card.title}</h2>
				<p class="text-gray-600">{card.description}</p>
			</div>
		{/each}
	</div>

	<div class="flex justify-center pb-4 mt-4">
		<Button
			variant="primary"
			class="gap-2"
			href="https://api.whatsapp.com/send/?phone=6287778115835&text=Hi+Luxehouze+Care%2C+I+have+checked+your+website+and+I%E2%80%99d+like+to+find+out+more+about+your+watch+service&type=phone_number&app_absent=0"
			><WhatsappFillLogos /> START YOUR SERVICE JOURNEY</Button
		>
	</div>
</div>
