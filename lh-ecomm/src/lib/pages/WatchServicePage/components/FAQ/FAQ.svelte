<script lang="ts">
	import Text from '$lib/components/Text/Text.svelte';

	interface FAQ {
		title: string;
		content: string;
	}

	export let faqs: FAQ[] = [];

	let openAccordion: string | null = null;

	const toggleAccordion = (id: string): void => {
		openAccordion = openAccordion === id ? null : id;
	};
</script>

<div class="bg-black-1 overflow-hidden container max-w-[1600px]">
	<Text
		type="subtitle-2"
		weight="semibold"
		class="mx-auto block text-xl md:text-3xl pb-4 pt-4 px-4"
	>
		FAQ
	</Text>
	<div class="flex flex-wrap -mx-3 bg-black-1 px-4 py-4">
		{#each faqs as faq, index}
			<div class="w-full md:w-1/2 px-3 mb-6">
				<div
					on:click={() => toggleAccordion(index.toString())}
					class="cursor-pointer p-4 rounded-none bg-[#FFFFFF] flex justify-between"
				>
					<h2 class="text-lg font-semibold">{faq.title}</h2>
					<svg
						class="w-6 h-6 transition-transform duration-300 {openAccordion === index.toString()
							? 'transform rotate-180'
							: ''}"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"
						></path>
					</svg>
				</div>
				{#if openAccordion === index.toString()}
					<div class="bg-white-1 px-4 py-2">
						<Text type="body-1" color="black-8">{faq.content}</Text>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
