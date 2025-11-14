<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { WhatsappLineLogos } from 'svelte-remix';
</script>

<div class="container max-w-[1600px] p-4 md:p-20">
	<div class="flex flex-col md:flex-row gap-4 items-center">
		<div class="w-full md:w-auto md:order-2">
			<img
				src="https://id.luxehouze.com/cdn/shop/files/SBY_Collection_Page_Banner_mobile_430x210_x2_e108df68-bfac-4e6f-b97d-ecbdd378cfbd.jpg?v=1720779291"
				alt="Surabaya Collection Banner"
				class="object-cover w-full h-auto"
			/>
		</div>

		<div class="grid md:max-w-lg md:order-1">
			<Text type="subtitle-1" weight="semibold">SURABAYA EXCLUSIVE DEAL</Text>
			<Text type="body-1" color="black-5" class="mt-4">
				Calling all Luxehouzers in Surabaya! Get an additional discount of up to IDR 15 million on
				all watches if you make a purchase at Luxehouze Boutique Surabaya.
			</Text>
			<Button
				href="https://api.whatsapp.com/send/?phone=6287888880803&text=Hi+Luxehouze%21+I%27ve+checked+your+website+and+I+would+like+to+know+more+about+Surabaya+collection&type=phone_number&app_absent=0"
				variant="primary"
				class="mt-4 max-w-96 p-4 gap-2"
			>
				<WhatsappLineLogos />
				ASK ABOUT OUR SURABAYA COLLECTION
			</Button>
		</div>
	</div>
</div>
