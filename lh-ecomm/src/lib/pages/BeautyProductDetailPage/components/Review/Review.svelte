<script lang="ts">
	import { Dropdown, Label, Hr } from 'flowbite-svelte';
	import {
		ArrowDownSLineArrows,
		ArrowLeftSLineArrows,
		ArrowRightSLineArrows,
		ArrowUpDownLineArrows
	} from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import customerProfileStore from '$lib/stores/customerProfileStore';

	import StarReview from './StarReview/StarReview.svelte';
	import ReviewCard from './ReviewCard/ReviewCard.svelte';
	import SimpleReviewCard from './SimpleReviewCard/SimpleReviewCard.svelte';
	import AddReviewModal from './AddReviewModal/AddReviewModal.svelte';
	import ReviewPhotosModal from './ReviewPhotosModal/ReviewPhotosModal.svelte';

	import type { ProductReviews } from '$lib/types/productReview';
	import { onMount } from 'svelte';

	import { page } from '$app/stores';

	export let productId;
	export let reviews: ProductReviews;

	let selectedStarFilter: Array<number> = [];

	let currentPage = 1;
	let itemsPerPage = 3;
	let isUserLoggedIn = false;

	$: parsedReviews = reviews.reviews;

	$: filteredReviews = parsedReviews.filter(
		(review) => selectedStarFilter.length === 0 || selectedStarFilter.includes(review.rating)
	);



	$: paginatedReviews = filteredReviews.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	$: totalPage = filteredReviews ? Math.ceil(filteredReviews.length / itemsPerPage) : 0;

	$: {
		isUserLoggedIn = !!$customerProfileStore?.id;
	}

	let showAddModal = false;
	let showAllReview = false;
	let showReviewPhotosModal = false;

	let sortValue = 'NEWEST';

	const reviewStarItems = [1, 2, 3, 4, 5];

	const reviewSortItems = [
		{ value: 'OLDEST', label: 'Oldest to Newest' },
		{ value: 'NEWEST', label: 'Newest to Oldest' },
		{ value: 'HIGHEST', label: 'Highest Rating' },
		{ value: 'LOWEST', label: 'Lowest Rating' }
	];

	const toggleAddModal = () => {
		showAddModal = !showAddModal;
		document.body.style.overflow = showAddModal ? 'hidden' : '';
		return;
	};

	const toggleViewAllReview = () => {
		showAllReview = !showAllReview;
		document.body.style.overflow = showAllReview ? 'hidden' : '';
	};

	const toggleShowReviewPhotosModal = () => {
		showReviewPhotosModal = !showReviewPhotosModal;
	};

	const applySort = (sort: string) => {
		switch (sort) {
			case 'OLDEST':
				parsedReviews = parsedReviews.sort((a, b) => Date.parse(a.reviewedAt) - Date.parse(b.reviewedAt));
				break;
			case 'NEWEST':
				parsedReviews = parsedReviews.sort((a, b) => Date.parse(b.reviewedAt) - Date.parse(a.reviewedAt));
				break;
			case 'LOWEST':
				parsedReviews = parsedReviews.sort((a, b) => a.rating - b.rating);
				break;
			case 'HIGHEST':
				parsedReviews = parsedReviews.sort((a, b) => b.rating - a.rating);
				break;
		}

		currentPage = 1;
	};

	onMount(() => {
		applySort('NEWEST');
	});

	$: {
		if (isUserLoggedIn && $page.url.searchParams.get('writeReview')) {
			toggleAddModal();
		}
	}

	// Pagination Functions
	const pagination = (c: number, m: number) => {
		let current = c,
			last = m,
			delta = 2,
			left = current - delta,
			right = current + delta + 1,
			range = [],
			rangeWithDots = [],
			l;

		for (let i = 1; i <= last; i++) {
			if (i === 1 || i === last || (i >= left && i < right)) {
				range.push(i);
			}
		}

		for (let i of range) {
			if (l) {
				if (i - l === 2) {
					rangeWithDots.push(l + 1);
				} else if (i - l !== 1) {
					rangeWithDots.push('...');
				}
			}
			rangeWithDots.push(i);
			l = i;
		}

		return rangeWithDots;
	};

	const changePage = (page: number) => {
		if (page >= 1 && page <= totalPage) {
			currentPage = page;
		}
	};
</script>

<div class="container bg-brown-05 lg:bg-white-1">
	<!-- REVIEW HEADER SECTION -->
	<div
		class="flex flex-col items-start lg:flex-row lg:items-center lg:border px-4 py-3 lg:px-8 lg:py-4"
	>
		<div class="flex flex-col lg:block lg:mr-10">
			<Text type="body-1" color="black-9" class="hidden lg:block">Rating and review</Text>
			<Text type="subtitle-3" color="black-9" class="block lg:hidden">Rating and review</Text>
			<div class="py-3">
				<StarReview value={parseFloat(reviews.rating)} showValueText />
			</div>
			<Text type="caption-1" color="black-6">
				{#if reviews.totalReviews > 0}{reviews.totalReviews} reviewers recommend this product
				{/if}
			</Text>
			<div class="lg:hidden mt-3 mb-4">
				<Button disabled={!isUserLoggedIn} variant="secondary" onClick={toggleAddModal}>
					{#if isUserLoggedIn}LEAVE A REVIEW{:else}Sign in to leave a review{/if}
				</Button>
			</div>
		</div>
		{#if reviews.totalReviews > 0}
			<div>
				<Text type="body-1" color="black-9" class="pb-4 hidden lg:block">
					Photo & Video from the customer
				</Text>
				<div class="flex items-center">
					{#each reviews.imageURLs.slice(0, 5) as image, index}
						<img
							class:max-lg:hidden={index > 2}
							class="size-[60px] lg:size-[80px] xl:size-[100px] mr-3 rounded object-center object-cover"
							src="{image}"
							alt="Review"
							role="presentation"
							on:click={toggleShowReviewPhotosModal}
						/>
					{/each}
					<Button variant="link" class="w-24 text-left" onClick={toggleShowReviewPhotosModal}>
						<Text type="body-2" color="beige-10" weight="semibold">VIEW ALL PHOTOS</Text>
					</Button>
				</div>
			</div>
		{/if}
		<div class="hidden lg:block ml-auto">
			<Button disabled={!isUserLoggedIn} variant="primary" onClick={toggleAddModal}>
				{#if isUserLoggedIn}LEAVE A REVIEW{:else}Sign in to leave a review{/if}
			</Button>
		</div>
		<div class="flex overflow-x-scroll custom-scroll pb-5 gap-4 lg:hidden pt-5 w-full">
			{#each parsedReviews.slice(0, 5) as review}
				<div class="shrink-0 basis-11/12">
					<SimpleReviewCard {review} />
				</div>
			{/each}
		</div>
		<div class="lg:hidden pt-5 w-full">
			<Button variant="primary" class="w-full" onClick={toggleViewAllReview}>VIEW ALL</Button>
		</div>
	</div>

	<!-- FILTER & REVIEW SECTION -->
	<div
		class="max-lg:bg-white-1 fixed top-0 z-20 w-full h-full lg:static lg:block"
		class:max-lg:hidden={!showAllReview}
	>
		<div class="lg:hidden">
			<Button variant="link" onClick={toggleViewAllReview} class="flex p-4">
				<ArrowLeftSLineArrows />
				<Text type="body-1" weight="semibold" class="pl-2">
					User Review ({reviews.totalReviews})
				</Text>
			</Button>

			<div class="p-4">
				<Text type="body-1" color="black-9" class="hidden lg:block">Rating and review</Text>
				<Text type="subtitle-3" color="black-9" class="block lg:hidden">Rating and review</Text>
				<div class="py-3">
					<StarReview value={parseFloat(reviews.rating)} showValueText />
				</div>
				<Text type="caption-1" color="black-6">
					{reviews.totalReviews} reviewers recommend this product
				</Text>
			</div>
		</div>

		<div class="flex items-center bg-white-2 lg:my-7 px-4 py-3">
			<div class="flex">
				<div class="mr-2">
					<button class="bg-white-1 flex px-4 py-3 items-center">
						<Text type="body-2" color="black-10" class="pr-2">All Rating</Text>
						<ArrowDownSLineArrows />
					</button>
					<Dropdown class="w-full p-3 space-y-3 text-sm bg-white-1">
						{#each reviewStarItems as item, index}
							<li>
								<label
									for="rating-filter-{index}"
									class="cursor-pointer flex items-center [&:not(:last-child)]:pb-4"
								>
									<input
										id="rating-filter-{index}"
										type="checkbox"
										bind:group={selectedStarFilter}
										name="rating-filters"
										value={index + 1}
										class="mr-2 border-black-9 bg-white-1 rounded-none pr-1 text-dark-brown-10 focus:ring-dark-brown-10"
									/>
									<div class="flex">
										<StarReview value={index + 1} />
										({item})
									</div>
								</label>
							</li>
						{/each}
					</Dropdown>
				</div>
				<div>
					<button class="bg-white-1 flex px-4 py-3 items-center">
						<Text type="body-2" color="black-10" class="pr-2">
							{reviewSortItems.find((r) => r.value === sortValue)?.label}
						</Text>
						<ArrowUpDownLineArrows />
					</button>
					<Dropdown class=" p-3 space-y-3 text-sm bg-white-1 w-full">
						{#each reviewSortItems as item}
							<li>
								<Label class="flex items-center [&:not(:last-child)]:pb-4">
									<input
										type="radio"
										bind:group={sortValue}
										name="sortBy"
										value={item.value}
										on:input={() => {
											applySort(item.value);
										}}
										class="mr-2 border-black-9 bg-white-1 rounded-none pr-1 text-dark-brown-10 focus:ring-dark-brown-10"
									/>
									<div class="flex">
										<Text type="body-2" class="pr-1">{item.label}</Text>
									</div>
								</Label>
							</li>
						{/each}
					</Dropdown>
				</div>
			</div>
			<div class="ml-auto">
				<Text type="body-2" color="black-7">{reviews.totalReviews || 0} Reviews</Text>
			</div>
		</div>
		<div
			class="lg:pt-5 lg:px-4 max-lg:bg-white-2 max-lg:overflow-y-scroll max-lg:h-[calc(100vh-210px)] max-lg:pb-[100px]"
		>
			{#if showAllReview}
				{#each filteredReviews as review}
					<div class="max-lg:mb-2 bg-white-1 max-lg:px-4 max-lg:py-5">
						<ReviewCard {review} />
					</div>
					<Hr hrClass="my-6 max-lg:hidden" />
				{/each}
			{:else}
				{#each paginatedReviews as review}
					<div class="max-lg:mb-2 bg-white-1 max-lg:px-4 max-lg:py-5">
						<ReviewCard {review} />
					</div>
					<Hr hrClass="my-6 max-lg:hidden" />
				{/each}
			{/if}
		</div>
		<div class="container flex items-center justify-center gap-3">
			<ArrowLeftSLineArrows
				class="w-6 h-6 cursor-pointer"
				on:click={() => changePage(currentPage - 1)}
			/>

			<div class="flex">
				{#each pagination(currentPage, totalPage) as item}
					{#if typeof item === 'number'}
						<div
							class={`cursor-pointer py-2 px-4 rounded ${item === currentPage ? 'bg-brown-05' : ''}`}
							role="presentation"
							on:click={() => changePage(item)}
						>
							<Text type="body-2" color="black-6">
								{item}
							</Text>
						</div>
					{:else}
						<Text class="py-2 px-4" type="body-2" color="black-6">{item}</Text>
					{/if}
				{/each}
			</div>

			<ArrowRightSLineArrows
				class="w-6 h-6 cursor-pointer"
				on:click={() => changePage(currentPage + 1)}
			/>
		</div>

		<div class="w-full lg:hidden fixed bottom-0 left-0 bg-white-1 p-2">
			<Button disabled={!isUserLoggedIn} class="w-full" variant="primary" onClick={toggleAddModal}>
				{#if isUserLoggedIn}LEAVE A REVIEW{:else}Sign in to leave a review{/if}
			</Button>
		</div>
	</div>
	{#if showAddModal}
		<AddReviewModal {productId} on:close-modal={toggleAddModal} />
	{/if}

	<ReviewPhotosModal
		isOpen={showReviewPhotosModal}
		onClose={() => (showReviewPhotosModal = false)}
		images={reviews.imageURLs}
	/>
</div>
