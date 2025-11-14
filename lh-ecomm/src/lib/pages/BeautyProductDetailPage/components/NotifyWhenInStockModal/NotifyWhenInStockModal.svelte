<script lang="ts">
	import { ChatSmileFillCommunication, Notification2FillMedia } from 'svelte-remix';

	import Modal from '$lib/components/Modal/Modal.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Input from '$lib/components/Input/Input.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	import { createStockReminder, type StockReminderPayload } from './actions';

	export let isOpen: boolean;
	export let onClose: () => void;

	export let productId: string;

	let isSubmitted = false;

	const onSubmit = async (event: SubmitEvent) => {
		const formData = new FormData(event.target as HTMLFormElement);

		const payload: StockReminderPayload = {
			name: formData.get('name') as string,
			phone: formData.get('phone') as string,
			productId: productId
		};

		try {
			// TODO: Uncomment
			await createStockReminder(payload);

			isSubmitted = true;
		} catch (error) {
			console.error('Error submitting stock reminder:', error);
		}
	};

	const onClickOk = () => {
		onClose();
	};
</script>

<div>
	<Modal title="" {isOpen} {onClose} hideCloseIcon={isSubmitted}>
		<div class="flex justify-center">
			{#if !isSubmitted}
				<Notification2FillMedia size={60} class="text-beige-10" />
			{:else}
				<ChatSmileFillCommunication size={60} class="text-beige-10" />
			{/if}
		</div>

		<div class="mt-4 text-center">
			<Text type="body-1" color="black-9">
				{#if !isSubmitted}
					We'll notify you via WhatsApp when this product is restocked.
				{:else}
					Request received. We'll send you <br /> restock info soon.
				{/if}
			</Text>
		</div>

		{#if !isSubmitted}
			<div class="mt-4 px-2">
				<form on:submit|preventDefault={onSubmit}>
					<div>
						<Input id="name" name="name" label="Name" placeholder="Enter your name" />
					</div>
					<div class="mt-4">
						<Input
							id="phone"
							name="phone"
							label="Phone Number"
							placeholder="Enter your phone number"
						/>
					</div>

					<div class="mt-4">
						<Button variant="primary" class="w-full" padding="py-3" type="submit">
							<Text type="body-1" color="white-1" weight="semibold">SEND MY REQUEST</Text>
						</Button>
					</div>
				</form>
			</div>
		{/if}

		{#if isSubmitted}
			<div class="mt-4">
				<Button variant="primary" class="w-full" padding="py-3" onClick={onClickOk}>
					<Text type="body-1" color="white-1" weight="semibold">GOT IT</Text>
				</Button>
			</div>
		{/if}
	</Modal>
</div>
