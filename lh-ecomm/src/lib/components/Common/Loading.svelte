<script lang="ts">
	import { Spinner } from 'flowbite-svelte';

	import { fade } from 'svelte/transition';

	export let state = false;
</script>

{#if state}
	<div
		transition:fade={{ duration: 100 }}
		class="absolute backdrop-blur inset-0 z-50 flex justify-center items-center"
	>
		<Spinner size={16} currentFill="#dbb999" />
	</div>
{/if}
