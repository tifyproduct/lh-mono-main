import { writable } from 'svelte/store';

import type { CustomerProfile } from '$lib/types/customer';

const customerProfileStore = writable<CustomerProfile>(undefined);

export default customerProfileStore;
