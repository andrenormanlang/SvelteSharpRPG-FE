import { writable } from 'svelte/store';
import { browser } from '$app/environment';  // Import the browser check

let localStorageAudio = 'dndoughMuteAudio';
let localStorageDarkTheme = 'dndoughLightTheme';
let localStorageRollOnTemplate = 'dndoughRollOnTemplate';

// Function to get the localStorage or default value
let getLocalStorageOrDefault = (item: string): boolean => {
    if (!browser) {
        // If not in the browser (SSR), return a default value
        return true;
    }

    let localItem = window.localStorage.getItem(item);

    if (localItem != null && localItem === 'false') {
        return false;
    }
    return true;
};

// Writable stores
export const muteAudio = writable(getLocalStorageOrDefault(localStorageAudio));
export const useDarkTheme = writable(getLocalStorageOrDefault(localStorageDarkTheme));
export const rollOnTemplate = writable(getLocalStorageOrDefault(localStorageRollOnTemplate));

// Only interact with localStorage if in the browser
if (browser) {
    muteAudio.subscribe((x) => {
        window.localStorage.setItem(localStorageAudio, String(x));
    });

    useDarkTheme.subscribe((x) => {
        window.localStorage.setItem(localStorageDarkTheme, String(x));
    });

    rollOnTemplate.subscribe((x) => {
        window.localStorage.setItem(localStorageRollOnTemplate, String(x));
    });
}
