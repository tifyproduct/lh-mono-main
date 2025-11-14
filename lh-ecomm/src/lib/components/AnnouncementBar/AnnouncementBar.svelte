<script lang="ts">
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	import { Banner, Button } from 'flowbite-svelte';

	import { TelegramLineLogos, WhatsappLineLogos, CloseLineSystem } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import { COMMUNITY_GROUP, STORE } from '$lib/constants.util';

	const currentPage = get(page);

	const country = currentPage.params.store || STORE.id;

	const getRedirect = () => {
		if (country === STORE.sg || country === STORE.beauty) {
			return COMMUNITY_GROUP.SG;
		}

		return COMMUNITY_GROUP.ID;
	};

	let showBanner: boolean = true;

	const onCloseBanner = () => {
		showBanner = false;
	};

	const onSocialClick = () => {
		window.dataLayer = window.dataLayer || [];

		window.dataLayer.push({
			event: 'click_announcement_bar',
			reference: {
				name: country === STORE.sg ? 'Telegram' : 'WhatsApp'
			}
		});
	};
</script>

<Banner
	id="announcement-bar"
	classDiv="h-[50px] bg-dark-brown-9 p-4"
	dismissable={false}
	bannerStatus={showBanner}
>
	<div
		class="flex justify-between items-center w-[calc(100vw-1rem)] sm:w-[calc(100vw-4rem)] gap-2 sm:gap:0"
	>
		<div class="order-3 sm:order-1" />

		<div class="order-2 sm:order-2 flex items-center gap-6">
			<div>
				<Text type="body-1" color="white-1" weight="semibold" class="hidden sm:block">
					Join our community to get the latest deals
				</Text>

				<Text type="caption-2" color="white-1" weight="semibold" class="block sm:hidden">
					Join our community to get the latest deals
				</Text>
			</div>
			<div>
				<Button
					tag="a"
					target="_blank"
					href={getRedirect()}
					outline
					size="xs"
					class="flex items-center gap-1 rounded p-2"
					on:click={() => onSocialClick()}
				>
					<Text type="caption-1" color="white-1" weight="semibold" class="hidden sm:block">
						JOIN US
					</Text>
					<Text type="caption-2" color="white-1" weight="semibold" class="block sm:hidden">
						JOIN US
					</Text>
					<TelegramLineLogos class="text-white-1 w-[12px] h-[12px] sm:w-[20px] sm:h-[20px]" />
				</Button>
			</div>
		</div>

		<div class="order-1 sm:order-3 cursor-pointer">
			<CloseLineSystem
				on:click={onCloseBanner}
				class="text-white-1 w-[16px] h-[16px] sm:w-[24px] sm:h-[24px]"
			/>
		</div>
	</div>
</Banner>
