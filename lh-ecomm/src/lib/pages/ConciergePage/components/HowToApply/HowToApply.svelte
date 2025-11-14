<script>
	import Text from '$lib/components/Text/Text.svelte';
	import {
		NewspaperLineDocument,
		ChatSmileLineCommunication,
		EmotionHappyLineUserFaces
	} from 'svelte-remix';

	const steps = [
		{
			icon: NewspaperLineDocument,
			title: '1. Contact Us',
			description:
				"Share as many details as possible about the piece you're looking for. You can reach us via our WhatsApp"
		},
		{
			icon: ChatSmileLineCommunication,
			title: '2. Acknowledgement',
			description:
				"We will acknowledge your request within 24 hours and we'll update you on the piece's price. availability, and lead time"
		},
		{
			icon: EmotionHappyLineUserFaces,
			title: '3. Sit Back and Relax',
			description:
				"Once you're happy to proceed, one of our dedicated team members will be on the hunt for your dream piece!"
		}
	];
</script>

<div class="container max-w-[1600px]">
	<div class="bg-black-2 grid text-center md:p-20 p-8">
		<Text type="title-2" color="black-9" weight="semibold">How to Apply</Text>
		<Text type="body-1" color="black-5" class="mt-2">
			You can apply to our Concierge Service with three simple steps
		</Text>

		<div class="flex flex-col md:flex-row justify-center mt-6 space-y-8 md:space-y-0">
			{#each steps as step}
				<div class="bg-white-1 grid p-4 text-left max-w-xs mx-auto rounded">
					<svelte:component this={step.icon} />
					<Text type="body-1" weight="semibold" class="mt-4">{step.title}</Text>
					<Text type="caption-1" color="black-5" class="mt-2">{step.description}</Text>
				</div>
			{/each}
		</div>
	</div>
</div>
