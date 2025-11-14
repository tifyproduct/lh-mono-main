<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Disclaimer from '$lib/pages/PaymentMethodPage/components/Disclaimer/Disclaimer.svelte';
	import OfficialChannel from '$lib/pages/PaymentMethodPage/components/OfficialChannel/OfficialChannel.svelte';

	const paymentMethods = [
		{
			title: '1. IDR Bank Transfer to Luxehouze BNI',
			fee: 'No extra fee',
			limit: [
				"- Mobile banking/internet banking: Per respective of the client's bank account limit",
				'- Teller at the bank: No limit'
			],
			requirements: [
				'- Online: Real time 24/7. Maximum limit IDR50,000,000/transaction',
				'- RTGS: Cut off time at 2 pm Jakarta time on the working days, it takes about 30 minutes. After 2 pm Jakarta time, we will process on the next working days',
				'- BI Fast: Not available',
				'- LLG: Not available'
			],
			notes:
				'For the bank account details, please check with our client advisor or contact our WhatsApp'
		},
		{
			title: '2. Payment for Collection of Goods over the Weekend',
			fee: 'No extra fee',
			limit: ["- Mobile banking/internet banking: Per respective client's bank account limit"],
			notes:
				'For the bank account details, please check with our client advisor or contact our WhatsApp'
		},
		{
			title: '3. Credit Card',
			subtitle: '3.1 Full Payment',
			fee: 'Additional fee applies*',
			options: 'Local Indonesia issued card: Visa, Mastercard, JCB, American Express',
			limit: ["- Per respective client's card limit for full amount being charged"],
			notes:
				'For the bank account details, please check with our client advisor or contact our WhatsApp'
		}
	];
</script>

<div class="container max-w-[1600px] md:p-20 p-4">
	<Text type="subtitle-1" color="black-9" weight="semibold">
		Available Payment Method At Luxehouze
	</Text>

	<Disclaimer />

	<div class="grid">
		<Text type="body-2">
			Luxehouze provides several payment methods that you can choose based on your preference, as
			below:
		</Text>

		{#each paymentMethods as method}
			<div class="mt-8 grid">
				<Text type="body-2" weight="semibold">{method.title}</Text>

				{#if method.subtitle}
					<Text type="body-2" weight="semibold">{method.subtitle}</Text>
				{/if}

				{#if method.options}
					<Text type="body-2" weight="regular">{method.options}</Text>
				{/if}

				<Text type="body-2"><b>Fee:</b> {method.fee}</Text>

				{#if method.limit}
					<Text type="body-2" weight="semibold">Limit:</Text>
					{#each method.limit as limit}
						<Text type="body-2">{limit}</Text>
					{/each}
				{/if}

				{#if method.requirements}
					<Text type="body-2" weight="semibold">Requirement:</Text>
					{#each method.requirements as requirement}
						<Text type="body-2">{requirement}</Text>
					{/each}
				{/if}

				<Text type="body-2"><b>Notes:</b> {method.notes}</Text>
			</div>
		{/each}

		<div class="mt-8">
			<Text type="body-1">*Check with our client advisor or contact our <b>WhatsApp</b></Text>
		</div>
	</div>

	<OfficialChannel />
</div>
