<script>
	import Hero from '$lib/pages/SellWithUsPage/components/Hero/Hero.svelte';
	import HowItWorks from '$lib/pages/SellWithUsPage/components/HowItWorks/HowItWorks.svelte';
	import WhySellWithUs from '$lib/pages/SellWithUsPage/components/WhySellWithUs/WhySellWithUs.svelte';
	import Value from '$lib/pages/SellWithUsPage/components/Value/Value.svelte';
	// import ThoseWhoSell from '$lib/pages/SellWithUsPage/components/ThoseWhoSell/ThoseWhoSell.svelte';
	import FAQ from '$lib/pages/SellWithUsPage/components/FAQ/FAQ.svelte';
	import Video from '$lib/pages/SellWithUsPage/components/Video/Video.svelte';
	import Earnings from '$lib/pages/SellWithUsPage/components/Earnings/Earnings.svelte';
	import HighDemand from '$lib/pages/SellWithUsPage/components/HighDemand/HighDemand.svelte';
	import { pathname } from '$lib/pages/SellWithUsPage/urlStore';

	export let data;
	let filteredTopPicks = data.topPicks.filter((item) => item.title === 'Watches');
</script>

<Hero credential={data.credentialSoc} />
<HowItWorks credential={data.credentialSoc} />
<WhySellWithUs />
{#if !($pathname.includes('trade-in') || $pathname.includes('direct-sell'))}
	<Earnings credential={data.credentialSoc} />
{/if}
<Value />
<HighDemand items={filteredTopPicks} />
<!-- <ThoseWhoSell /> -->
<!-- <Video /> -->
<FAQ />
