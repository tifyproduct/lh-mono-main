<script lang="ts">
	import Modal from '$lib/components/Modal/Modal.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import PromotionCard from './components/PromotionCard/PromotionCard.svelte';
	import Text from '../Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	import { Hr, Input, Toast } from 'flowbite-svelte';
	import { FileCopyLineDocument, TicketLineFinance } from 'svelte-remix';
	import type { Promotion } from '$lib/types/promotions';
	import copyToClipboard from '$lib/utils/copyToClipboard';
	import { goto } from '$app/navigation';
	import { googleAnalClickedEvent } from '$lib/utils/googleAnalytics';

	export let isOpen;
	export let promotionList: Promotion[] = [];
	export let preSelectedIndex: number = 0;
	export let showApplyVoucher: boolean;

	let selectedIndex: number = preSelectedIndex;
	let isShowToast: boolean = false;
	let isApplyingVoucher: boolean = false;
	let toastCopy: string = '';
	let promotionListFiltered: Promotion[] = [...promotionList];
	let inputtedCode: string = '';

	const dispatch = createEventDispatcher();

	const togglePromotionModal = () => {
		dispatch('close-modal');
	};

	const handleOnCardClick = (payload: CustomEvent) => {
		selectedIndex = payload.detail as number;
	};

	const showToast = () => {
		isShowToast = true;

		setTimeout(() => {
			isShowToast = false;
		}, 3000);
	};

	const handleCopyClipboard = (value: string) => {
		copyToClipboard(value);
		toastCopy = 'Copied to Clipboard';
		showToast();
	};

	const fetchApplyVoucher = async (code: string, name?: string) => {
		try {
			if (selectedIndex >= 0) {
				isApplyingVoucher = true;
				const verifyDiscountCode = await fetch('/api/cart/discount-code', {
					method: 'POST',
					body: JSON.stringify({
						code: code
					})
				});

				const verifyDiscountCodeRes = await verifyDiscountCode.json();

				if (verifyDiscountCodeRes?.data?.cartDiscountCodesUpdate?.cart?.id) {
					await goto('', {
						invalidateAll: true
					});
					dispatch('voucher-applied');
					dispatch('close-modal');
				}

				googleAnalClickedEvent('click_apply_vouchers', {
					voucher: {
						name: name
					}
				});
			}
		} catch (error) {
			toastCopy = 'Error applying Voucher';
			showToast();
		} finally {
			isApplyingVoucher = false;
		}
	};

	const handleApplyVoucher = async () => {
		const voucherCode = promotionListFiltered[selectedIndex].code ?? '';
		const voucherName = promotionListFiltered[selectedIndex].title ?? '';

		await fetchApplyVoucher(voucherCode, voucherName);
	};

	const handleApplyCode = async () => {
		await fetchApplyVoucher(inputtedCode ?? '');
		inputtedCode = '';
		promotionListFiltered = promotionList.filter((promotion: Promotion) => {
			return promotion.code.toLowerCase().includes(inputtedCode.toLowerCase());
		});
	};

	const handleOnCodeInputChange = (e: Event) => {
		const value = (e.target as HTMLInputElement).value;
		promotionListFiltered = promotionList.filter((promotion: Promotion) => {
			return promotion.code.toLowerCase().includes(value.toLowerCase());
		});
	};
</script>

<Modal {isOpen} onClose={togglePromotionModal} title="Available Vouchers" maxWidth="lg:max-w-[70%]">
	<div class="flex max-lg:flex-col">
		<div class="shrink-0 lg:mr-6 lg:w-1/2">
			{#if showApplyVoucher}
				<Input
					bind:value={inputtedCode}
					placeholder="Insert voucher code"
					class="border-dark-brown-1 rounded p-3 placeholder-black-4 text-black-10 bg-white-1"
					on:keyup={handleOnCodeInputChange}
				/>
				<Hr hrClass="my-3" />
			{/if}
			<div class="overflow-y-scroll">
				{#each promotionListFiltered as promotion, index}
					<PromotionCard
						description={promotion.description}
						isSelected={index == selectedIndex}
						title={promotion.title}
						code={promotion.code}
						dueDate={promotion.endsAt}
						on:card-click={handleOnCardClick}
						on:copy-clipboard={(payload) => {
							handleCopyClipboard(payload.detail);
						}}
						{index}
					/>
				{/each}
			</div>
		</div>
		{#if promotionListFiltered.length > 0}
			<div class="lg:flex flex-col lg:w-1/2">
				<div class="hidden lg:block">
					<Text type="body-1" class="mb-3">
						{promotionListFiltered[selectedIndex]?.description ?? ''}
					</Text>
					<br />
					<Text type="caption-1" color="black-6">
						{promotionListFiltered[selectedIndex]?.description ?? ''}
					</Text>
					<Input
						readonly
						value={promotionListFiltered[selectedIndex]?.code ?? ''}
						class="border-dark-brown-1 rounded px-4 py-3 bg-white-1 my-6"
					>
						<FileCopyLineDocument
							slot="right"
							size="16"
							class="text-beige-10"
							on:click={() => {
								handleCopyClipboard(promotionListFiltered[selectedIndex].code);
							}}
						/>
					</Input>
				</div>
				{#if showApplyVoucher}
					<Button
						onClick={handleApplyVoucher}
						variant="primary"
						class="w-full max-lg:mt-4"
						disabled={isApplyingVoucher}
					>
						APPLY VOUCHER
					</Button>
				{/if}
			</div>
		{/if}
	</div>
	{#if promotionListFiltered.length < 1}
		<div
			class="flex justify-center flex-col items-center lg:w-[40%] text-center ml-auto mr-auto p-4"
		>
			<TicketLineFinance size={24} class="text-brown-10" />
			<Text type="subtitle-3" weight="semibold" color="black-9" class="mt-4 mb-2">
				No Vouchers found
			</Text>
			<Text type="body-2" color="black-6">
				Try another code or problem insist, contact our customer service team
			</Text>
		</div>
		{#if showApplyVoucher}
			<Button
				onClick={handleApplyCode}
				variant="primary"
				class="w-full max-lg:mt-4"
				disabled={isApplyingVoucher}
			>
				APPLY CODE
			</Button>
		{/if}
	{/if}

	<div class="fixed w-full flex justify-center max-lg:bottom-10 z-20 left-0">
		<Toast
			dismissable={false}
			toastStatus={isShowToast}
			divClass="w-full max-w-xs rounded border-brown-10 border border-l-4 text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800 gap-3"
			contentClass="bg-brown-05 p-4 w-full flex justify-start items-center"
		>
			<Text type="body-2" color="black-6">{toastCopy}</Text>
		</Toast>
	</div>
</Modal>
