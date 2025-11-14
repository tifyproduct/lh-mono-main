<script lang="ts">
	import type { LayoutServerData } from '../carts/$types';

	import '$lib/styles/app.css';

	import Header from '$lib/layout/Header.svelte';
	import Footer from '$lib/layout/Footer.svelte';

	import FloatingWhatsappButton from '$lib/components/FloatingWhatsappButton/FloatingWhatsappButton.svelte';
	import AnnouncementBar from '$lib/components/AnnouncementBar/AnnouncementBar.svelte';

	export let data: LayoutServerData;
</script>

<div class="hidden lg:block">
	<AnnouncementBar />

	<Header
		withCart={false}
		credentialSoc={data.credentialSoc}
		customer={data.customer}
		megaMenuData={data.menu}
		cart={data.cart}
		isProduction={data.isProduction}
	/>
</div>
<main>
	<slot />
</main>
<div class="hidden lg:block">
	<Footer footerData={data.footer} />
</div>
<div class="hidden lg:block">
	<FloatingWhatsappButton customer={data.customer} />
</div>
