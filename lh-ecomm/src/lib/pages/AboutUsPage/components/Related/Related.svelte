<script>
	import Text from '$lib/components/Text/Text.svelte';
	import { ArrowRightLineArrows } from 'svelte-remix';
	import { page } from '$app/stores';

	const baseParams = `/${$page.params.store}/${$page.params.lang}`;

	const links = [
		{
			title: 'VISIT US',
			description: 'Come and see our available stores waiting for your visit!',
			url: `${baseParams}/visit-us`
		},
		{
			title: 'ABOUT US',
			description: 'Want to know more about our Company?',
			url: `${baseParams}/about-us`
		},
		{
			title: 'FAQS',
			description: 'Still have more questions? We might have just the right answers for you',
			url: `${baseParams}/faqs`
		}
	];
</script>

<div class="container max-w-[1600px]">
	<div class="bg-black-1 p-8">
		<div class="flex items-center justify-between px-4 py-4">
			<Text type="subtitle-2" weight="semibold">RELATED</Text>
			<div class="flex-1 mx-4">
				<hr class="bg-black-2 h-1 w-full" />
			</div>
		</div>
		<div class="md:flex md:justify-between md:space-x-4">
			{#each links as link}
				<div class="flex-1 border border-black-2 p-8 mt-4 grid rounded">
					<Text weight="bold" type="subtitle-3">{link.title}</Text>
					<Text type="body-2" class="mt-2">{link.description}</Text>
					<a href={link.url} class="flex mt-4 gap-2 font-bold">
						<Text weight="semibold" type="body-1">Visit Page</Text>
						<ArrowRightLineArrows />
					</a>
				</div>
			{/each}
		</div>
	</div>
</div>
