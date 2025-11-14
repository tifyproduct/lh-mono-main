<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import type { ButtonVariant } from './type';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	export let variant: ButtonVariant;
	export let padding: string = 'px-3 py-2';
	export let radius: string = 'rounded';
	export let onClick: (e: MouseEvent) => void = () => {};
	export let disabled = false;
	export let href: string | undefined = undefined;
	export let type: HTMLButtonAttributes['type'] = 'button';

	const buttonClasses = {
		primary: 'bg-dark-brown-10 text-white-1',
		secondary: 'bg-white text-black-10 border border-black-10',
		link: 'bg-transparent text-black-9 font-semibold',
		"primary-abtest": 'bg-green-whatsapp text-white-1',
		"secondary-abtest": 'bg-white border-green-whatsapp text-green-whatsapp border',
	};
</script>
<!-- abtest -->
<Button
	class={`${buttonClasses[variant]} ${padding} ${radius} ${$$props.class}`}
	on:click={(e) => {
		onClick(e);
	}}
	{disabled}
	href={href ? href : undefined}
	{type}
>
	<slot></slot>
</Button>
