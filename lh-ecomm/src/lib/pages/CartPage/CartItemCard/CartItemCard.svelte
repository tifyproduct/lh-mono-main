<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';

	import {
		AddFillSystem,
		DeleteBinLineSystem,
		Loader3LineSystem,
		SubtractLineSystem
	} from 'svelte-remix';
	import type { CartItem } from './type';
	import { navigating, page } from '$app/stores';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/Button/Button.svelte';
	import { currencyFormat } from '$lib/utils/formatter';
	import debounce from '$lib/utils/debounce';

	import { createEventDispatcher } from 'svelte';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let item: CartItem;

	let quantity = item?.quantity ?? 0;

	let isFetching = false;
	let isFree = false;

	const increaseQty = () => {
		quantity++;

		googleAnalClickedEvent('quantity_adjustment', {
			cart: {
				adjustment: 'Add'
			}
		});

		debounce(() => {
			handleUpdateQty(quantity);
		}, 100)();
	};

	const decreaseQty = () => {
		if (quantity - 1 < 1) return;

		quantity--;

		googleAnalClickedEvent('quantity_adjustment', {
			cart: {
				adjustment: 'Deduct'
			}
		});

		debounce(() => {
			handleUpdateQty(quantity);
		}, 100)();
	};

	const handleInputQtyChange = (e: Event) => {
		const changedValue = (e.target as HTMLInputElement).value;

		if (parseInt(changedValue) < 1) {
			(e.target as HTMLInputElement).value = quantity.toString();
			return;
		}

		quantity = parseInt((e.target as HTMLInputElement).value);

		debounce(() => {
			handleUpdateQty(quantity);
		}, 100)();
	};

	const handleRemove = async (productName: string) => {
		isFetching = true;

		const request = await fetch('/api/cart', {
			method: 'DELETE',
			body: JSON.stringify({
				lineId: item.id
			})
		});

		const cartData = await request.json();

		if (cartData?.cart?.id) {
			googleAnalClickedEvent('remove_from_cart', {
				product: {
					name: productName
				}
			});

			await goto('', {
				invalidateAll: true
			});
			dispatch('remove-succeed');
		}

		isFetching = false;
	};

	const handleUpdateQty = async (qty: number) => {
		isFetching = true;

		const request = await fetch('/api/cart', {
			method: 'PUT',
			body: JSON.stringify({
				lineId: item.id,
				quantity: qty
			})
		});

		const cartData = await request.json();

		if (cartData?.id) {
			await goto('', {
				invalidateAll: true
			});
		}
		isFetching = false;
	};

	const dispatch = createEventDispatcher();

	$: {
		quantity = item?.quantity ?? 0;
	}

	$: {
		isFree = item?.cost?.totalAmount?.amount == '0.0';
	}
</script>

<div class="max-lg:flex-col flex">
	<div class="flex">
		<div
			class="min-h-[86px] min-w-[86px] size-[86px] lg:size-[172px] lg:min-h-[172px] lg:min-w-[172px]"
		>
			<img src={item?.merchandise?.image?.url ?? ''} alt="" class="w-full object-cover" />
		</div>
		<div class="flex-wrap flex flex-col py-3 px-4">
			<Text class="pb-1" type="body-2" weight="semibold">
				{item?.merchandise?.product.vendor ?? ''}
			</Text>
			<Text class="pb-1" type="body-1" color="black-6">
				{item?.merchandise?.product.title ?? ''}
			</Text>
			<Text class="pb-2" type="caption-1" color="black-4">Variant: {item?.merchandise?.title}</Text>
			<Text type="body-1" weight="semibold" class="lg:hidden">
				{#if item?.cost?.totalAmount?.amount == '0.0'}
					FREE
				{:else}
					{currencyFormat(
						parseInt(item?.cost?.amountPerQuantity?.amount ?? '') ?? 0,
						$page.params.store
					)}
				{/if}
			</Text>
			{#if !isFree}
				<div class="hidden relative lg:flex items-center border rounded px-2 max-w-[6rem] mt-4">
					<button
						type="button"
						id="decrement-button"
						data-input-counter-decrement="quantity-input"
						class="hover:bg-gray-200 rounded-s-lg"
						on:click={decreaseQty}
						disabled={isFetching}
						class:cursor-not-allowed={isFetching || quantity - 1 < 1}
					>
						<SubtractLineSystem size={16} />
					</button>
					<input
						type="text"
						id="quantity-input"
						data-input-counter
						aria-describedby="helper-text-explanation"
						class="border-none text-center text-sm block w-full py-1"
						placeholder="1"
						required
						value={quantity}
						disabled={isFetching}
						on:change={handleInputQtyChange}
						class:cursor-not-allowed={isFetching}
					/>
					<button
						type="button"
						id="increment-button"
						data-input-counter-increment="quantity-input"
						class="hover:bg-gray-200 rounded-s-lg"
						on:click={increaseQty}
						disabled={isFetching}
						class:cursor-not-allowed={isFetching}
					>
						<AddFillSystem size={16} />
					</button>
				</div>
			{/if}
		</div>
	</div>
	<div class="lg:hidden z-20 flex justify-end items-center">
		{#if !isFree}
			<Button
				variant="link"
				onClick={() => handleRemove(item?.merchandise?.product.title)}
				disabled={isFetching}
			>
				{#if $navigating || isFetching}
					<Loader3LineSystem class="animate-spin" size={16} />
				{:else}
					<DeleteBinLineSystem class="text-black-6 cursor-pointer" size={16} />
				{/if}
			</Button>
			<div class="relative flex items-center border rounded px-2 max-w-[5rem]">
				<button
					type="button"
					id="decrement-button"
					data-input-counter-decrement="quantity-input"
					class="hover:bg-gray-200 rounded-s-lg"
					on:click={decreaseQty}
					disabled={isFetching}
				>
					<SubtractLineSystem size={12} />
				</button>
				<input
					type="text"
					id="quantity-input"
					data-input-counter
					aria-describedby="helper-text-explanation"
					class="border-none text-center text-sm block w-full py-1"
					placeholder="1"
					required
					value={quantity}
					disabled={isFetching}
					on:change={handleInputQtyChange}
				/>
				<button
					type="button"
					id="increment-button"
					data-input-counter-increment="quantity-input"
					class="hover:bg-gray-200 rounded-s-lg"
					on:click={increaseQty}
					disabled={isFetching}
				>
					<AddFillSystem size={12} />
				</button>
			</div>
		{/if}
	</div>
	<div class="lg:flex flex-col ml-auto justify-between items-end hidden">
		{#if !isFree}
			<Button
				variant="link"
				onClick={() => handleRemove(item?.merchandise?.product.title)}
				disabled={isFetching}
				class="bg-white-2 rounded-full p-2 flex"
			>
				{#if $navigating || isFetching}
					<Loader3LineSystem class="animate-spin" />
				{:else}
					<DeleteBinLineSystem class="text-black-6 cursor-pointer" />
				{/if}
			</Button>
		{/if}
		<div class="flex flex-col text-right mt-auto">
			{#if item?.cost?.compareAtAmountPerQuantity != null || item?.discountAllocations?.length > 0}
				<Text type="caption-1" class="line-through" color="black-4">
					{currencyFormat(
						parseInt(
							item?.cost?.compareAtAmountPerQuantity?.amount ??
								item?.cost?.amountPerQuantity?.amount ??
								''
						) ?? 0,
						$page.params.store
					)}
				</Text>
			{/if}
			<Text type="subtitle-3" color="red-6">
				{#if item?.cost?.totalAmount?.amount == '0.0'}
					FREE
				{:else}
					{currencyFormat(
						parseInt(item?.cost?.amountPerQuantity?.amount ?? '') -
							item?.discountAllocations?.reduce((_acc, disc) => {
								return parseInt(disc.discountedAmount.amount);
							}, 0),
						$page.params.store
					)}
				{/if}
			</Text>
		</div>
	</div>
</div>
