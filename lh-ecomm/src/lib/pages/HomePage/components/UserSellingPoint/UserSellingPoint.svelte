<script lang="ts">
	interface UspData {
		title: string | undefined;
		description: string | undefined;
		icon?: ComponentType;
	}

	import Text from '$lib/components/Text/Text.svelte';
	import type { ComponentType } from 'svelte';

	export let data: Array<UspData>;
</script>

<div class="container px-4 gap-4 md:items-center md:justify-center pt-6 pb-8">
	<h2 class="md:text-center text-xl md:text-3xl font-semibold pb-10 lg:pb-6">OUR PROMISE</h2>
	<div class="grid gap-5 md:grid-flow-col md:justify-center md:gap-8 lg:gap-16">
		{#each data as item}
			<div class="text-center lg:max-w-80">
				<div
					class="grid grid-flow-col md:grid-flow-row justify-center md:justify-center md:justify-items-center md:text-center gap-2 pb-1.5"
				>
					<div class="justify-center">
						<svelte:component this={item.icon} class="text-beige-7 block" />
					</div>
					<div>
						<Text
							class="sm:text-center md:uppercase"
							type="body-1"
							color="black-9"
							weight="semibold">{item.title?.toUpperCase()}</Text
						>
					</div>
				</div>
				<div class="md:text-center text-balance text-black-5 font-normal text-sm">
					{@html item.description}
				</div>
			</div>
		{/each}
	</div>
</div>
