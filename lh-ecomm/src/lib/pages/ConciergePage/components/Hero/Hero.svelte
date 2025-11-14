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

<div
	style="background-image: url('https://id.luxehouze.com/cdn/shop/files/concierge_banner_1920x.jpg?v=1683848342'); 
         background-size: cover; 
         background-position: center; 
         background-repeat: no-repeat;"
	class="text-center grid p-8 md:p-20 container max-w-[1600px]"
>
	<Text type="title-2" color="white-1" class="max-w-2xl mx-auto" weight="semibold">
		One Click Away From Getting Your Dream Item
	</Text>
	<Text type="body-2" color="white-1" class="max-w-2xl mx-auto mt-4" weight="regular">
		Own the piece of your dreams with Luxehouze's Concierge Service - you'll even be able to skip
		the line with our Pre-Order Service! Tell us the item of your dreams and we'll ensure it makes
		its way to you.
	</Text>
	<Button href={whatsappLink} variant="link" class="bg-white-1 max-w-xs gap-2 mx-auto mt-8 p-4">
		<WhatsappLineLogos /> PRE-ORDER VIA WHATSAPP
	</Button>
</div>
