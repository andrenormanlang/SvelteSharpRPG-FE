import { muteAudio } from './preferenceStore';
import { browser } from '$app/environment';  // Import the browser check

let dieSound: HTMLAudioElement;
let diceSound: HTMLAudioElement;
let muteRollSound: boolean;

if (browser) {
    dieSound = new Audio('/roll2.mp3');
    diceSound = new Audio('/roll.mp3');

    dieSound.load();
    diceSound.load();
}

// Play die sound
export const playDieSound = () => {
    if (browser && !muteRollSound) {
        dieSound.play();
    }
};

// Play dice sound
export const playDiceSound = () => {
    if (browser && !muteRollSound) {
        diceSound.play();
    }
};

// Subscribe to muteAudio to track whether sound should be played
if (browser) {
    muteAudio.subscribe((muteSound: boolean) => (muteRollSound = muteSound));
}
