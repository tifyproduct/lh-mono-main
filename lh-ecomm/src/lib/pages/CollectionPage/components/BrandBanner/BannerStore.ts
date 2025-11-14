import { writable } from 'svelte/store';
import type { BrandBanner } from './type';

export const bannerDataStore = writable<BrandBanner | null>(null);

