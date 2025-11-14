<script lang="ts">
	import ConciergePage from '$lib/pages/ConciergePage/ConciergePage.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<ConciergePage {data} />
