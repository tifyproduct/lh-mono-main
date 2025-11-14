import type { OrderHistoryItem } from '$lib/pages/CustomerProfile/OrderHistoryPage/type';
import { writable } from 'svelte/store';

const orderHistoryStore = writable<OrderHistoryItem[]>(undefined);

export default orderHistoryStore;
