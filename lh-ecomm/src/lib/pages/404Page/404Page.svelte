<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { page } from '$app/stores';

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
</script>

<div class="container max-w-[1600px] min-h-[50vh] text-center md:p-20 p-4 grid">
	<div class="text-9xl font-bold text-gray-800">404</div>
	<Text type="subtitle-1" weight="semibold" color="black-9" class="mt-4">PAGE NOT FOUND</Text>
	<div class="max-w-3xl mx-auto mt-4">
		<Text type="body-1">
			The page you are looking for might have been removed, had its name changed, or is temporarily
			unavailable.
		</Text>
	</div>
	<div class="flex mx-auto gap-4 mt-4">
		<Button variant="secondary" href={baseParams} class="flex-1 text-center whitespace-nowrap">
			BACK TO HOME
		</Button>
	</div>
</div>
