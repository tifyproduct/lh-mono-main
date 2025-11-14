<script lang="ts">
	import { BottomNav, BottomNavItem, Toast } from 'flowbite-svelte';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	import { Loader3LineSystem, ShoppingCart2LineFinance, QuestionFillSystem } from 'svelte-remix';
	import selectedProductStore from '$lib/stores/selectedProductStore';
	import { goto } from '$app/navigation';
	import { navigating, page } from '$app/stores';
	import { isTriggerShowCartAddedMobile } from '$lib/stores/cart';

	import { openNotifyWhenInStockModal } from '../../store/isShowNotifyWhenInStockModalStore';
	import type { CustomerProfile } from '$lib/types/customer';
	import { showAuthenticationModal, showErrorToast } from '$lib/stores/authentication';
	import AuthenticationModal from '$lib/components/AuthenticationModal/AuthenticationModal.svelte';
	import { toast } from 'svelte-sonner';
	import AuthenticationTab from '$lib/components/AuthenticationModal/AuthenticationTab.svelte';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';

	export let customer: CustomerProfile | undefined;
	export let credential;

	let showSocialModal = false;

	let isNewLoginEnabled: boolean;
	$: {
		isNewLoginEnabled = $featureFlagStore.isNewLoginEnabled;
	}

	let isLoading: boolean = false;

	$: selectedProductData = $selectedProductStore;

	let showModal = false;

	const closeModal = () => {
		showModal = false;
	};

	const closeAuthentication = () => {
		// $showAuthenticationModal = false;
		showSocialModal = false;
	};

	const closeAuthenticationSuccess = () => {
		// $showAuthenticationModal = false;
		showSocialModal = false;
		window.location.reload();
	};

	const onClickBuy = async () => {
		if (!customer?.isLoggedIn) {
			if (isNewLoginEnabled) {
				showModal = true;
			} else {
				// $showAuthenticationModal = true;
				showSocialModal = true;
			}
			return;
		}

		if (isLoading) return;

		try {
			isLoading = true;

			const request = await fetch('/api/cart', {
				method: 'POST',
				body: JSON.stringify({
					variantId: selectedProductData?.id,
					quantity: 1
				})
			});

			const cartData = await request.json();

			if (cartData?.id) {
				$isTriggerShowCartAddedMobile = false;
				await goto(`/${$page.params.store}/${$page.params.lang}/cart`, {
					invalidateAll: true
				});
			}
		} catch (error) {
			toast.error(error + '');
		} finally {
			isLoading = false;
		}
	};

	const onClickCart = async () => {
		if (!customer?.isLoggedIn) {
			if (isNewLoginEnabled) {
				showModal = true;
			} else {
				// $showAuthenticationModal = true;
				showSocialModal = true;
			}
			return;
		}

		if (isLoading) return;

		try {
			isLoading = true;

			const request = await fetch('/api/cart', {
				method: 'POST',
				body: JSON.stringify({
					variantId: selectedProductData?.id,
					quantity: 1
				})
			});

			const cartData = await request.json();

			if (cartData?.id) {
				$isTriggerShowCartAddedMobile = true;
				await goto('', {
					invalidateAll: true
				});
			}
		} catch (error) {
			toast.error(error + '');
		} finally {
			isLoading = false;
		}
	};

	const handleAuthenticationError = (event: CustomEvent) => {
		showErrorToast.set(true);
		setTimeout(() => {
			showErrorToast.set(false);
		}, 10000);
	};
</script>

{#if !selectedProductData?.title.toLowerCase().includes('freebie')}
	{#if $showErrorToast}
		<div class="p-2 bg-white-1 block lg:hidden">
			<Toast
				align={false}
				color="none"
				defaultIconClass=""
				divClass="bg-brown-05 order-3 border border-brown-10 rounded-lg p-2 flex gap-3 relative"
				dismissable={false}
			>
				<div class="absolute left-0 top-0 h-full w-1 bg-brown-10 rounded-l-lg"></div>

				<div class="flex items-start gap-2 pl-3">
					<QuestionFillSystem width={16} height={16} class="mt-1 text-black-9" />
					<div class="flex flex-col">
						<Text type="body-1" color="black-9" weight="semibold" class="">
							Can't access your account?
						</Text>
						<Text type="body-2" color="black-6">
							<a
								href="https://wa.link/9c0c2j"
								class="underline text-black-9 hover:text-black-7 font-bold"
								target="_blank"
							>
								<Text type="body-2" color="dark-brown-9" weight="semibold">Contact us</Text>
							</a>
							here to place your order manually
						</Text>
					</div>
				</div>
			</Toast>
		</div>
	{/if}
	<BottomNav
		position="sticky"
		classInner="flex z-20 bg-white max-w-none"
		classOuter="w-full z-20 border-gray-200 bg-white-1 block min-h-[64px]"
	>
		{#if selectedProductData?.outOfStock}
			<BottomNavItem btnClass="p-2 w-full">
				<Button variant="primary" class="w-10/12 h-[56px]" onClick={openNotifyWhenInStockModal}>
					<Text type="subtitle-2" color="white-1" weight="semibold">NOTIFY ME WHEN IN STOCK</Text>
				</Button>
			</BottomNavItem>
		{:else}
			<BottomNavItem btnClass="p-2 w-3/12 md:w-2/12">
				<Button variant="secondary" class="w-full h-full" onClick={onClickCart}>
					{#if $navigating || isLoading}
						<Loader3LineSystem class="animate-spin" />
					{:else}
						<ShoppingCart2LineFinance />
					{/if}
				</Button>
			</BottomNavItem>

			<BottomNavItem btnClass="p-2 w-9/12 md:w-10/12">
				<Button variant="primary" class="w-full h-full" onClick={onClickBuy}>
					{#if $navigating || isLoading}
						<Loader3LineSystem class="animate-spin" />
					{:else}
						<Text type="body-1" color="white-1" weight="semibold">BUY NOW</Text>
					{/if}
				</Button>
			</BottomNavItem>
		{/if}
	</BottomNav>
{/if}

{#if showSocialModal && !customer?.isLoggedIn}
	<AuthenticationModal
		credentialSoc={credential}
		on:close={closeAuthentication}
		on:close-success={closeAuthenticationSuccess}
		on:error={handleAuthenticationError}
	/>
{/if}

{#if showModal && !customer?.isLoggedIn}
	<AuthenticationTab bind:isModalOpen={showModal} on:closeModal={closeModal} />
{/if}
