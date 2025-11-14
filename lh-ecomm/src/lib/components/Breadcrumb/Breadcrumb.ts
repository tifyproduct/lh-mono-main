import type { BreadcrumbProps } from '$lib/types/breadcrumb';
import { writable } from 'svelte/store';

export const breadcrumbStore = writable<BreadcrumbProps[]>([]);
