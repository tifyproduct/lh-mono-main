<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';

	import type { TextColor } from '../Text/type';

	export let bgColor: string = 'bg-dark-brown-1';
	export let color: TextColor = 'dark-brown-8';
</script>

<div class="py-1 px-2 rounded {bgColor}">
	<Text type="caption-2" {color} weight="semibold" class="flex">
		<slot />
	</Text>
</div>
