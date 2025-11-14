<script>
	import Text from '$lib/components/Text/Text.svelte';
	import { WhatsappFillLogos, ChatSmile2FillCommunication } from 'svelte-remix';

	const channels = {
		whatsapp: [
			{ country: 'Indonesia', number: '+62 878 8888 0803' },
			{ country: 'Singapore', number: '+65 9862 5974' }
		],
		consignment: [{ country: 'Indonesia & Singapore', number: '+62 877 7680 7475' }],
		socialMedia: [
			{ platform: 'Instagram', handle: '@luxehouze & @luxehouze.beauty' },
			{ platform: 'Facebook', handle: '@luxehouze' },
			{ platform: 'YouTube', handle: '@luxehouze' }
		]
	};
</script>

<div class="bg-black-1 max-w-lg rounded p-4 mt-8 mb-8">
	<Text type="subtitle-3" weight="semibold">**Our Official Channels</Text>
	<div class="flex gap-2 items-center mt-4">
		<WhatsappFillLogos />
		<Text type="body-1" color="black-9" weight="semibold">Official WhatsApp</Text>
	</div>
	<Text type="caption-1">
		All of our WhatsApp numbers have a verified badge (except for Sell / Consign):
	</Text>
	<Text type="body-1" weight="semibold">For Purchasing</Text>
	<div class="grid">
		{#each channels.whatsapp as { country, number }}
			<Text type="body-2" weight="regular">{country}: {number}</Text>
		{/each}
	</div>

	<Text type="body-1" weight="semibold">For Selling/Consignment/Trade-in</Text>
	<div class="grid">
		{#each channels.consignment as { country, number }}
			<Text type="body-2" weight="regular">{country}: {number}</Text>
		{/each}
	</div>

	<div class="flex gap-2 items-center mt-8">
		<ChatSmile2FillCommunication />
		<Text type="body-1" color="black-9" weight="semibold">Social Media Accounts</Text>
	</div>
	<Text type="caption-1">Our official social media accounts are as follows:</Text>
	<div class="grid">
		{#each channels.socialMedia as { platform, handle }}
			<Text type="body-1" weight="regular"><b>{platform}:</b> {handle}</Text>
		{/each}
	</div>

	<div class="grid mt-8">
		<Text type="caption-1" weight="regular">
			Luxehouze holds no responsibility for any fraud or scam conducted under our name. If you come
			across any dubious activity associated with Luxehouze, please inform us immediately.
		</Text>
	</div>
</div>
