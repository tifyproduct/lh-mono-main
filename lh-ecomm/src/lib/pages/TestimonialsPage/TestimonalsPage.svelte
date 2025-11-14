<script>
	import Trusted from '$lib/pages/TestimonialsPage/components/Trusted/Trusted.svelte';
	import Testimonials from '$lib/pages/TestimonialsPage/components/Testimonials/Testimonials.svelte';
	import SGTestimonials from '$lib/pages/TestimonialsPage/components/SGTestimonials/SGTestimonials.svelte';
	import GoogleReviews from '$lib/components/GoogleReviews/GoogleReviews.svelte';
	import News from '$lib/pages/TestimonialsPage/components/News/News.svelte';
	export let data;
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	const currentPage = get(page);
	const store = currentPage.params.store;
</script>

<Trusted />
<div class="container max-w-[1600px]">
	{#if store === 'id'}
		<Testimonials />
	{:else}
		<SGTestimonials />
	{/if}
</div>
<News />
<div class="bg-white py-10 lg:pt-10 lg:pb-20">
	<GoogleReviews review={data.googleReview} />
</div>
