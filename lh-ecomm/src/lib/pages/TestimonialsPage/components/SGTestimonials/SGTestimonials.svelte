<script lang="ts">
	import { Gallery } from 'flowbite-svelte';
	import { ArrowLeftSLineArrows, ArrowRightSLineArrows } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import { afterUpdate } from 'svelte';

	const testimonials = [
		{
			name: 'Sabrina',
			socialMedia: '@sabrinamarican',
			socialMediaUrl: '',
			occupation: 'Content Creator',
			testimony:
				'For me, one of the most important things to create a perfect look is a perfect bag. Luxehouze has a great selection of luxury bags, and stocks some of my favorite Hermes bags which I think are versatile & timeless - and all are 100% genuine!',
			image:
				'https://cdn.shopify.com/s/files/1/0549/3243/9112/files/sg-customer-reviews-2_1.webp?v=1702278341'
		},
		{
			name: 'Alvin Chong',
			socialMedia: '@watchrology',
			socialMediaUrl: '',
			occupation: 'Horology Enthusiast',
			testimony: 'Luxehouze has a great selection of luxury watches and a wide range of services.',
			image:
				'https://cdn.shopify.com/s/files/1/0549/3243/9112/files/sg-customer-review_1.jpg?v=1702278377'
		},
		{
			name: 'Jack Wong',
			socialMedia: '@jackwongyf',
			socialMediaUrl: '',
			occupation: 'Horology Enthusiast',
			testimony:
				'Browsing Luxehouze’s collection was captivating - they even have pieces such as the Rolex Rainbow Daytona that is usually only available to VIP buyers. Their Concierge Service is a great help when you’re looking to track down hard-to-get pieces.',
			image:
				'https://cdn.shopify.com/s/files/1/0549/3243/9112/files/sg-customer-reviews-3.jpg?v=1702278408'
		},
		{
			name: 'Arnold Poernomo',
			socialMedia: '@arnoldpo',
			socialMediaUrl: '',
			occupation: 'Chef & Entrepreneur',
			testimony:
				'Luxehouze’s service is top-notch. I personally recommend Luxehouze as a marketplace for your luxury needs',
			image: '/img/testimonial/arnold_poernomo.webp'
		},
		{
			name: 'Rio Wibowo',
			socialMedia: '@riomotret',
			socialMediaUrl: '',
			occupation: 'Celebrity Photographer',
			testimony:
				'Luxehouze has now become my preferred luxury marketplace because they offer a fast & easy buying or selling experience - and of course, the guarantee that the items sold are 100% authentic.',
			image: '/img/testimonial/rio_wibowo.webp'
		},
		{
			name: 'Alessandro Georgie',
			socialMedia: '@alegeor',
			socialMediaUrl: '',
			occupation: 'Fashion Influencer',
			testimony:
				'While I’m looking around the boutique I’m accompanied by their Client Advisor who assures me that all the luxury items sold here are guaranteed 100% authentic.',
			image: '/img/testimonial/alessandro_georgie.webp'
		}
	];

	let isExpanded = false;
	let isExpandedMobile = false;
	let showMoreButton = false;

	const toggleExpand = () => {
		isExpanded = !isExpanded;
	};

	let testimonyRef: HTMLSpanElement | null = null;
	let testimonyRefMobile: HTMLSpanElement | null = null;

	const checkIfClamped = () => {
		if (testimonyRef) {
			const isClamped = testimonyRef.scrollHeight > testimonyRef.clientHeight;
			showMoreButton = isClamped;
		}

		if (testimonyRefMobile) {
			const isClamped = testimonyRefMobile.scrollHeight > testimonyRefMobile.clientHeight;
			showMoreButtonMobile = isClamped;
		}
	};

	afterUpdate(() => {
		checkIfClamped();
	});

	let scrollContainer: HTMLDivElement;
	let scrollItem: HTMLDivElement;

	const scroll = (howMuch: number) => {
		if (scrollContainer) {
			scrollContainer.scrollBy({ left: howMuch, behavior: 'smooth' });
		}
	};
</script>

<div class="bg-white-2 py-10 px-3">
	<div class="lg:text-center pb-10">
		<h3 class="text-black-9 text-sm lg:text-3xl font-semibold">WHAT THEY LOVE ABOUT US</h3>
	</div>

	<div class="relative container max-w-[900px]">
		<ArrowLeftSLineArrows
			size={24}
			class="z-50 absolute top-1/4 lg:top-1/2 left-5 lg:-left-5 cursor-pointer -translate-x-1/2 -translate-y-1/2"
			on:click={() => {
				scroll(-scrollItem.offsetWidth);
			}}
		/>
		<ArrowRightSLineArrows
			size={24}
			class="z-50 absolute top-1/4 lg:top-1/2 right-5 lg:-right-5 cursor-pointer translate-x-1/2 -translate-y-1/2"
			on:click={() => {
				scroll(scrollItem.offsetWidth);
			}}
		/>
		<div
			bind:this={scrollContainer}
			class="grid grid-flow-col container lg:max-w-full lg:w-[900px] relative overflow-x-scroll custom-scrollbar snap-mandatory snap-x lg:flex gap-5 px-4 py-4 lg:px-0 lg:py-5 z-10"
		>
			<!-- Desktop -->
			{#each testimonials as testimonial}
				<div
					bind:this={scrollItem}
					class="flex flex-col lg:flex-row w-[100vw] lg:w-[900px] justify-center items-center gap-8 snap-center"
				>
					<div>
						<Gallery class="w-[330px] justify-center">
							<img
								src={testimonial.image}
								alt={testimonial.name}
								class="w-[211px] lg:w-[330px] lg:h-[330px] rounded object-cover"
							/>
						</Gallery>
					</div>
					<div class="px-5 max-w-[350px] lg:max-w-full lg:w-[525px]">
						<div
							class:line-clamp-5={!isExpanded}
							bind:this={testimonyRef}
							class="text-sm lg:text-base"
						>
							<p class="text-black-7">{testimonial.testimony}</p>
						</div>

						{#if showMoreButton}
							<div>
								<Button variant="link" padding="p-0" onClick={toggleExpand}>
									<Text type="body-2" color="beige-10" weight="semibold">
										{isExpanded ? 'Show less' : 'Show more'}
									</Text>
								</Button>
							</div>
						{/if}

						<div class="mt-[20px]">
							<Text type="body-2" color="black-9" weight="semibold">
								{testimonial.name}
							</Text>
						</div>
						<div>
							<Text type="caption-1" color="black-5">
								{testimonial.occupation} • {testimonial.socialMedia}
							</Text>
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>

<style>
	.ellipsis-text {
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 5;
		line-clamp: 5;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.testimonial-container {
		position: relative;
		width: 100%;
		height: auto;
		overflow: hidden;
	}

	.testimonial-content {
		transition: opacity 0.5s ease;
	}

	.testimonial-content.fade-enter,
	.testimonial-content.fade-exit {
		opacity: 0;
	}

	.testimonial-content.fade-enter-active,
	.testimonial-content.fade-exit-active {
		opacity: 1;
	}

	.testimonial-content.slide-enter-next {
		animation: slideInRight 0.5s forwards;
	}

	.testimonial-content.slide-exit-next {
		animation: slideOutLeft 0.5s forwards;
	}

	.testimonial-content.slide-enter-prev {
		animation: slideInLeft 0.5s forwards;
	}

	.testimonial-content.slide-exit-prev {
		animation: slideOutRight 0.5s forwards;
	}

	@keyframes slideInRight {
		from {
			transform: translateX(100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes slideOutLeft {
		from {
			transform: translateX(0);
			opacity: 1;
		}
		to {
			transform: translateX(-100%);
			opacity: 0;
		}
	}

	@keyframes slideInLeft {
		from {
			transform: translateX(-100%);
			opacity: 0;
		}
		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	@keyframes slideOutRight {
		from {
			transform: translateX(0);
			opacity: 1;
		}
		to {
			transform: translateX(100%);
			opacity: 0;
		}
	}
</style>
