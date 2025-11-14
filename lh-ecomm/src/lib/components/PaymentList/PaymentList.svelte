<script>
	import { AccordionItem, Accordion } from 'flowbite-svelte';
	export let icon;
	export let title;
	export let subtitle;
</script>

<AccordionItem paddingFlush="py-0">
	<div slot="header" class="flex items-center mb-5 mt-5 gap-3">
		<img src={icon} alt="payment-icon" class="mr-2" />
		<div>
			<h2 class="font-semibold text-black text-[14px] lg:text-[16px]">{title}</h2>
			<p class="text-gray-500 text-[12px] lg:text-[14px]">
				{subtitle}
			</p>
		</div>
	</div>

	<div class="text-[14px] text-black-7 bg-white-2 py-[16px] px-[24px] border-b border-[#E9EBF0]">
		<slot></slot>
		<!-- Untuk konten yang lebih kompleks -->
	</div>
</AccordionItem>
