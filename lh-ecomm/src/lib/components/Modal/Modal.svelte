<script lang="ts">
	import { fly } from 'svelte/transition';

	import { CloseLineSystem } from 'svelte-remix';

	import Text from '$lib/components/Text/Text.svelte';
	import Button from '$lib/components/Button/Button.svelte';

	export let isOpen: boolean;
	export let onClose: () => void;
	export let hideCloseIcon: boolean = false;
	export let maxWidth = 'max-w-full md:max-w-lg';
	export let padding = 'p-4';
	export let fullScreenMobile = false;

	export let title: string = '';

	export let okButtonProps: {
		onClick?: () => void;
		text?: string;
	} = {};
</script>

{#if isOpen}
	<div
		class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-end md:justify-center items-end md:items-center z-50 px-0"
	>
		<div
			class={`bg-white-1 rounded-t-lg md:rounded shadow-lg ${padding} ${maxWidth} w-full overflow-auto max-h-[95%] ${fullScreenMobile ? 'max-lg:max-h-full max-lg:h-full max-lg:rounded-none' : ''}`}
			transition:fly|local={{ y: 100, duration: 300 }}
		>
			<div class="flex justify-between items-center">
				{#if title}
					<div>
						<Text type="subtitle-2" color="black-10" weight="semibold">
							{title}
						</Text>
					</div>
				{/if}

				{#if !hideCloseIcon}
					<div class="cursor-pointer" role="presentation" on:click={onClose}>
						<CloseLineSystem size={24} class="text-black-4" />
					</div>
				{/if}
			</div>

			<div class:mt-5={title !== ''}>
				<slot />
			</div>

			{#if okButtonProps.text}
				<div class="mt-5">
					<Button variant="primary" padding="py-3" class="w-full" onClick={onClose}>
						{okButtonProps.text}
					</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}
