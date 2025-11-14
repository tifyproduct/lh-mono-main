<script lang="ts">
	import TestimonialsPage from '$lib/pages/TestimonialsPage/TestimonalsPage.svelte';
	import type { PageServerData } from './$types';
	export let data: PageServerData;
</script>

<TestimonialsPage {data} />
