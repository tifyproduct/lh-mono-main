import { writable } from 'svelte/store';

// Create a writable store with an initial value
export const showAuthenticationModal = writable(false);
export const showErrorToast = writable(false);
export const whatsappLogin = writable(false);
