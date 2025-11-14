<script lang="ts">
	import type { PageServerData } from './$types';

	import CustomerProfileSidebar from '$lib/pages/CustomerProfile/CustomerProfileSidebar.svelte';

	export let data: PageServerData;
</script>

<div class="mt-8">
	<CustomerProfileSidebar customer={data.customer} />
</div>
