<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { MailUnreadLineBusiness } from 'svelte-remix';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	const currentPage = get(page);
	const store = currentPage.params.store;
	let activeContent = '';

	function showContent(content) {
		activeContent = content;
	}

	let contactLink;
	if (store === 'id') {
		contactLink =
			'https://api.whatsapp.com/send?phone=6287888880803&text=I%20just%20checked%20your%20website.%20I%20have%20a%20few%20questions.%20Can%20you%20help?';
	} else {
		contactLink =
			'https://api.whatsapp.com/send?phone=6598625974&text=I%20just%20checked%20your%20website.%20I%20have%20a%20few%20questions.%20Can%20you%20help?';
	}
</script>

<div class="p-4">
	<Text type="body-1" color="black-9">Was this content helpful?</Text>
	<div class="flex space-x-2 mt-4">
		<button
			class="w-[128px] bg-black-9 text-white-1 rounded"
			on:click={() => showContent('content1')}
		>
			Yes
		</button>
		<button
			class="w-[128px] py-2 px-4 bg-black-3 border border-black-4 rounded"
			on:click={() => showContent('content2')}
		>
			Not Really
		</button>
	</div>

	{#if activeContent === 'content1'}
		<div class="mt-4">
			<Text type="body-1">Glad to know! Thank you for your feedback</Text>
		</div>
	{/if}
	{#if activeContent === 'content2'}
		<div class="mt-4 flex flex-col md:flex-row gap-4 md:items-center">
			<Text type="body-1">Sorry to hear that, don't hesitate to let us know how we can help</Text>
			<Button variant="link" href={contactLink} class="flex border p-2 gap-2">
				<MailUnreadLineBusiness />
				<Text type="body-1">Contact Us</Text>
			</Button>
		</div>
	{/if}
</div>
