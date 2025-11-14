<script lang="ts">
	import CollectionPage from '$lib/pages/CollectionPage/CollectionPage.svelte';
	import { get } from 'svelte/store';

	import type { PageServerData } from '../../skin-type/[handle]/$types';
	import { featureFlagStore } from '$lib/stores/featureFlag';
	import CollectionPageV2 from '$lib/pages/CollectionPage/CollectionPageV2.svelte';

	export let data: PageServerData;

	const featureFlags = get(featureFlagStore);
</script>

{#if featureFlags.collectionPageV2}
	<CollectionPageV2 {data} />
{:else}
	<CollectionPage {data} />
{/if}
