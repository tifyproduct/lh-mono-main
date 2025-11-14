<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	import PromotionCard from '$lib/components/PromotionCard/PromotionCard.svelte';
	import type { Promotion } from '$lib/types/promotions';
	import PromotionListPopup from '$lib/components/PromotionListPopup/PromotionListPopup.svelte';

	export let promotions: Promotion[] = [];

	let isShowPromotionModal: boolean = false;
	let selectedViewPromo: number = 0;

	const togglePromotionModal = () => {
		isShowPromotionModal = !isShowPromotionModal;
	};

	const handleOnViewPromo = (e: CustomEvent) => {
		togglePromotionModal();
	};
</script>

<div>
	<div class="flex items-center justify-between">
		<Text type="subtitle-3" color="black-10" weight="semibold">Available Promotions</Text>

		<div class="hidden lg:block">
			<Button variant="link" class="p-0" onClick={togglePromotionModal}>
				<Text type="body-1" color="beige-10" weight="semibold">VIEW ALL</Text>
			</Button>
		</div>
	</div>

	<div class="mt-6 flex gap-3 overflow-y-scroll xl:max-w-[750px]">
		{#each promotions as promotion, index (promotion.code)}
			<PromotionCard
				label={promotion.title}
				expDate={promotion.endsAt}
				url=""
				on:view-promo={handleOnViewPromo}
				{index}
			/>
		{/each}
	</div>

	<div class="mt-3 block lg:hidden">
		<Button variant="secondary" class="w-full" onClick={togglePromotionModal}>
			<Text type="body-2" color="dark-brown-10" weight="semibold">VIEW ALL</Text>
		</Button>
	</div>
</div>

<PromotionListPopup
	showApplyVoucher={false}
	promotionList={promotions}
	isOpen={isShowPromotionModal}
	on:close-modal={togglePromotionModal}
	preSelectedIndex={selectedViewPromo}
/>
