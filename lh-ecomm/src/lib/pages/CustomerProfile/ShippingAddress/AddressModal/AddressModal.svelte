<script lang="ts">
	import Modal from '$lib/components/Modal/Modal.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Input from '$lib/components/Input/Input.svelte';
	import InputWithDropdown from '$lib/components/Input/InputWithDropdown.svelte';
	import Divider from '$lib/components/Divider/Divider.svelte';

	import Button from '$lib/components/Button/Button.svelte';
	import Select from '$lib/components/Select/Select.svelte';
	import type { AddressInput, Address } from '$lib/types/address';
	import { onMount } from 'svelte';
	import { createAddress, updateAddress } from '../actions';
	import { toast } from 'svelte-sonner';

	export let isOpen: boolean;
	export let onClose: () => void;
	export let isEdit: boolean;
	export let refetchAddress: () => void;

	export let regions;
	export let store;

	export let selectedAddressData: Address | undefined;

	let selectedRegion: string;
	let selectedCountryCode: string;

	const resetFormState = () => {
		selectedRegion = store === 'id' ? 'Indonesia' : 'Singapore';
		selectedCountryCode = store === 'id' ? '+62' : '+65';
	};

	onMount(async () => {
		await resetFormState();
		if (isEdit && selectedAddressData) {
			selectedRegion = selectedAddressData.country;
			selectedCountryCode = selectedAddressData.phone?.slice(0, 3) || '+62';
		}
	});

	const onSubmitAddress = async (event: SubmitEvent) => {
		const formData = new FormData(event.target as HTMLFormElement);

		const addressData: AddressInput = {
			address1: String(formData.get('address1') || ''),
			address2: String(formData.get('address2') || ''),
			company: String(formData.get('name') || ''),
			firstName: String(formData.get('name') || ''),
			lastName: String(formData.get('lastName') || ''),
			phone: `${selectedCountryCode}${String(formData.get('phone') || '')}`,
			country: String(formData.get('region') || ''),
			province: String(formData.get('province') || ''),
			city: String(formData.get('city') || ''),
			zip: String(formData.get('postalCode') || ''),
		};

		try {
			if (isEdit && selectedAddressData?._id) {
				await updateAddress(selectedAddressData._id?.toString(), addressData).then(() => {
					toast.success('Successfully updated Address.');
				});
			} else {
				await createAddress(addressData).then(() => {
					toast.success('Successfully created a new Address.');
				});
			}
			onClose();
			refetchAddress();
		} catch (error) {
			console.error(error)
			toast.error('Error submitting address.');
		}
	};

	const regionOptions = [
		{ name: 'Indonesia', value: 'Indonesia' },
		{ name: 'Singapore', value: 'Singapore' }
	];

	$: provinces =
		regions && selectedRegion
			? regions
					.find((item: any) => item.value === selectedRegion)
					.provinces.map((item: any) => {
						return {
							name: selectedRegion === 'Indonesia' ? item.idLabel : item.enLabel,
							value: item.value
						};
					})
			: [];
</script>

<Modal title="" {isOpen} {onClose} padding="py-4 px-8" maxWidth="max-w-full md:max-w-xl">
	<div class="text-center">
		<Text type="subtitle-2" color="black-9" weight="semibold">
			{#if isEdit}
				Edit Address
			{:else}
				Add New Address
			{/if}
		</Text>
		<div class="mt-1">
			<Text type="body-1" color="black-9">
				{#if isEdit}
					Complete filling out the details below to edit an address
				{:else}
					Complete filling out the details below to add a new address
				{/if}
			</Text>
		</div>
	</div>

	<div class="mt-8">
		<form on:submit|preventDefault={onSubmitAddress}>
			<div>
				<Input
					id="name"
					name="name"
					label="Address Name"
					placeholder="e.g: Home, Office, etc."
					value={selectedAddressData?.company || ''}
				/>
			</div>

			<div class="flex mt-4 items-center justify-between gap-4">
				<div class="basis-1/2">
					<Input
						id="firstName"
						name="firstName"
						label="First Name of Recipient"
						placeholder="e.g: John"
						value={selectedAddressData?.firstName || ''}
					/>
				</div>
				<div class="basis-1/2">
					<Input
						id="lastName"
						name="lastName"
						label="Last Name of Recipient"
						placeholder="e.g: Smith"
						value={selectedAddressData?.lastName || ''}
					/>
				</div>
			</div>

			<div class="mt-4">
				<InputWithDropdown
					id="phone"
					name="phone"
					type="number"
					label="Phone Number"
					placeholder="e.g: 0812 3456 7890"
					options={['+62', '+65']}
					bind:selectedOption={selectedCountryCode}
					value={selectedAddressData?.phone?.slice(3) || ''}
				/>
			</div>

			<div class="mt-4">
				<Input
					id="address1"
					name="address1"
					label="Address"
					placeholder="Enter your address"
					value={selectedAddressData?.address1 || ''}
				/>
			</div>

			<div class="mt-4">
				<Input
					id="address2"
					name="address2"
					label="Apartment, suite, etc. (optional)"
					placeholder="Enter additional information"
					required={false}
					value={selectedAddressData?.address2 || ''}
				/>
			</div>

			<div class="mt-4">
				<Select
					id="region"
					name="region"
					label="Region"
					placeholder="Select your region"
					options={regionOptions}
					bind:value={selectedRegion}
				/>
			</div>

			<div class="flex mt-4 items-center justify-between gap-4">
				<div class="basis-1/2">
					<Select
						id="province"
						name="province"
						label="Province"
						placeholder="Select your province"
						options={provinces}
						value={selectedAddressData?.province || ''}
					/>
				</div>
				<div class="basis-1/2">
					<Input
						id="city"
						name="city"
						label="City"
						placeholder="Enter your city"
						value={selectedAddressData?.city || ''}
					/>
				</div>
			</div>

			<div class="mt-4">
				<Input
					id="postalCode"
					name="postalCode"
					label="Postal Code"
					placeholder="Enter your postal code"
					value={selectedAddressData?.zip || ''}
				/>
			</div>

			<Divider verticalMargin="my-4" />

			<div class="mt-4">
				<Button variant="primary" class="w-full" padding="py-3" type="submit">
					<Text type="body-1" color="white-1" weight="semibold">
						{#if isEdit}
							SAVE CHANGES
						{:else}
							ADD NEW ADDRESS
						{/if}
					</Text>
				</Button>
			</div>
		</form>
	</div>
</Modal>
