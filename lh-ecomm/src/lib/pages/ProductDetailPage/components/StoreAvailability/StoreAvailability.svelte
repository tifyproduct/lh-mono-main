<script lang="ts">
	import { get } from 'svelte/store';
	import { page } from '$app/stores';

	import {
		ArrowDropRightLineArrows,
		ArrowRightLineArrows,
		InformationLineSystem,
		Store2LineBuildings,
		WhatsappLineLogos,
		MapPin2LineMap
	} from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Modal from '$lib/components/Modal/Modal.svelte';

	import { LANG, STORE } from '$lib/constants.util';

	import type { ProductData, StoreAvailability } from '$lib/types/product';
	import { chatWhatsappRedirect } from '$lib/utils/whatsappRedirect';
	import googleMapsRedirect from '$lib/utils/googleMapsRedirect';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	import customerProfileStore from '$lib/stores/customerProfileStore';

	export let storeAvailability: Array<StoreAvailability> = [];
	export let productId: string;
	export let selectedProductDetailData: ProductData;

	const currentPage = get(page);

	const country = currentPage.params.store || STORE.id;
	const lang = currentPage.params.lang || LANG.id;

	const onClickWhatsapp = () => {
		chatWhatsappRedirect(country, '');

		googleAnalClickedEvent('click_contact_us', {
			locale: lang,
			product: {
				name: selectedProductDetailData.title,
				id: productId,
				variantId: selectedProductDetailData.id
			},
			customer: {
				email: $customerProfileStore?.email
			}
		});
	};

	const onClickMaps = (city: string) => {
		googleMapsRedirect(city);

		googleAnalClickedEvent('click_view_on_maps', {
			locale: lang,
			product: {
				name: selectedProductDetailData.title,
				id: productId,
				variantId: selectedProductDetailData.id
			}
		});
	};

	let isModalOpen = false;

	const onClickOpenModal = () => {
		isModalOpen = true;

		googleAnalClickedEvent('click_view_locations', {
			locale: lang,
			product: {
				name: selectedProductDetailData.title,
				id: productId,
				variantId: selectedProductDetailData.id
			}
		});
	};
</script>

<div>
	<Text type="subtitle-3" color="black-10" weight="semibold">Stock Availability</Text>

	<div
		class="flex items-center justify-between mt-4 border border-black-2 px-4 py-[14px] lg:py-[20px] rounded"
	>
		<div class="flex items-center gap-2">
			<Store2LineBuildings />
			<Text type="body-1" color="black-10" weight="medium">
				Available at {storeAvailability.length}
				{storeAvailability.length > 1 ? 'stores' : 'store'}
			</Text>
		</div>
		<div>
			<Button variant="link" class="p-0" onClick={onClickOpenModal}>
				<Text type="body-1" color="beige-10" weight="semibold">VIEW LOCATIONS</Text>
				<ArrowDropRightLineArrows />
			</Button>
		</div>
	</div>

	<div>
		<Modal title="Stock Availability" isOpen={isModalOpen} onClose={() => (isModalOpen = false)}>
			<div class="bg-beige-1 p-4 flex items-center md:items-start gap-2 rounded">
				<div>
					<InformationLineSystem size={22} />
				</div>
				<div>
					<Text type="body-1" color="dark-brown-10" weight="semibold">
						Not Available in your area?
					</Text>
					<div>
						<Text type="body-2" color="dark-brown-10">
							We'll arrange a viewing at your local boutique.
						</Text>
					</div>
					<div class="mt-0 md:mt-2">
						<Button variant="link" class="p-0" onClick={onClickWhatsapp}>
							<Text
								type="body-2"
								color="beige-10"
								weight="semibold"
								class="flex items-center gap-1"
							>
								Contact Us <ArrowRightLineArrows size={20} />
							</Text>
						</Button>
					</div>
				</div>
			</div>

			{#each storeAvailability as store}
				<div class={`bg-white-2 p-3 mt-4 rounded`}>
					<Text type="body-2" color="black-9" weight="semibold">
						{store.name} Boutique
					</Text>
					<div class="mt-3">
						<Text type="body-2" color="black-10">
							{store.location.address1}
						</Text>
					</div>
					<div>
						<Text type="body-2" color="black-10">
							{store.location.address2}
						</Text>
					</div>
					<div class="mt-3">
						<Button
							variant="primary"
							class="w-full flex items-center gap-2"
							onClick={onClickWhatsapp}
						>
							CHAT ON WHATSAPP
							<WhatsappLineLogos size={20} />
						</Button>
					</div>
					<div class="mt-3">
						<Button
							variant="secondary"
							class="w-full flex items-center gap-2"
							onClick={() => onClickMaps(store.location.city)}
						>
							VIEW ON MAP
							<MapPin2LineMap size={20} />
						</Button>
					</div>
				</div>
			{/each}
		</Modal>
	</div>
</div>
