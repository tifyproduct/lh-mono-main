<script>
	import Text from '$lib/components/Text/Text.svelte';
	export let slides = [];
	let currentIndex = 0;

	function nextSlide() {
		currentIndex = (currentIndex + 1) % slides.length;
	}

	function prevSlide() {
		currentIndex = (currentIndex - 1 + slides.length) % slides.length;
	}
</script>

<div class="container mt-8 mb-8 max-w-[1600px]">
	<Text
		type="subtitle-1"
		weight="semibold"
		class="mx-auto block text-center text-xl md:text-3xl pb-4 pt-4 mt-8"
	>
		Our Equipments
	</Text>

	<Text
		type="body-1"
		class="mx-auto block text-center md:text-base max-w-3xl font-bold pb-4 p-4"
		color="black-5"
	>
		We use expert knowledge and advanced technology to ensure each watch's authenticity, giving you
		confidence and peace of mind with your luxury timepiece investment.
	</Text>
	<div class="flex flex-col md:flex-row place-items-center mt-4">
		<div class="slider relative w-full md:w-[50%] mb-8 md:mb-0">
			{#each slides as slide, index}
				<div
					class="min-w-full slide {index === currentIndex
						? 'active'
						: ''} w-100 h-100 flex items-center justify-center overflow-hidden"
					style="display: {index === currentIndex ? 'flex' : 'none'}"
				>
					<img
						src={slide.image}
						alt={slide.title}
						class="object-cover w-[350px] md:w-[600px] h-[200px] md:h-[400px] rounded"
					/>
				</div>
			{/each}

			<div
				class="nav-prev absolute top-1/2 transform -translate-y-1/2 cursor-pointer p-3 bg-white-1 rounded-[60px]"
				on:click={prevSlide}
			>
				<svg width="20" height="20" viewBox="0 0 20 20">
					<path
						d="M9.02366 9.99999L13.1487 14.125L11.9703 15.3033L6.66699 9.99999L11.9703 4.69666L13.1487 5.87499L9.02366 9.99999Z"
						fill="#24252B"
					/>
				</svg>
			</div>

			<div
				class="nav-next absolute top-1/2 right-0 transform -translate-y-1/2 cursor-pointer p-3 bg-white-1 rounded-[60px]"
				on:click={nextSlide}
			>
				<svg width="20" height="20" viewBox="0 0 20 20">
					<path
						d="M10.9766 9.99999L6.85156 5.87499L8.0299 4.69666L13.3332 9.99999L8.0299 15.3033L6.85156 14.125L10.9766 9.99999Z"
						fill="#24252B"
					/>
				</svg>
			</div>

			<div class="pagination flex justify-center mt-4">
				{#each slides as _, i}
					<span
						class="w-3 h-3 rounded-full mx-1 cursor-pointer transition-all duration-300 {i ===
						currentIndex
							? 'bg-black-10'
							: 'bg-black-3'}"
						on:click={() => (currentIndex = i)}
					></span>
				{/each}
			</div>
		</div>
		<div class="w-full md:w-[50%] md:ml-8 px-4 grid">
			<Text type="body-1" weight="semibold">{slides[currentIndex].title}</Text>
			<Text type="body-2" color="black-5">{slides[currentIndex].description}</Text>
		</div>
	</div>
</div>
