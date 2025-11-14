<script lang="ts">
	import type { TextColor, TextType, TextWeight, TextVariant } from './type';

	export let type: TextType;
	export let variant: TextVariant = 'span'

	export let color: TextColor = 'black-10';
	export let weight: TextWeight = 'regular';
	export let title = '';
</script>

<svelte:element this={variant}  class="{color} {weight} {type} {$$props.class}" {title}>
	<slot></slot>
</svelte:element>

<style>
	.brown-1 {
		color: var(--color-brown-1);
	}
	.brown-2 {
		color: var(--color-brown-2);
	}
	.brown-3 {
		color: var(--color-brown-3);
	}
	.brown-4 {
		color: var(--color-brown-4);
	}
	.brown-5 {
		color: var(--color-brown-5);
	}
	.brown-6 {
		color: var(--color-brown-6);
	}
	.brown-7 {
		color: var(--color-brown-7);
	}
	.brown-8 {
		color: var(--color-brown-8);
	}
	.brown-9 {
		color: var(--color-brown-9);
	}
	.brown-10 {
		color: var(--color-brown-10);
	}
	.brown-05 {
		color: var(--color-brown-05);
	}
	.dark-brown-1 {
		color: var(--color-dark-brown-1);
	}
	.dark-brown-2 {
		color: var(--color-dark-brown-2);
	}
	.dark-brown-3 {
		color: var(--color-dark-brown-3);
	}
	.dark-brown-4 {
		color: var(--color-dark-brown-4);
	}
	.dark-brown-5 {
		color: var(--color-dark-brown-5);
	}
	.dark-brown-6 {
		color: var(--color-dark-brown-6);
	}
	.dark-brown-7 {
		color: var(--color-dark-brown-7);
	}
	.dark-brown-8 {
		color: var(--color-dark-brown-8);
	}
	.dark-brown-9 {
		color: var(--color-dark-brown-9);
	}
	.dark-brown-10 {
		color: var(--color-dark-brown-10);
	}

	.beige-1 {
		color: var(--color-beige-1);
	}
	.beige-2 {
		color: var(--color-beige-2);
	}
	.beige-3 {
		color: var(--color-beige-3);
	}
	.beige-4 {
		color: var(--color-beige-4);
	}
	.beige-5 {
		color: var(--color-beige-5);
	}
	.beige-6 {
		color: var(--color-beige-6);
	}
	.beige-7 {
		color: var(--color-beige-7);
	}
	.beige-8 {
		color: var(--color-beige-8);
	}
	.beige-9 {
		color: var(--color-beige-9);
	}
	.beige-10 {
		color: var(--color-beige-10);
	}

	.red-1 {
		color: var(--color-red-1);
	}
	.red-2 {
		color: var(--color-red-2);
	}
	.red-3 {
		color: var(--color-red-3);
	}
	.red-4 {
		color: var(--color-red-4);
	}
	.red-5 {
		color: var(--color-red-5);
	}
	.red-6 {
		color: var(--color-red-6);
	}
	.red-7 {
		color: var(--color-red-7);
	}
	.red-8 {
		color: var(--color-red-8);
	}
	.red-9 {
		color: var(--color-red-9);
	}
	.red-10 {
		color: var(--color-red-10);
	}

	.blue-1 {
		color: var(--color-blue-1);
	}
	.blue-2 {
		color: var(--color-blue-2);
	}
	.blue-3 {
		color: var(--color-blue-3);
	}
	.blue-4 {
		color: var(--color-blue-4);
	}
	.blue-5 {
		color: var(--color-blue-5);
	}
	.blue-6 {
		color: var(--color-blue-6);
	}
	.blue-7 {
		color: var(--color-blue-7);
	}
	.blue-8 {
		color: var(--color-blue-8);
	}
	.blue-9 {
		color: var(--color-blue-9);
	}
	.blue-10 {
		color: var(--color-blue-10);
	}

	.green-1 {
		color: var(--color-green-1);
	}
	.green-2 {
		color: var(--color-green-2);
	}
	.green-3 {
		color: var(--color-green-3);
	}
	.green-4 {
		color: var(--color-green-4);
	}
	.green-5 {
		color: var(--color-green-5);
	}
	.green-6 {
		color: var(--color-green-6);
	}
	.green-7 {
		color: var(--color-green-7);
	}
	.green-8 {
		color: var(--color-green-8);
	}
	.green-9 {
		color: var(--color-green-9);
	}
	.green-10 {
		color: var(--color-green-10);
	}

	.black-1 {
		color: var(--color-black-1);
	}
	.black-2 {
		color: var(--color-black-2);
	}
	.black-3 {
		color: var(--color-black-3);
	}
	.black-4 {
		color: var(--color-black-4);
	}
	.black-5 {
		color: var(--color-black-5);
	}
	.black-6 {
		color: var(--color-black-6);
	}
	.black-7 {
		color: var(--color-black-7);
	}
	.black-8 {
		color: var(--color-black-8);
	}
	.black-9 {
		color: var(--color-black-9);
	}
	.black-10 {
		color: var(--color-black-10);
	}

	.white-1 {
		color: var(--color-white-1);
	}
	.white-2 {
		color: var(--color-white-2);
	}

	.title-1 {
		font-size: var(--font-title-1-size);
		line-height: var(--font-title-1-line-height);
	}
	.title-2 {
		font-size: var(--font-title-2-size);
		line-height: var(--font-title-2-line-height);
	}
	.title-3 {
		font-size: var(--font-title-3-size);
		line-height: var(--font-title-3-line-height);
	}
	.subtitle-1 {
		font-size: var(--font-subtitle-1-size);
		line-height: var(--font-subtitle-1-line-height);
	}
	.subtitle-2 {
		font-size: var(--font-subtitle-2-size);
		line-height: var(--font-subtitle-2-line-height);
	}
	.subtitle-3 {
		font-size: var(--font-subtitle-3-size);
		line-height: var(--font-subtitle-3-line-height);
	}
	.body-1 {
		font-size: var(--font-body-1-size);
		line-height: var(--font-body-1-line-height);
	}
	.body-2 {
		font-size: var(--font-body-2-size);
		line-height: var(--font-body-2-line-height);
	}
	.caption-1 {
		font-size: var(--font-caption-1-size);
		line-height: var(--font-caption-1-line-height);
	}
	.caption-2 {
		font-size: var(--font-caption-2-size);
		line-height: var(--font-caption-2-line-height);
	}

	.regular {
		font-weight: var(--font-regular-weight);
	}
	.medium {
		font-weight: var(--font-medium-weight);
	}
	.semibold {
		font-weight: var(--font-semibold-weight);
	}
	.bold {
		font-weight: var(--font-bold-weight);
	}
</style>
