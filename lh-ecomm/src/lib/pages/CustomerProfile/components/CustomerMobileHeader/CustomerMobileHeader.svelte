<script lang="ts">
	import { ArrowLeftSLineArrows } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';

	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let title: string = '';

	const goBack = () => {
		goto(`/${$page.params.store}/${$page.params.lang}/pages/customer-profile-mobile`);
	};
</script>

<div class="flex items-center gap-2 h-[52px] bg-white-1 px-4 py-[14px] shadow">
	<ArrowLeftSLineArrows size={24} on:click={goBack} class="cursor-pointer" />

	<Text type="subtitle-3" color="black-9" weight="semibold" class="truncate">{title}</Text>
</div>
