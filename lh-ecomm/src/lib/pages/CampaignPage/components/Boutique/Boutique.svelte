<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { WhatsappFillLogos } from 'svelte-remix';
	import { page } from '$app/stores';

	let store;
	$: store = $page.params.store;

	let whatsappLink =
		'https://api.whatsapp.com/send/?phone=6287888880803&text=Hi+Luxehouze%21+I+would+like+to+visit+Luxehouze+store&type=phone_number&app_absent=0';

	$: if (store === 'id') {
		whatsappLink =
			'https://api.whatsapp.com/send/?phone=6287888880803&text=Hi+Luxehouze%21+I+would+like+to+visit+the+Jakarta+store&type=phone_number&app_absent=0';
	} else if (store === 'sg') {
		whatsappLink =
			'https://api.whatsapp.com/send/?phone=6598625974&text=Hi+Luxehouze%21+I+would+like+to+visit+the+Surabaya+store&type=phone_number&app_absent=0';
	}
</script>

<div class="container max-w-[1600px] md:p-10">
	<div class="flex md:flex-row flex-col bg-black-2 p-6 gap-7 items-center rounded">
		<div
			class="relative max-w-sm min-w-[350px] md:min-w-[414px] min-h-[480px] rounded overflow-hidden bg-cover bg-center"
			style="background-image: url('https://cdn.shopify.com/s/files/1/0566/7982/5558/files/Indonesia_Boutique_Store.png?v=1684386714');"
		>
			<div class="absolute bottom-5 grid left-2">
				<Text type="subtitle-3" color="white-1" weight="semibold">Jakarta Boutique</Text>
				<Text type="subtitle-3" color="white-1" weight="semibold">
					District 8, Jakarta, Indonesia
				</Text>
			</div>
		</div>

		<div
			class="relative max-w-sm min-w-[350px] md:min-w-[414px] min-h-[480px] rounded overflow-hidden bg-cover bg-center"
			style="background-image: url('https://cdn.shopify.com/s/files/1/0566/7982/5558/files/WhatsApp_Image_2024-05-31_at_13.50.52_d5a2a26c.jpg?v=1717138392');"
		>
			<div class="absolute bottom-5 grid left-2">
				<Text type="subtitle-3" color="white-1" weight="semibold">Surabaya Boutique</Text>
				<Text type="subtitle-3" color="white-1" weight="semibold">
					Pakuwon Trade Center, Surabaya
				</Text>
			</div>
		</div>

		<div class="grid text-center md:text-left">
			<div class="max-w-sm">
				<Text type="subtitle-1" color="black-10" weight="semibold">
					Want to See The Products in Person?
				</Text>
			</div>
			<div class="max-w-sm mt-3">
				<Text type="body-1" color="black-6">
					Book an appointment to visit your desired boutique store.
				</Text>
			</div>
			<Button href={whatsappLink} variant="primary" class="max-w-60 mt-3 gap-1 md:mx-0 mx-auto">
				BOOK NOW
				<WhatsappFillLogos />
			</Button>
		</div>
	</div>
</div>
