<script>
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { Card, Button } from 'flowbite-svelte';
	import WhatsApp from '$lib/assets/static/community/svg/whatsapp-line.svg';
	import Telegram from '$lib/assets/static/community/svg/telegram-line.svg';
	import WhatsAppIMG from '$lib/assets/static/community/community-card-whatsapp-sg.jpg';
	import TelegramIMG from '$lib/assets/static/community/community-card-telegram-sg.jpg';

	const currentPage = get(page);
	const store = currentPage.params.store;

	let communityData = {
		whatsapp: {
			img: '',
			buttonLink: ''
		},
		telegram: {
			img: '',
			buttonLink: ''
		}
	};

	if (store === 'id') {
		communityData.whatsapp.img = WhatsAppIMG;
		communityData.whatsapp.buttonLink =
			'https://chat.whatsapp.com/BxuHBalv975FqVst9hiiM1?utm_source=Website&utm_medium=Web+Community+Page&utm_campaign=Website&utm_content=LHWACommunityID';
		communityData.telegram.img = TelegramIMG;
		communityData.telegram.buttonLink = 'https://t.me/+vtWX0FpbVGY0N2Rl';
	} else if (store === 'sg') {
		communityData.whatsapp.img = WhatsAppIMG;
		communityData.whatsapp.buttonLink = 'https://bit.ly/LHWAcomm_SG';
		communityData.telegram.img = TelegramIMG;
		communityData.telegram.buttonLink = 'https://bit.ly/WebCommunityPageSG';
	}
</script>

<div class="container max-w-[1600px]">
	<div class="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
		<Card class="w-full md:max-w-[40%] border-none shadow-none">
			<img
				src={communityData.whatsapp.img}
				class="w-full h-80 object-cover rounded-t"
				alt="WhatsApp Community"
			/>
			<div class="bg-[#24252b] text-[#FFFFFF] px-4 py-4 rounded-b">
				<h5 class="mb-2 text-xl font-semibold">WhatsApp Community</h5>
				<p class="text-xs text-[#C7CBD7]">
					Stay updated with exclusive news and offers. Connect with us on WhatsApp!
				</p>
				<a href={communityData.whatsapp.buttonLink} target="_blank">
					<Button class="bg-[#FFFFFF] text-[#24252b] font-semibold mt-8 gap-2">
						<img src={WhatsApp} alt="Telegram" />
						JOIN NOW</Button
					>
				</a>
			</div>
		</Card>

		<Card class="w-full md:max-w-[40%] border-none shadow-none">
			<img
				src={communityData.telegram.img}
				class="w-full h-80 object-cover rounded-t"
				alt="Telegram Community"
			/>
			<div class="bg-[#24252b] text-[#FFFFFF] px-4 py-4 rounded-b">
				<h5 class="mb-2 text-xl font-semibold">Telegram Community</h5>
				<p class="text-xs text-[#C7CBD7]">
					Get info on special deals and the latest trends. Join our Telegram community today!
				</p>
				<a href={communityData.telegram.buttonLink} target="_blank">
					<Button class="bg-[#FFFFFF] text-[#24252b] font-semibold mt-8 gap-2">
						<img src={Telegram} alt="Telegram" />
						JOIN NOW</Button
					>
				</a>
			</div>
		</Card>
	</div>
</div>
