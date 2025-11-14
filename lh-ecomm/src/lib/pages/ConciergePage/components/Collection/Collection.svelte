<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { WhatsappLineLogos } from 'svelte-remix';
	import { page } from '$app/stores';

	const isIdStore = $page.params.store === 'id';

	const whatsappLink = isIdStore
		? 'https://api.whatsapp.com/send/?phone=6287888880803&text=Hi+Luxehouze%21+I%27m+interested+in+your+concierge+service&type=phone_number&app_absent=0'
		: 'https://api.whatsapp.com/send?phone=6598625974&text=I%20just%20checked%20your%20website.%20I%20have%20a%20few%20questions.%20Can%20you%20help?';
</script>

<div class="container max-w-[1600px]">
	<div class="grid bg-black-9 text-center p-8 md:p-20">
		<Text type="title-2" color="white-1" weight="semibold">Build Your Dream Collection With Us</Text
		>
		<Text type="body-2" color="white-1" class="max-w-xl mx-auto mt-4">
			Start building your dream collection today. Don't hesitate to let us know how we can help you
			find the perfect piece to add to your collection.
		</Text>
		<Button href={whatsappLink} variant="link" class="bg-white-1 max-w-xs mx-auto p-4 mt-8 gap-4">
			<WhatsappLineLogos /> PRE-ORDER VIA WHATSAPP
		</Button>
	</div>
</div>
