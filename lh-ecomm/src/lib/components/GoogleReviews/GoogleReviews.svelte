<script lang="ts">
	import { Rating, Star } from 'flowbite-svelte';

	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { goto } from '$app/navigation';

	export let review;

	let scrollContainer: HTMLDivElement;

	const scrollLeft = () => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
		}
	};

	const scrollRight = () => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
		}
	};

	async function writeReview() {
		alert('yo');
		await goto(
			'https://www.google.com/search?client=safari&rls=en&q=luxehouze&ie=UTF-8&oe=UTF-8#lrd=0x2e69f1caf09286f3:0x52151010bc8c4e8e,3,,,,'
		);
	}
</script>

<div class="flex flex-col xl:flex-row gap-4 xl:gap-5 justify-center max-w-screen px-4">
	<div>
		<div class="flex flex-col gap-2 xl:gap-3 justify-start -ml-2">
			<Text type="body-1" color="black-9">WHAT OUR CUSTOMERS SAY</Text>
			<div class="flex items-center gap-2">
				<Rating size={32} total={5} rating={review.average} icon={Star} />
				<span class="font-semibold text-black-6">{review.average}</span>
			</div>
			<div class="flex items-center gap-4">
				<Text color="black-6" type="caption-1">Based on {review.total} review on</Text>
				<img src="/icons/google.svg" class="w-[62px] h-[20px]" alt="google" />
			</div>
		</div>
		<div class="hidden xl:block mt-4">
			<a
				target="_blank"
				class="text-sm font-medium text-center px-3 py-3 rounded w-full xl:w-auto bg-dark-brown-10 text-white-1"
				href="https://www.google.com/search?client=safari&rls=en&q=luxehouze&ie=UTF-8&oe=UTF-8#lrd=0x2e69f1caf09286f3:0x52151010bc8c4e8e,3,,,,"
			>
				LEAVE A REVIEW
			</a>
		</div>
	</div>
	<div class="flex items-center max-w-full xl:max-w-[980px]">
		<button on:click={scrollLeft} class="cursor-pointer hidden xl:block">
			<ArrowLeftSLineArrows />
		</button>
		<div
			bind:this={scrollContainer}
			class="flex gap-4 overflow-auto snap-mandatory snap-x custom-scrollbar pb-5"
		>
			{#each review.reviews as rvw}
				<div class="bg-white-2 rounded-lg snap-start">
					<div class="w-[300px] p-4">
						<Rating size={20} total={5} rating={Number(rvw.rating)} icon={Star} />

						<div class="mt-[5px]">
							<Text class="line-clamp-3" title={rvw.description} type="body-1" color="black-10">
								{rvw.description}
							</Text>
						</div>
						<div class="mt-[5px]">
							<Text type="caption-1" color="black-6">{rvw.name}, {rvw.relatedTime}</Text>
						</div>
					</div>
				</div>
			{/each}
		</div>
		<button on:click={scrollRight} class="cursor-pointer hidden xl:block">
			<ArrowRightSLineArrows />
		</button>
	</div>
	<div class="block xl:hidden">
		<a
			target="_blank"
			class="block text-center px-3 py-2 rounded w-full xl:w-auto bg-dark-brown-10 text-white-1"
			href="https://www.google.com/search?client=safari&rls=en&q=luxehouze&ie=UTF-8&oe=UTF-8#lrd=0x2e69f1caf09286f3:0x52151010bc8c4e8e,3,,,,"
		>
			LEAVE A REVIEW
		</a>
	</div>
</div>
