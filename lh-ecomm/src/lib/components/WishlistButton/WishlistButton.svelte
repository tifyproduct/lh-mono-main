<script lang="ts">
	import { HeartFillHealthMedical, HeartLineHealthMedical } from 'svelte-remix';
	import { toast } from 'svelte-sonner';
	import customerProfileStore from '$lib/stores/customerProfileStore';
	import Button from '../Button/Button.svelte';
	import { showAuthenticationModal } from '$lib/stores/authentication';
	import AuthenticationTab from '../AuthenticationModal/AuthenticationTab.svelte';
	import { featureFlagStore } from '$lib/stores/featureFlag.js';

	export let isWishlisted = false;
	export let productId: string;
	export let size = 20;

	let isNewLoginEnabled: boolean;
	$: {
		isNewLoginEnabled = $featureFlagStore.isNewLoginEnabled;
	}

	let showModal = false;

	const closeModal = () => {
		showModal = false;
	};

	const toggleWishlist = async (e: Event) => {
		e.stopPropagation();

		if (!$customerProfileStore?.isLoggedIn) {
			if (isNewLoginEnabled) {
				showModal = true;
			} else {
				$showAuthenticationModal = true;
			}
			return;
		}

		const url = new URL('/api/products/wishlist', window.location.origin);
		const method = isWishlisted ? 'DELETE' : 'POST';

		const storeLocation = window.location.pathname.split('/')[1];

		try {
			const wishlistReq = await fetch(url.toString(), {
				method,
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					productID: productId,
					store: storeLocation,
					userId: $customerProfileStore.userId
				})
			});

			const wishlistRes = await wishlistReq.json();

			if (wishlistRes?.acknowledged) {
				if (isWishlisted) {
					toast.success('Successfully removed from wishlist.', {
						position: 'top-center'
					});
					isWishlisted = false;
				} else {
					toast.success('Successfully added to wishlist.', {
						position: 'top-center'
					});
					isWishlisted = true;
				}
			}
		} catch (error) {
			toast.error('Error wishlist operation', {
				position: 'top-center'
			});
		}
	};
</script>

<div class={$$props.class}>
	<Button variant="link" class="p-0 z-20" onClick={toggleWishlist}>
		{#if isWishlisted}
			<HeartFillHealthMedical {size} color="#911A1C" />
		{:else}
			<HeartLineHealthMedical {size} />
		{/if}
	</Button>
</div>
{#if showModal}
	<AuthenticationTab bind:isModalOpen={showModal} on:closeModal={closeModal} />
{/if}
