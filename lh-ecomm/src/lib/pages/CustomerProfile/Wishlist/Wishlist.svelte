<script lang="ts">
	import { get } from 'svelte/store';

	import { page } from '$app/stores';

	import { AddLineSystem } from 'svelte-remix';

	import { Pagination, Spinner } from 'flowbite-svelte';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	import customerProfileStore from '$lib/stores/customerProfileStore';
	import ProductCard from '$lib/components/ProductCard/ProductCard.svelte';
	import SimplePagination from '$lib/components/SimplePagination/SimplePagination.svelte';
	import type { ProductData } from '$lib/types/product';
	import AddToCart from './AddToCart.svelte';
	import { buySellWhatsappRedirect } from '$lib/utils/whatsappRedirect';

	let currentPage = 1;
	let wishlists: ProductData[] = [];
	let pagination: Pagination | null = null;
	let isLoading: boolean = true;

	$: if ($customerProfileStore?.id) {
		fetchWishlist();
	}

	const fetchWishlist = async () => {
		const url = new URL('/api/products/wishlist', window.location.origin);

		const customerID = $customerProfileStore?.id;
		const extractedID = customerID.split('/').pop()!;

		url.searchParams.append('store', get(page).params.store);
		url.searchParams.append('lang', get(page).params.lang);
		url.searchParams.append('page', currentPage.toString());
		url.searchParams.append('perPage', '12');

		const request = await fetch(url.toString(), {
			method: 'GET'
		});

		const response = await request.json();
		wishlists = response.data;
		pagination = response.pagination;
		isLoading = false;
	};

	const handlePageChange = (e: CustomEvent) => {
		currentPage = e.detail;
		fetchWishlist();
	};

	let selectedProductHandle = '';
	let isShowAddToCartModal = false;

	const onClickBuyBeauty = async (productHandle: string) => {
		selectedProductHandle = productHandle;

		isShowAddToCartModal = true;
	};

	const onClickBuyNonBeauty = (product: ProductData) => {
		buySellWhatsappRedirect({
			type: 'buy',
			storeLocation: get(page).params.store,
			productTitle: product.title,
			collection: product.type || '',
			brand: product.vendor,
			subBrand: '', //TODO GET SUBBRAND
			showCurrentUrl: false,
			customer: $customerProfileStore,
			utmCampaign: $page.url.searchParams.get('utm_campaign') || '',
			utmMedium: $page.url.searchParams.get('utm_medium') || '',
			utmSource: $page.url.searchParams.get('utm_source') || '',
			utmTerm: $page.url.searchParams.get('utm_term') || '',
			utmContent: $page.url.searchParams.get('utm_content') || '',
			referrer: $page.url.searchParams.get('referrer') || '',
			leadSrc: $page.url.searchParams.get('lead_src') || 'Website',
			salesCode: $page.url.searchParams.get('sales_code') || '',
			productId: product.id
		});
	};

	const onClickRemoveWishlist = async (productId: string) => {
		await fetch('/api/products/wishlist', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				productID: productId
			})
		}).then(() => {
			fetchWishlist();
		});
	};
</script>

<div class="flex flex-col basis-3/5 max-lg:p-4">
	<div class="flex items-center">
		<Text type="subtitle-3" color="black-9" weight="semibold">Your Wishlist</Text>
	</div>

	<!-- Content -->
	{#if isLoading}
		<div class="flex items-center justify-center min-h-[60vh]">
			<Spinner color="gray" />
		</div>
	{:else if wishlists.length > 0}
		<div>
			<div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 lg:gap-8 mt-10">
				{#each wishlists as product}
					{@const productItem = {
						name: product.title,
						description: product.vendor,
						initialPrice: product.normalPrice || '0.0',
						discountPrice: product.salePrice || '0.0',
						discountPercentage: product.percentage ?? 0,
						imageURL: product.image?.url || '',
						tags: product.tags,
						tagAll: product.tagAll,
						imageHeight: '',
						url: product.url,
						showPrice: product.showPrice,
						productId: product.id,
						wishlisted: product.wishlisted,
						discount: product.discount,
						preOrder: product.preOrder,
						outOfStock: product.outOfStock,
						newArrival: product.newArrival
					}}
					<ProductCard
						class="cursor-pointer shrink-0 basis-40 md:basis-52 snap-start"
						{...productItem}
						hideAddToWishlistButton
						onClickRemoveWishlist={() => onClickRemoveWishlist(product.id)}
					>
						<div slot="additionalButtons" class="my-4">
							{#if product.type === 'Beauty'}
								<Button
									variant="secondary"
									class="w-full"
									onClick={() => onClickBuyBeauty(product.handle)}
								>
									<Text type="body-2" color="dark-brown-10" weight="semibold">BUY NOW</Text>
								</Button>
							{:else}
								<Button
									variant="secondary"
									class="w-full"
									onClick={() => onClickBuyNonBeauty(product)}
								>
									<Text type="body-2" color="dark-brown-10" weight="semibold">BUY NOW</Text>
								</Button>
							{/if}
						</div>
					</ProductCard>
				{/each}
			</div>
			<div class="mt-16">
				<SimplePagination
					{currentPage}
					hasNext={pagination?.hasNext}
					hasPrev={pagination?.hasPrevious}
					count={pagination?.total}
					itemsPerPage={12}
					on:pageChange={handlePageChange}
				/>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
			<img src="/icons/search_folder.svg" alt="no-address-icon" class="mb-4" />

			<div class="mt-10">
				<Text type="subtitle-3" color="black-9" weight="semibold">No Wishlist Yet</Text>
			</div>

			<div class="mt-2">
				<Text type="body-2" color="black-6">
					It looks like you haven’t put any items into your wishlist. Start <br />
					putting our collection into your wishlist and see it here!
				</Text>
			</div>

			<div class="mt-10">
				<Button
					variant="secondary"
					href="/{$page.params.store}/{$page.params.lang}"
					class="flex items-center gap-1"
				>
					<Text type="body-2" color="dark-brown-10" weight="semibold">EXPLORE NOW</Text>
					<AddLineSystem class="size-4" />
				</Button>
			</div>
		</div>
	{/if}

	<AddToCart
		isOpen={isShowAddToCartModal}
		onClose={() => {
			isShowAddToCartModal = false;
		}}
		productHandle={selectedProductHandle}
	/>
</div>
