import defaultTheme from 'tailwindcss/defaultTheme';
import flowbitePlugin from 'flowbite/plugin';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],
	theme: {
		container: {
			center: true
		},
		extend: {
			fontFamily: {
				sans: ['"Work Sans"', ...defaultTheme.fontFamily.sans],
				playfair: ['"Playfair Display"', 'serif']
			},
			colors: {
				white: {
					1: 'var(--color-white-1)',
					2: 'var(--color-white-2)'
				},
				black: {
					1: 'var(--color-black-1)',
					2: 'var(--color-black-2)',
					3: 'var(--color-black-3)',
					4: 'var(--color-black-4)',
					5: 'var(--color-black-5)',
					6: 'var(--color-black-6)',
					7: 'var(--color-black-7)',
					8: 'var(--color-black-8)',
					9: 'var(--color-black-9)',
					10: 'var(--color-black-10)'
				},
				red: {
					5: 'var(--color-red-5)',
					6: 'var(--color-red-6)',
					8: 'var(--color-red-8)',

				},
				brown: {
					'05': 'var(--color-brown-05)',
					1: 'var(--color-brown-1)',
					2: 'var(--color-brown-2)',
					3: 'var(--color-brown-3)',
					4: 'var(--color-brown-4)',
					5: 'var(--color-brown-5)',
					6: 'var(--color-brown-6)',
					7: 'var(--color-brown-7)',
					8: 'var(--color-brown-8)',
					9: 'var(--color-brown-9)',
					10: 'var(--color-brown-10)'
				},
				'dark-brown': {
					'05': 'var(--color-dark-brown-05)',
					1: 'var(--color-dark-brown-1)',
					2: 'var(--color-dark-brown-2)',
					3: 'var(--color-dark-brown-3)',
					4: 'var(--color-dark-brown-4)',
					5: 'var(--color-dark-brown-5)',
					6: 'var(--color-dark-brown-6)',
					7: 'var(--color-dark-brown-7)',
					8: 'var(--color-dark-brown-8)',
					9: 'var(--color-dark-brown-9)',
					10: 'var(--color-dark-brown-10)'
				},
				beige: {
					1: 'var(--color-beige-1)',
					2: 'var(--color-beige-2)',
					3: 'var(--color-beige-3)',
					4: 'var(--color-beige-4)',
					5: 'var(--color-beige-5)',
					6: 'var(--color-beige-6)',
					7: 'var(--color-beige-7)',
					8: 'var(--color-beige-8)',
					9: 'var(--color-beige-9)',
					10: 'var(--color-beige-10)'
				},
				green: {
					5: 'var(--color-green-5)',
					8: 'var(--color-green-8)',
					whatsapp: 'var(--color-green-whatsapp)'
				}
			}
		}
	},
	plugins: [flowbitePlugin]
};
