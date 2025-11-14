<script lang="ts">
	import SurabayaExclusiveDeal from '$lib/pages/ExclusiveDealPage/ExclusiveDeal/SurabayaExclusiveDeal/SurabayaExclusiveDeal.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<SurabayaExclusiveDeal {data} />
