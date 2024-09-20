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

  import Icon from '@iconify/svelte';
  

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
  const newDieId = currentDieId++; // Generate a unique ID for both player and enemy dice

  // Add player die
  dice = [
    ...dice,
    {
      id: newDieId, // Same ID for both
      type: dieType,
      currentValue: 0,
      isRolling: false,
      roll: (playSound: boolean) => {
        if (browser && playSound) playDieSound();
        dice = dice.map(d => (d.id === newDieId ? { ...d, isRolling: true } : d));
        setTimeout(() => {
          dice = dice.map(d => (d.id === newDieId ? { ...d, currentValue: rollDie(d.type), isRolling: false } : d));
        }, 800);
      }
    }
  ];

  // Add corresponding enemy die
  diceEnemy = [
    ...diceEnemy,
    {
      id: newDieId, // Same ID for both
      type: dieType,
      currentValue: 0,
      isRolling: false,
      roll: (playSound: boolean) => {
        diceEnemy = diceEnemy.map(d => (d.id === newDieId ? { ...d, isRolling: true } : d));
        setTimeout(() => {
          diceEnemy = diceEnemy.map(d => (d.id === newDieId ? { ...d, currentValue: rollDie(d.type), isRolling: false } : d));
        }, 800);
      }
    }
  ];
};


 // Remove both player and enemy dice based on the id
 const removeBothDice = (dieId: number) => {
  // Remove the player's die with the matching id
  dice = dice.filter(d => d.id !== dieId);

  // Remove the enemy's die with the same id
  diceEnemy = diceEnemy.filter(d => d.id !== dieId);
};


  // Roll all dice function
 const rollAll = () => {
  if (dice.length > 0) {
    playDiceSound();

    // Set both player and enemy dice rolling
    dice.forEach((die) => die.roll(true));
    diceEnemy.forEach((die) => die.roll(false));

    // Use a timeout to ensure the results are calculated after the dice finish rolling
    setTimeout(() => {
      // After the dice animations, calculate the totals
      const playerRoll = dice.reduce((sum, die) => sum + die.currentValue, 0);
      const enemyRoll = diceEnemy.reduce((sum, die) => sum + die.currentValue, 0);

      // Display the total rolls
      resultMessage = `You rolled ${playerRoll}. Enemy rolled ${enemyRoll}.`;

      // Check who won the round and update the result message
      if (playerRoll > enemyRoll) {
        enemyHealth -= playerRoll;
        resultMessage += ` You won this round!`; // Update result if player wins
      } else {
        playerHealth -= enemyRoll;
        resultMessage += ` You lost this round!`; // Update result if player loses
      }

      // Check if the battle is over based on the health conditions
      if (playerHealth <= 0) {
        resultMessage = 'You lost the battle!';
        isBattleOver = true;
      } else if (enemyHealth <= 0) {
        resultMessage = 'You won the battle!';
        isBattleOver = true;
      }
    }, 1000); // Delay the result calculation to match the dice roll animation duration
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
  animation: spin 2s ease-in-out !important;
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
  background-color: white; /* Change background to white for better contrast */
  color: black; /* Change text color to black for better contrast */
  font-weight: bold; /* Make the text bold for easier readability */
  padding: 0.5rem; /* Add padding to give space around the text */
  border-radius: 0.5rem; /* Rounded corners for a nicer look */
  font-size: 2rem; /* Larger font size for better readability */
}

.die {
  height: 12rem; /* Increased height */
  width: 12rem; /* Increased width */
  position: relative;
  display: grid;
  place-items: center;
  padding: 1rem;
  border-radius: 0.3rem;
  margin-right: 0.5rem; /* Adjust margins for proper spacing */
  margin-left: 0.5rem;
  background-color: var(--panel-color);
}

  .dice-container {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
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

.separator {
  font-size: 2rem; /* Larger size for better visibility */
  color: white; /* White color to contrast against the background */
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
        <p>Level: {character.level}</p>
        <p>Attack: {character.attack}</p>
        <p>Defense: {character.defense}</p>
        <p>Stamina: {character.stamina}</p>
        <p>Speed: {character.speed}</p>
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
        <p>Defense: {enemy.defense}</p>
        <p>Speed: {enemy.speed}</p>
        <p>Reward: {enemy.experienceReward}</p>
        <p>Hit Chance: {enemy.criticalHitChance}</p>
        <div class="health-bar-container">
          <img src="/icons/heart.png" alt="Heart" class="heart-icon" />
          <div class="health-bar">
            <div class={`health-fill ${healthBarColor(enemyHealth)}`} style="width: {enemyHealth}%"></div>
          </div>
        </div>
        <p class="health-label">{enemyHealth}%</p>
      </div>
    </div>

    <div class="dice-section">
      <div class="dice-buttons">
        {#each dieTypes as dieType}
          <button on:click={() => addDie(dieType)} class="btn btn-primary">
            Roll D{dieType}
          </button>
        {/each}
        <button on:click={rollAll} class="btn btn-primary btn-accent">Roll All</button>
      </div>
    
      <!-- Player Dice -->
      <div class="dice-container">
        {#each dice as die (die.id)}
        <div class="die shadow">
          <img class="{die.isRolling ? 'die-icon-anim die-icon' : 'die-icon'}" src="/icons/d{die.type}.svg" alt="die" />
          <p class="die-value">{die.currentValue}</p>
          <button class="die-remove shadow non-selectable" on:click={() => removeBothDice(die.id)}>
            <Icon icon="mdi:close-box-outline" style="color: #e04410" width="20" height="20" />
          </button>
        </div>
        {/each}
        <span class="separator">||</span>
        {#each diceEnemy as die (die.id)}
        <div class="die shadow">
          <img class="{die.isRolling ? 'die-icon-anim die-icon' : 'die-icon'}" src="/icons/d{die.type}.svg" alt="enemy die" />
          <p class="die-value">{die.currentValue}</p>
          <button class="die-remove shadow non-selectable" on:click={() => removeBothDice(die.id)}>
            <Icon icon="mdi:close-box-outline" style="color: #e04410" width="20" height="20" />
          </button>
        </div>
        {/each}
      </div>
    
      <div class="text-base font-bold text-center my-3 text-yellow-400 retro-font">
        {resultMessage}
      </div>
    </div>
  {/if}
</main>

