<script lang="ts">
	import CollectionPage from '$lib/pages/CollectionPage/CollectionPage.svelte';
	import CollectionPageV2 from '$lib/pages/CollectionPage/CollectionPageV2.svelte';
	import { get } from 'svelte/store';

	import type { PageServerData } from './$types';
	import { featureFlagStore } from '$lib/stores/featureFlag';

	export let data: PageServerData;

	const featureFlags = get(featureFlagStore);
</script>

{#if featureFlags.collectionPageV2}
	<CollectionPageV2 {data} />
{:else}
	<CollectionPage {data} />
{/if}
