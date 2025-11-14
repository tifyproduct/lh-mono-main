<script lang="ts">
	import SellWithUsPage from '$lib/pages/SellWithUsPage/SellWithUsPage.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<SellWithUsPage {data} />
