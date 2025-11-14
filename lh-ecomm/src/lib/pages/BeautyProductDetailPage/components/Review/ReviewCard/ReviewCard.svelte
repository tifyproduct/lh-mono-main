<script lang="ts">
	import StarReview from '../StarReview/StarReview.svelte';
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { afterUpdate } from 'svelte';
	import { DateTime } from 'luxon';
	import type { ReviewResponse } from '$lib/types/productReview';


	export let review: ReviewResponse;

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

<div class="max-lg:flex-col lg:flex">
	<div class="w-full lg:w-1/4 flex lg:flex-col max-lg:flex-wrap">
		{#key review.rating}
			<span class="max-lg:order-1 max-lg:w-1/2 shrink-0">
				<StarReview value={review.rating} showValueText />
			</span>
		{/key}
		<Text type="body-1" weight="semibold" class="lg:py-4 max-lg:pt-2  max-lg:w-full max-lg:order-3">
			{review.reviewerName}
		</Text>
		<Text
			class="max-lg:order-2 max-lg:text-right max-lg:w-1/2 shrink-0 "
			type="caption-1"
			color="black-6"
			>{DateTime.fromISO(review.reviewedAt).setZone('Asia/Jakarta').toRelativeCalendar()}</Text
		>
	</div>
	<div class="w-full max-lg:pt-4 lg:pb-4 lg:w-3/4">
		<Text type="body-1">
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

		{#if review.presignedURLs.length > 0}
			<div class="flex pt-4">
				<!--				FIXME: show image gallery when thumbnail is clicked -->
				{#each review.presignedURLs as image}
					<img
						class="size-[60px] lg:size-[100px] mr-3 rounded object-cover object-center"
						src="{image}"
						alt=""
					/>
				{/each}
			</div>
		{/if}
	</div>
</div>
