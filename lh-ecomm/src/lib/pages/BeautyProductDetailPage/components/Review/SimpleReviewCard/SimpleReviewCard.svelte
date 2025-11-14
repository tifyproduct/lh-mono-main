<script lang="ts">
	import StarReview from '../StarReview/StarReview.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import { afterUpdate } from 'svelte';
	import Button from '$lib/components/Button/Button.svelte';

	export let review;

	let isExpanded = false;
	let showMoreButton = false;

	let reviewRef: HTMLSpanElement | null = null;

	const toggleExpand = () => {
		isExpanded = !isExpanded;
	};

	const checkIfClamped = () => {
		if (reviewRef) {
			const isClamped = reviewRef.scrollHeight > reviewRef.clientHeight;
			showMoreButton = isClamped;
		}
	};

	afterUpdate(() => {
		checkIfClamped();
	});
</script>

<div class="flex flex-col bg-white-1 p-4 rounded">
	<StarReview value={review.rating} />
	<Text type="body-1" class="py-1">
		<span class:line-clamp-5={!isExpanded} bind:this={reviewRef}>{review.description}</span>
	</Text>
	{#if showMoreButton}
		<div>
			<Button variant="link" padding="p-0" onClick={toggleExpand}>
				<Text type="body-2" color="beige-10" weight="semibold">
					{isExpanded ? 'Show less' : 'Show more'}
				</Text>
			</Button>
		</div>
	{/if}

	<Text type="body-2" color="black-6">{review.reviewerName}, {review.createdAt}</Text>
</div>
