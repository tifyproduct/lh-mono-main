import { writable } from 'svelte/store';

import type { ProductData } from '$lib/types/product';

const selectedProductStore = writable<ProductData | undefined>(undefined);

export default selectedProductStore;
