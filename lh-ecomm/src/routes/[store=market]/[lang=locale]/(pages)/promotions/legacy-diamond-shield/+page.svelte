<script lang="ts">
	import type { PageServerData } from './$types';
	export let data: PageServerData;
	import LegacyDiamondShield from '$lib/pages/PromotionsPage/promotions/LegacyDiamondShield/LegacyDiamondShield.svelte';
</script>

<LegacyDiamondShield {data} />
