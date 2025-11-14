<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Related from '$lib/pages/PromotionsPage/components/Collections/Collections.svelte';
	export let promotion;
	export let items;
	const modifiedFreetext = promotion?.freetext?.htmlContent
		.replace(/<p>(.*?)<\/p>/g, '<p>$1</p><br>')
		.replace(/<ul>/g, '<ul style="list-style-type: disc; padding-left: 20px;">')
		.replace(/<li>/g, '<li style="margin-bottom: 8px;">')
		.replace(/<b>(.*?)<\/b>/g, '<strong style="color: #24252b; font-size: 20px;">$1</strong>');

	const modifiedAdditionalText = promotion?.additionalText?.htmlContent
		?.replace(/<p>(.*?)<\/p>/g, '<p>$1</p><br>')
		.replace(/<ul>/g, '<ul style="list-style-type: disc; padding-left: 20px;">')
		.replace(/<li>/g, '<li style="margin-bottom: 8px;">')
		.replace(/<b>(.*?)<\/b>/g, '<strong style="color: #24252b; font-size: 20px;">$1</strong>');
</script>

<div class="container max-w-[1600px] md:p-20 p-4">
	<div class="max-w-lg mx-auto grid">
		<img
			src={promotion?.image.url}
			alt={promotion?.image.altText || 'Promotion Image'}
			width="100%"
			class="h-full object-cover rounded"
		/>
		<Text type="subtitle-2" weight="semibold" class="mt-8">
			{promotion?.title?.value}
		</Text>
		<div class="text-sm text-[#858895] mt-4 text-justify">{@html modifiedFreetext}</div>
		{#if promotion?.tnc && promotion?.tnc.value}
			<Text type="subtitle-2" color="black-9" weight="semibold">Terms and Conditions</Text>
			<ul class="list-disc pl-5 mt-4">
				{#each promotion?.tnc.value.split('\n') as line}
					<li><Text type="body-2" color="black-5">{line}</Text></li>
				{/each}
			</ul>
		{/if}
		{#if promotion?.additionalText && promotion?.additionalText.value}
			<div class="text-sm text-[#858895] mt-4 text-justify">
				{@html modifiedAdditionalText}
			</div>
		{/if}
	</div>
</div>
<Related {items} />
