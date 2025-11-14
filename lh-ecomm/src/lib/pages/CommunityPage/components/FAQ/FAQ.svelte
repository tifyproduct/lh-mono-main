<script>
	import Text from '$lib/components/Text/Text.svelte';
	export let faqs = [];
	let openAccordion = null;

	function toggleAccordion(id) {
		openAccordion = openAccordion === id ? null : id;
	}
</script>

<div class="container max-w-[1600px]">
	<div class="bg-[#E9EBF0] overflow-hidden">
		<div class="flex items-center justify-between px-4 py-4">
			<Text weight="semibold" class="text-xl md:text-2xl">FAQ</Text>
			<div class="flex-1 mx-4">
				<hr class="bg-[#D0D4E0] h-1 w-full" />
			</div>
			<a class="text-xs" href="#">VIEW ALL</a>
		</div>

		<div class="flex flex-wrap -mx-3 bg-[#E9EBF0] px-4 py-4">
			{#each faqs as faq, index}
				<div class="w-full md:w-1/2 px-3 mb-6">
					<div
						on:click={() => toggleAccordion(index)}
						class="cursor-pointer p-4 rounded bg-[#FFFFFF] flex justify-between"
					>
						<h2 class="text-XL font-semibold">{faq.title}</h2>
						<svg
							class="w-6 h-6 transition-transform duration-300 {openAccordion === index
								? 'transform rotate-180'
								: ''}"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M19 9l-7 7-7-7"
							></path>
						</svg>
					</div>
					{#if openAccordion === index}
						<div class="bg-[#FFFFFF] px-4 py-2">
							<p class="text-gray-600">{@html faq.content}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
