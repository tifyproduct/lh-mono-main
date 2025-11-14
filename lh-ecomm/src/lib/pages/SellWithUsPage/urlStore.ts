// store.ts
import { writable, type Writable } from 'svelte/store';

// Define pathname as a reactive store
export const pathname: Writable<string> = writable('/');

// Update the store whenever the URL path changes
function updatePathname() {
	pathname.set(window.location.pathname);
}

// Only run in the browser to avoid SSR issues
if (typeof window !== 'undefined') {
	updatePathname(); // Set initial path

	// Listen for popstate events (back/forward navigation)
	window.addEventListener('popstate', updatePathname);

	// Listen for changes to pushState/replaceState calls
	['pushState', 'replaceState'].forEach((method) => {
		const original = history[method];
		history[method] = function (...args) {
			const result = original.apply(this, args);
			updatePathname(); // Update the store when URL changes
			return result;
		};
	});
}
