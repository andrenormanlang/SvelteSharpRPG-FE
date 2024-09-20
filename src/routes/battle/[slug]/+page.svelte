<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { page } from '$app/stores';
  import { playDiceSound, playDieSound } from '../../../stores/audioStore';
  import { getDieTemplate, rollDie } from '$lib/utils/rollDie';
  import { muteAudio, rollOnTemplate } from '../../../stores/preferenceStore';
  import { browser } from '$app/environment';

  import type { Battle } from '../../../types/battle';
  import type { Character } from '../../../types/character';
  import type { Enemy } from '../../../types/enemy';
  import UtilPanel from '../../../components/UtilPanel.svelte';

  let battleDetails: Battle | null = null;
  let character: Character | null = null;
  let enemy: Enemy | null = null;
  let slug = '';
  let playerHealth = 100;
  let enemyHealth = 100;
  let isBattleOver = false;
  let resultMessage = '';

  let currentDieId = 0;
  let mute = true;
  let autoRoll = false;

  rollOnTemplate.subscribe(x => autoRoll = x);
  muteAudio.subscribe(x => mute = x);

  // Define Die interface
  interface Die {
    id: number;
    type: number;
    currentValue: number;
    isRolling: boolean;
    roll: (playSound: boolean) => void;
  }

  let dice: Die[] = []; // Player dice
  let diceEnemy: Die[] = []; // Enemy dice
  let dieTypes: number[] = [4, 6, 8, 10, 12, 20];
  let totalValue: number = 0;

  // Add and remove dice functions
  const addDie = (dieType: number) => {
    dice = [
      ...dice,
      {
        id: currentDieId++,
        type: dieType,
        currentValue: 0,
        isRolling: false,
        roll: (playSound: boolean) => {
          if (browser && playSound) playDieSound();
          const dieId = currentDieId - 1;
          dice = dice.map(d => (d.id === dieId ? { ...d, isRolling: true } : d));
          setTimeout(() => {
            dice = dice.map(d => (d.id === dieId ? { ...d, currentValue: rollDie(d.type), isRolling: false } : d));
          }, 800);
        }
      }
    ];

    diceEnemy = [
  ...diceEnemy,
  {
    id: currentDieId++, 
    type: dieType,
    currentValue: 0,
    isRolling: false,
    roll: (playSound: boolean) => {
      if (browser && playSound) playDieSound(); // Ensure sound plays for enemy dice too
      const dieId = currentDieId - 1;
      diceEnemy = diceEnemy.map(d => (d.id === dieId ? { ...d, isRolling: true } : d));
      setTimeout(() => {
        diceEnemy = diceEnemy.map(d => (d.id === dieId ? { ...d, currentValue: rollDie(d.type), isRolling: false } : d));
      }, 800);
    }
  }
];
  };

  const removeDie = (dieId: number) => {
    dice = dice.filter(d => d.id != dieId);
    diceEnemy = diceEnemy.filter(d => d.id != dieId); 
  };

  // Roll all dice function
  const rollAll = () => {
    if (dice.length > 0) {
      playDiceSound();
      dice.forEach((die) => die.roll(true));
      diceEnemy.forEach((die) => die.roll(false));

      const playerRoll = dice.reduce((sum, die) => sum + die.currentValue, 0);
      const enemyRoll = diceEnemy.reduce((sum, die) => sum + die.currentValue, 0);

      if (playerRoll > enemyRoll) {
        enemyHealth -= playerRoll;
        resultMessage = `You won this round! Rolled ${playerRoll}. Enemy rolled ${enemyRoll}.`;
      } else {
        playerHealth -= enemyRoll;
        resultMessage = `You lost this round! Rolled ${playerRoll}. Enemy rolled ${enemyRoll}.`;
      }

      if (playerHealth <= 0) {
        resultMessage = 'You lost the battle!';
        isBattleOver = true;
      } else if (enemyHealth <= 0) {
        resultMessage = 'You won the battle!';
        isBattleOver = true;
      }
    }
  };

  // Fetch battle and character data
  $: slug = $page.params.slug;
  onMount(async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const battleResponse = await axios.get(`https://localhost:5000/api/battle/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      battleDetails = battleResponse.data;

      const characterResponse = await axios.get(`https://localhost:5000/api/character/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      character = characterResponse.data[0];

      if (battleDetails && battleDetails.enemyIds.length > 0) {
        const enemyResponse = await axios.get(`https://localhost:5000/api/enemy/${battleDetails.enemyIds[0]}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        enemy = enemyResponse.data;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  });

  function healthBarColor(health: number): string {
    if (health >= 60) {
      return 'bg-green-500';
    } else if (health >= 30) {
      return 'bg-yellow-500';
    } else {
      return 'bg-red-500';
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');

  .retro-font { font-family: 'DotGothic16', sans-serif; text-transform: uppercase; letter-spacing: 1px; }
  .card { background-color: #000; color: #00ff00; border: 2px solid #008080; border-radius: 8px; padding: 15px; margin: 8px; width: 230px; }
  .health-bar-container { display: flex; align-items: center; margin-top: 16px; }
  .heart-icon { width: 25px; margin-right: 1px; }
  .health-bar { height: 15px; width: 150px; background-color: #555; border: 2px solid black; display: flex; border-radius: 10px; }
  .health-fill { transition: width 0.3s ease-in-out; height: 100%; border-radius: 10px; }
  .health-label { font-size: 14px; color: white; }
  .dice-section { margin-top: 20px; display: flex; flex-direction: column; align-items: center; }
  .dice-buttons { display: flex; gap: 8px; justify-content: center; margin: 10px 0; }
  .dice { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }
  .die { display: flex; flex-direction: column; align-items: center; }

  @keyframes dieSpawn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes spin {
  33% {
    transform: rotateY(360deg) rotateZ(360deg);
  }
  66% {
    transform: rotateY(360deg) rotateZ(-360deg);
  }
  100% {
    transform: rotateY(360deg) rotateZ(360deg);
  }
}

.die-icon-anim {
  animation: spin 1s ease-in-out !important;
}

.die-icon {
  opacity: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  animation: dieSpawn 0.4s ease forwards;
}

.die-value {
  z-index: 1;
  background-color: var(--panel-color);
  padding: 0.2rem;
  display: grid;
  place-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.3rem;
}

.die {
  height: 10rem;
  max-height: 10rem;
  width: 10rem;
  max-width: 10rem;
  position: relative;
  transition: all 0.2s ease-out;
  display: grid;
  place-items: center;
  padding: 1rem;
  border-radius: 0.3rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  background-color: var(--panel-color);
}

.die:hover .die-remove {
  display: grid;
  opacity: 1;
}

.die-remove {
  cursor: pointer;
  transition: all 0.7s ease-in-out;
  position: absolute;
  background-color: var(--statement-color);
  border-top-left-radius: 0.3rem;
  font-size: 2rem;
  padding: 0.2rem;
  display: grid;
  place-content: center;
  width: 2rem;
  height: 2rem;
  opacity: 0;
  display: none;
  top: 0;
  left: 0;
}

.die-roll {
  cursor: pointer;
  transition: all 0.7s ease-in-out;
  position: absolute;
  background-color: var(--statement-color);
  border-top-right-radius: 0.3rem;
  border-bottom-left-radius: 0.3rem;
  font-size: 2rem;
  padding: 0.2rem;
  display: grid;
  place-content: center;
  width: 2.5rem;
  height: 2.5rem;
  top: 0;
  right: 0;
}

/* General layout */
.dice-section {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dice-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 10px 0;
}

.dice {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>

<main>
  <UtilPanel />
  {#if battleDetails && character && enemy}
    <div class="text-center text-xl font-semibold text-gray-300 mt-4 mb-2 retro-font">
      Battle: {battleDetails.battleName}
    </div>

    <!-- Character and Enemy Cards -->
    <div class="cards-container flex justify-center gap-4 my-4">
      <div class="card retro-font">
        <h2 class="text-center text-lg mb-2">{character.name}</h2>
        <p>Class: {character.className}</p>
        <p>Attack: {character.attack}</p>
        <p>Mana: {character.mana}</p>
        <div class="health-bar-container">
          <img src="/icons/heart.png" alt="Heart" class="heart-icon" />
          <div class="health-bar">
            <div class={`health-fill ${healthBarColor(playerHealth)}`} style="width: {playerHealth}%"></div>
          </div>
        </div>
        <p class="health-label">{playerHealth}%</p>
      </div>

      <div class="card retro-font">
        <h2 class="text-center text-lg mb-2">{enemy.name}</h2>
        <p>Type: {enemy.type}</p>
        <p>Attack: {enemy.attack}</p>
        <div class="health-bar-container">
          <img src="/icons/heart.png" alt="Heart" class="heart-icon" />
          <div class="health-bar">
            <div class={`health-fill ${healthBarColor(enemyHealth)}`} style="width: {enemyHealth}%"></div>
          </div>
        </div>
        <p class="health-label">{enemyHealth}%</p>
      </div>
    </div>

    <!-- Dice Section -->
    <div class="dice-section">
      <div class="dice-buttons">
        {#each dieTypes as dieType}
          <button on:click={() => addDie(dieType)}>Roll D{dieType}</button>
        {/each}
        <button on:click={rollAll}>Roll all dice</button>
      </div>

     <!-- Player Dice -->
<div class="dice">
  {#each dice as die (die.id)}
    <div class="die shadow">
      <img class="{die.isRolling ? 'die-icon-anim die-icon' : 'die-icon'}" src="/icons/d{die.type}.svg" alt="die" />
      <p class="die-value">{die.currentValue}</p>
      <button on:click={() => removeDie(die.id)}>Remove Die</button>
    </div>
  {/each}
</div>

<!-- Enemy Dice -->
<div class="dice">
  {#each diceEnemy as die (die.id)}
    <div class="die shadow">
      <img class="{die.isRolling ? 'die-icon-anim die-icon' : 'die-icon'}" src="/icons/d{die.type}.svg" alt="enemy die" />
      <p class="die-value">{die.currentValue}</p>
    </div>
  {/each}
</div>

      <div class="text-base font-bold text-center my-3 text-yellow-400 retro-font">
        {resultMessage}
      </div>
    </div>
  {/if}
</main>

