<script lang="ts">
	import { AddLineSystem } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import AddressCard from './AddressCard/AddressCard.svelte';
	import AddressModal from './AddressModal/AddressModal.svelte';

	import type { Address } from '$lib/types/address';
	import { deleteAddress, setAsDefaultAddress } from './actions';

	import { toast } from 'svelte-sonner';

	export let store;
	export let addressData;
	export let regions;


	let isModalOpen = false;
	let isEditMode = false;
	let selectedAddressData: Address | undefined = undefined;

	const handleOpenModal = () => {
		selectedAddressData = undefined;
		isModalOpen = true;
	};

	const handleCloseModal = () => {
		isModalOpen = false;
	};

	const handleClickSetAsDefault = async (address: Address) => {
		try {
			if (address._id) {
				await setAsDefaultAddress(address._id.toString()).then(() => {
					refetchAddress();
					toast.success('Successfully set new Address as Default Address.');
				});
			} else {
				toast.error('Address is not found.');
			}
		} catch (error) {
			toast.error('Error set as default address.');
		}
	};

	const handleClickEditAddress = (address: Address) => {
		selectedAddressData = address;
		isModalOpen = true;
		isEditMode = true;
	};

	const handleClickDeleteAddress = async (address: Address) => {
		try {
			if (address._id) {
				await deleteAddress(address._id.toString());
				refetchAddress();
			} else {
				toast.error('Address is not found.');
			}
		} catch (error) {
			console.error('Error deleting address:', error);
		}
	};

	const refetchAddress = async () => {
		window.location.reload();
	};
</script>

<div class="flex flex-col basis-3/5 max-lg:p-4">
	<div class="flex items-center justify-between">
		<Text type="subtitle-3" color="black-9" weight="semibold">Your Saved Addresses</Text>

		{#if addressData.data.length > 0}
			<div>
				<Button variant="secondary" class="flex items-center gap-1" onClick={handleOpenModal}>
					<Text type="body-2" color="dark-brown-10" weight="semibold">ADD</Text>
					<AddLineSystem class="size-4" />
				</Button>
			</div>
		{/if}
	</div>

	<!-- Content -->
	{#if addressData.data.length > 0}
		<div class="mt-10">
			{#each addressData.data as address, index}
				<div class:mt-6={index !== 0}>
					<AddressCard
						{address}
						onClickEdit={() => handleClickEditAddress(address)}
						onClickDelete={() => handleClickDeleteAddress(address)}
						onClickSetAsDefault={() => handleClickSetAsDefault(address)}
					/>
				</div>
			{/each}
		</div>
	{:else}
		<div class="text-center flex flex-col items-center justify-center min-h-[600px]">
			<img src="/icons/search_folder.svg" alt="no-address-icon" class="mb-4" />

			<div class="mt-10">
				<Text type="subtitle-3" color="black-9" weight="semibold">No Saved Addresses Yet</Text>
			</div>

			<div class="mt-2">
				<Text type="body-2" color="black-6">
					You don’t have any saved addresses. Start by adding an <br /> address to view it here
				</Text>
			</div>

			<div class="mt-10">
				<Button variant="secondary" class="flex items-center gap-1" onClick={handleOpenModal}>
					<Text type="body-2" color="dark-brown-10" weight="semibold">ADD ADDRESS</Text>
					<AddLineSystem class="size-4" />
				</Button>
			</div>
		</div>
	{/if}
</div>

{#if isModalOpen}
	<AddressModal
		isOpen={isModalOpen}
		isEdit={isEditMode}
		{selectedAddressData}
		onClose={handleCloseModal}
		{refetchAddress}
		{regions}
		{store}
	/>
{/if}
