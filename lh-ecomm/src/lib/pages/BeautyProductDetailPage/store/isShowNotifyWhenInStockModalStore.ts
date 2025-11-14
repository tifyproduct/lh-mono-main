import { writable } from 'svelte/store';

const isShowNotifyWhenInStockModal = writable<boolean>(false);

export const openNotifyWhenInStockModal = () => {
	isShowNotifyWhenInStockModal.set(true);
};

export const closeNotifyWhenInStockModal = () => {
	isShowNotifyWhenInStockModal.set(false);
};

export default isShowNotifyWhenInStockModal;
