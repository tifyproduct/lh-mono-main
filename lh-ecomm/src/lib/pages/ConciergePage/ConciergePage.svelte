<script lang="ts">
	import Hero from '$lib/pages/ConciergePage/components/Hero/Hero.svelte';
	import USP from '$lib/pages/ConciergePage/components/USP/USP.svelte';
	import Collection from '$lib/pages/ConciergePage/components/Collection/Collection.svelte';
	import PreOrder from '$lib/pages/ConciergePage/components/PreOrder/PreOrder.svelte';
	import HowToApply from '$lib/pages/ConciergePage/components/HowToApply/HowToApply.svelte';
	export let data;
</script>

<Hero />
<USP />
<PreOrder items={data.topPicks} />
<HowToApply />
<Collection />
