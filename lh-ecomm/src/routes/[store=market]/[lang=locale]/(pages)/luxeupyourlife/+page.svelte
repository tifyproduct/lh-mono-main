<script lang="ts">
	import type { PageServerData } from './$types';
	import CampaignPage from '$lib/pages/CampaignPage/CampaignPage.svelte';
	export let data: PageServerData;
</script>

<CampaignPage {data} />
