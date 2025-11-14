<script>
	import Text from '$lib/components/Text/Text.svelte';
</script>

<div class="container max-w-[1600px]">
	<div class="text-center grid mx-auto md:p-20 p-4">
		<Text color="black-10" type="title-3" weight="semibold">
			YOUR TRUSTED LUXURY GOODS MARKETPLACE
		</Text>
		<Text type="body-1" class="mt-4 md:mt-8 text-left md:text-center">
			Luxehouze is the leading luxury goods marketplace that specializes in authentic high-end
			watches & leather goods.
		</Text>
		<div class="flex flex-col md:flex-row gap-8 md:gap-20 content-center justify-center mt-8">
			<div class="rounded grid text-left w-full md:max-w-[50%] border p-10">
				<Text weight="semibold" type="body-1">Vision</Text>
				<div class="mt-4 h-[60px]">
					<Text type="body-2">To be the world's leading platform for all things luxury-related</Text
					>
				</div>
			</div>
			<div class="rounded grid text-left w-full md:max-w-[50%] border p-10">
				<Text weight="semibold" type="body-1">Mission</Text>
				<div class="mt-4 h-[60px]">
					<Text type="body-2">
						To create a safe and transparent platform, while providing superior end-to-end customer
						experience
					</Text>
				</div>
			</div>
		</div>
	</div>
</div>
