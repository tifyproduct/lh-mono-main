<script lang="ts">
	import type { PageServerData } from './$types';
	import AuthenticityPage from '$lib/pages/AuthenticityPage/AuthenticityPage.svelte';
	export let data: PageServerData;
</script>

<AuthenticityPage {data} />
