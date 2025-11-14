<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	import PerfectCompanion from '$lib/pages/PromotionsPage/promotions/PerfectCompanion/PerfectCompanion.svelte';
</script>

<PerfectCompanion {data} />
