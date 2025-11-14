<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	import RubberB from '$lib/pages/PromotionsPage/promotions/RubberB/RubberB.svelte';
</script>

<RubberB {data} />
