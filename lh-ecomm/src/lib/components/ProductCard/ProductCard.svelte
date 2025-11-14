<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';

	import { CloseLineSystem } from 'svelte-remix';

	import { currencyFormat } from '$lib/utils/formatter';

	import Text from '../Text/Text.svelte';
	import Button from '../Button/Button.svelte';
	import { LABEL_ALLOWED, LABEL_BADGE } from '$lib/constants.util';
	import WishlistButton from '../WishlistButton/WishlistButton.svelte';
	import { googleAnalClickProduct } from '$lib/utils/googleAnalytics';
	import watermarkLogo from '$lib/assets/static/watermark-logo.png';
	import ProductBadge from '../ProductBadge/ProductBadge.svelte';

	export let name: string;
	export let productId: string;
	export let description: string;
	export let initialPrice: string = '0.0';
	export let discountPrice: string = '0.0';
	export let discountPercentage: number;
	export let imageURL: string;
	export let tags: string[] = [];
	export let tagAll: Array<string> = [];
	export let imageHeight = 'h-60';
	export let showPrice: boolean = false;
	export let url = '';
	export let wishlisted: boolean;
	export let googleEvent: string = '';
	export let category: string = '';
	export let collection: string = '';

	export let hideAddToWishlistButton: boolean = false;
	export let onClickRemoveWishlist: () => void = () => {};

	export let discount: boolean = false;
	export let preOrder: boolean = false;
	export let outOfStock: boolean = false;
	export let newArrival: boolean = false;

	let path: string = '';
	let storeLocation: string = '';

	const dispatch = createEventDispatcher();

	onMount(async () => {
		path = window.location.pathname;
		storeLocation = path.substring(1, 3);
	});

	const handleClick = async () => {
		googleAnalClickProduct(googleEvent, { name, category, collection });

		dispatch('clicked');
	};
</script>

<div class="product-card group {$$props.class} relative cursor-pointer">
	<div class="h-full">
		<div
			data-sveltekit-preload-data="tap"
			role="presentation"
			on:click={handleClick}
			class="product-card__header relative"
		>
			<div class="product-card__image {imageHeight} flex items-center">
				<a href={url} class="relative group-hover:lg:scale-110 transition-all cursor-pointer">
					<img
						src={watermarkLogo}
						class="absolute w-[15px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
						alt="watermark"
					/>
					<img
						class={`object-contain z-0 pointer-events-none`}
						src={imageURL}
						alt="{name}-{description}"
					/>
				</a>
			</div>
			<div class="absolute top-0">
				<ProductBadge
					{discount}
					{preOrder}
					{outOfStock}
					{newArrival}
					isBeauty={false}
					isSmallText
				/>
			</div>
			<!-- {#if tags.length > 0}
				<div class="product-card__tags flex absolute top-1 left-0">
					{#each tags as tag}
						{#if LABEL_ALLOWED.includes(tag.toUpperCase())}
							<div
								class={`product-card__tag py-1 px-3 flex ${tag.toUpperCase() === LABEL_BADGE.SALE ? 'bg-red-6' : tag.toUpperCase() === LABEL_BADGE.NEW_ARRIVAL ? 'bg-dark-brown-10' : tag.toUpperCase() === LABEL_BADGE.OUT_OF_STOCK ? 'bg-black-6' : tag.toUpperCase() === LABEL_BADGE.SOLD_OUT ? 'bg-black-6' : tag.toUpperCase() === LABEL_BADGE.PRE_ORDER ? 'bg-beige-10' : ''} rounded`}
							>
								<Text color="white-1" type="caption-2" weight="semibold"
									>{tag.replaceAll('-', ' ').toUpperCase()}</Text
								>
							</div>
						{/if}
					{/each}
				</div>
			{/if} -->
			{#if hideAddToWishlistButton}
				<Button
					variant="link"
					class="block lg:hidden lg:group-hover:block absolute top-3 right-3 z-20"
					onClick={(e) => {
						e.stopPropagation();
						onClickRemoveWishlist();
					}}
				>
					<CloseLineSystem size={20} />
				</Button>
			{/if}
			{#if !hideAddToWishlistButton}
				<WishlistButton
					bind:isWishlisted={wishlisted}
					{productId}
					size={13}
					class="absolute right-[24px] top-[24px]"
				/>
			{/if}
		</div>

		<slot name="additionalButtons" />

		<div
			data-sveltekit-preload-data="tap"
			role="presentation"
			on:click={handleClick}
			class="product-card__content text-balance z-10 relative"
		>
			<div class="product-card__name align-top">
				<Text class="line-clamp-2" color="black-10" type="body-1" weight="semibold" variant="h2">
					<Text class="line-clamp-2" color="black-10" type="body-1" weight="semibold">
						{description}
					</Text>
					<Text class="line-clamp-2" color="black-6" type="body-2" title={name}>{name}</Text>
				</Text>
			</div>
		</div>
		<div class="product-card__footer">
			<div class="product-card__prices">
				<div class="product-card__price">
					<Text color="red-5" type="body-2" weight="semibold">
						{#if !showPrice}
							Call for price
						{:else}
							{parseInt(discountPrice) > 0
								? currencyFormat(parseInt(discountPrice), storeLocation)
								: currencyFormat(parseInt(initialPrice), storeLocation)}
						{/if}
					</Text>
				</div>

				{#if showPrice && parseInt(discountPrice) > 0}
					<div class="grid grid-flow-col justify-start">
						<div class="product-card__price-cut line-through decoration-black-5 flex">
							<Text color="black-4" type="body-2">
								{currencyFormat(parseInt(initialPrice), storeLocation)}
							</Text>
						</div>
						{#if tagAll.find((tag) => tag.toLowerCase() === 'beauty')}
							<div class="product-card__discount pl-3 shrink">
								<div class="rounded-sm py-0.5 px-1 bg-red-6 flex">
									<Text color="white-1" type="caption-1" weight="semibold">
										-{discountPercentage.toFixed(0)}%
									</Text>
								</div>
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
