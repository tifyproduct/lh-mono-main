<script>
	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';
	import Image from '$lib/assets/static/about-us/guarantee.webp';
	import { ArrowRightLineArrows } from 'svelte-remix';
	import { page } from '$app/stores';

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;
	const AuthenticityUrl = `${baseParams}/authenticity`;
</script>

<div class="container max-w-[1600px]">
	<div
		class="flex flex-col-reverse lg:flex-row items-center justify-center py-16 bg-white-2 p-8 lg:p-20"
	>
		<div class="w-full lg:w-[50%] p-2 mb-8 lg:mb-0">
			<img src={Image} alt="Authenticity Guarantee" class="w-full lg:w-auto rounded" />
		</div>
		<div class="w-full lg:w-[50%] p-2 lg:p-20">
			<Text type="body-2" color="black-9" class="!text-center">
				We guarantee that all luxury goods being sold through our platform are 100% authentic
				through rigorous multi-step verification and authentication processes done by our team of
				experts.
			</Text>

			<Button
				variant="link"
				href={AuthenticityUrl}
				class="px-4 py-2 md:p-4 bg-black-9 text-white-1 gap-4 mt-4 items-center text-left justify-center lg:justify-start"
				>Learn More About Our Authenticity Guarantee
				<ArrowRightLineArrows /></Button
			>
		</div>
	</div>
</div>
