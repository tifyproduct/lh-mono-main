import { writable } from 'svelte/store';

export const userLocalStorageKey = 'user';

function getUserInitialValue() {
    if (typeof localStorage !== 'undefined') {
        const storedValue = localStorage.getItem(userLocalStorageKey);
        return storedValue ? JSON.parse(storedValue) : {
            firstName: "",
            lastName: "",
            email: ""
        };
    }
    return {
        firstName: "",
        lastName: "",
        email: ""
    };
}

export const userStore = writable(getUserInitialValue());

userStore.subscribe(value => {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(userLocalStorageKey, JSON.stringify(value));
    }
});