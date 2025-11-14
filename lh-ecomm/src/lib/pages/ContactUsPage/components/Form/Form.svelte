<script>
	import { Label, Input, Textarea } from 'flowbite-svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	let textareaprops = {
		id: 'message',
		name: 'message',
		label: 'Your message',
		rows: 4,
		placeholder: 'Your Message'
	};

	let name = '';
	let phone = '';
	let email = '';
	let message = '';
	let responseMessage = '';
	let isSubmitting = false;

	const handleSubmit = async (event) => {
		event.preventDefault();
		isSubmitting = true;
		responseMessage = '';

		const formData = new FormData();
		formData.append('name', name);
		formData.append('phone', phone);
		formData.append('email', email);
		formData.append('message', message);

		try {
			const response = await fetch('https://formspree.io/f/xyzyknjy', {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json'
				}
			});

			if (response.ok) {
				responseMessage = "Thanks for contacting us. We'll get back to you as soon as possible.";
				name = '';
				phone = '';
				email = '';
				message = '';
			} else {
				responseMessage = 'Something went wrong. Please try again later.';
			}
		} catch (error) {
			responseMessage = 'There was a problem submitting the form. Please try again later.';
		} finally {
			isSubmitting = false;
		}
	};

	const handlePhoneInput = (event) => {
		event.target.value = event.target.value.replace(/\D/g, '');
	};
</script>

<div class="container max-w-[1600px] grid text-center md:p-20 p-4">
	<Text type="subtitle-1" weight="semibold">Contact Us</Text>
	<div class="max-w-2xl mx-auto mt-4">
		<Text type="body-1"
			>We aim to respond within 24 hours, but during busy periods like holidays, sales and special
			campaigns we may take a little longer getting back to you.</Text
		>
		{#if responseMessage}
			<div class="mt-4 text-center bg-[#DFF0D8] p-4">
				<Text type="body-1">{responseMessage}</Text>
			</div>
		{/if}
	</div>

	<form on:submit={handleSubmit} class="mt-8 text-left">
		<div class="mb-6 md:px-20">
			<Label for="name" class="block mb-2">Name <span style="color: #F1152F">*</span></Label>
			<Input id="name" bind:value={name} placeholder="e.g.: Jane Doe" required />
		</div>
		<div class="mb-6 md:px-20">
			<Label for="phone" class="block mb-2">Phone Number</Label>
			<Input
				id="phone"
				name="phone"
				bind:value={phone}
				placeholder="e.g.: 62831xxxxxxxx"
				type="text"
				on:input={handlePhoneInput}
			/>
		</div>
		<div class="mb-6 md:px-20">
			<Label for="email" class="block mb-2">Email <span style="color: #F1152F">*</span></Label>
			<Input
				id="email"
				bind:value={email}
				placeholder="e.g.: janedoe@gmail.com"
				type="email"
				required
			/>
		</div>
		<div class="mb-6 md:px-20">
			<Label for="message" class="block mb-2">Comment <span style="color: #F1152F">*</span></Label>
			<Textarea {...textareaprops} bind:value={message} required />
		</div>

		<div class="px-20">
			<Button variant="primary" type="submit" class="w-full p-4" disabled={isSubmitting}>
				{isSubmitting ? 'Submitting...' : 'SUBMIT CONTACT'}
			</Button>
		</div>
	</form>
</div>
