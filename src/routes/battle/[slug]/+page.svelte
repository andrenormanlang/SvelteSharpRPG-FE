<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { page } from '$app/stores';
  import { playDiceSound, playDieSound } from '../../../stores/audioStore';
  import { rollDie } from '$lib/utils/rollDie';
  import { muteAudio, rollOnTemplate } from '../../../stores/preferenceStore';
  import { browser } from '$app/environment';

  import type { Battle } from '../../../types/battle';
  import type { Character } from '../../../types/character';
  import type { Enemy } from '../../../types/enemy';
  import UtilPanel from '../../../components/UtilPanel.svelte';
  import Icon from '@iconify/svelte';
  import { fade, fly } from 'svelte/transition';
  import { spring } from 'svelte/motion';
  

  let battleDetails: Battle | null = null;
  let character: Character | null = null;
  let enemy: Enemy | null = null;
  let slug = '';
  let playerHealth = 100;
  let enemyHealth = 100;
  let isBattleOver = false;
  let resultMessage = '';
  let playerTurn = false;

  interface Die {
  id: number;
  type: number;
  currentValue: number;
  isRolling: boolean;
  isHovered?: boolean;
  roll: (playSound: boolean) => void;
}

interface Combatant {
  name: string;
  attack: number;
  defense: number;
  speed: number;
  health: number;
}



  let currentDieId = 0;
  let dice: Die[] = []; // Player dice
let diceEnemy: Die[] = []; // Enemy dice
  let dieTypes: number[] = [4, 6, 8, 10, 12, 20];

  let mute = true;
  let autoRoll = false;
  let initiativeRolled = false;

  rollOnTemplate.subscribe(x => autoRoll = x);
  muteAudio.subscribe(x => mute = x);

  // D&D Initiative: Determine who goes first
  const rollInitiative = () => {
  // Ensure that character and enemy are not null before proceeding
  if (!character || !enemy) {
    resultMessage = "Character or enemy data missing, cannot roll initiative!";
    return;
  }

  // Roll initiative for both player and enemy
  const playerInitiative = rollDie(20) + character.speed;
  const enemyInitiative = rollDie(20) + enemy.speed;

  // Determine who goes first based on initiative rolls
  if (playerInitiative >= enemyInitiative) {
    resultMessage = `You go first with initiative: ${playerInitiative}`;
    playerTurn = true;
  } else {
    resultMessage = `Enemy goes first with initiative: ${enemyInitiative}`;
    playerTurn = false;
  }

  // Mark initiative as rolled
  initiativeRolled = true;

  // Provide visual or audio feedback for initiative roll (optional)
  if (browser) {
    playDiceSound(); // Optional: Add a sound effect for initiative roll
  }

  console.log(`Player Initiative: ${playerInitiative}, Enemy Initiative: ${enemyInitiative}`);
};

  // D&D Attack Roll (D20 + Attack vs Defense)
  const attackRoll = (attacker : Combatant, defender : Combatant) => {
    const attackRollValue = rollDie(20) + attacker.attack;
    if (attackRollValue >= defender.defense) {
      if (rollDie(20) === 20) {
        resultMessage += ` ${attacker.name} lands a critical hit!`;
        return 'critical';
      } else {
        resultMessage += ` ${attacker.name} hits ${defender.name}.`;
        return 'hit';
      }
    } else {
      resultMessage += ` ${attacker.name} misses ${defender.name}.`;
      return 'miss';
    }
  };

  // Damage Roll
  const calculateDamage = (attacker : Combatant, defender : Combatant, critical = false) => {
    let damage = rollDie(8) + attacker.attack;
    if (critical) {
      damage += rollDie(8);
    }
    defender.health -= damage;

    if (defender.health <= 0) {
      defender.health = 0;
      resultMessage += ` ${defender.name} has been defeated!`;
      isBattleOver = true;
    }
  };

  const handlePlayerTurn = () => {
  if (isBattleOver || !character || !enemy) return;

  const outcome = attackRoll(character as Combatant, enemy as Combatant);
  if (outcome === 'hit' || outcome === 'critical') {
    calculateDamage(character as Combatant, enemy as Combatant, outcome === 'critical');
  }

  if (!isBattleOver) handleEnemyTurn();
};

  // Handle Enemy's Turn
  const handleEnemyTurn = () => {
  if (isBattleOver || !character || !enemy) return; // Ensure character and enemy are not null
  const outcome = attackRoll(enemy as Combatant, character as Combatant); // Cast to Combatant after the null check
  if (outcome === 'hit' || outcome === 'critical') {
    calculateDamage(enemy as Combatant, character as Combatant, outcome === 'critical');
  }
  if (!isBattleOver) handlePlayerTurn();
};


  // Start Battle after initiative roll
  const startBattle = () => {
    rollInitiative();
    if (playerTurn) handlePlayerTurn();
    else handleEnemyTurn();
  };

  // Add a die for both player and enemy
  const addDie = (dieType: number) => {
    const newDieId = currentDieId++;
    dice = [
      ...dice,
      {
        id: newDieId,
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

    diceEnemy = [
      ...diceEnemy,
      {
        id: newDieId,
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

  // Roll All Dice Function (For visual rolling and tie-breaking)
  const rollAll = () => {
    playDiceSound();
    dice.forEach((die) => die.roll(true));
    diceEnemy.forEach((die) => die.roll(false));

    setTimeout(() => {
      const playerRoll = dice.reduce((sum, die) => sum + die.currentValue, 0);
      const enemyRoll = diceEnemy.reduce((sum, die) => sum + die.currentValue, 0);

      if (playerRoll === enemyRoll) {
        resultMessage = "It's a tie!";
      } else if (playerRoll > enemyRoll) {
        enemyHealth -= playerRoll;
        resultMessage = `You rolled ${playerRoll} and won the round!`;
      } else {
        playerHealth -= enemyRoll;
        resultMessage = `You lost the round! Enemy rolled ${enemyRoll}.`;
      }

      if (playerHealth <= 0) {
        resultMessage = 'You lost the battle!';
        isBattleOver = true;
      } else if (enemyHealth <= 0) {
        resultMessage = 'You won the battle!';
        isBattleOver = true;
      }
    }, 1000);
  };

  // Fetch Battle Details
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

  const removeBothDice = (dieId: number) => {
  const dieToRemove = dice.find(d => d.id === dieId);
  if (dieToRemove) {
    const dieElement = document.getElementById(`die-${dieId}`);
    if (dieElement) {
      dieElement.style.transform = 'scale(0.8) rotate(10deg)';
      dieElement.style.opacity = '0.5';
    }
  }
  setTimeout(() => {
    dice = dice.filter(d => d.id !== dieId);
    diceEnemy = diceEnemy.filter(d => d.id !== dieId);
  }, 300);
};
let scaleSpring = spring({ stiffness: 0.1, damping: 0.25 });

function handleMouseEnter(dieId: number) {
  scaleSpring.set({ stiffness: 1.1, damping: 0.25 });
  dice = dice.map(d => d.id === dieId ? { ...d, isHovered: true } : d);
}

function handleMouseLeave(dieId: number) {
  scaleSpring.set({ stiffness: 1, damping: 0.25 });
  dice = dice.map(d => d.id === dieId ? { ...d, isHovered: false } : d);
}

</script>

<style>
  .retro-font { font-family: 'DotGothic16', sans-serif; text-transform: uppercase; letter-spacing: 1px; }
  .card { background-color: #000; color: #00ff00; border: 2px solid #008080; border-radius: 8px; padding: 15px; margin: 8px; width: 230px; }
  .health-bar-container { display: flex; align-items: center; margin-top: 16px; }
  .heart-icon { width: 25px; margin-right: 1px; }
  .health-bar { height: 15px; width: 150px; background-color: #555; border: 2px solid black; display: flex; border-radius: 10px; }
  .health-fill { transition: width 0.3s ease-in-out; height: 100%; border-radius: 10px; }
  .health-label { font-size: 14px; color: white;}


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
.die {
  display: flex;
  flex-direction: column;
  align-items: center;
}

@keyframes dieSpawn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes spin {
  33% { transform: rotateY(360deg) rotateZ(360deg); }
  66% { transform: rotateY(360deg) rotateZ(-360deg); }
  100% { transform: rotateY(360deg) rotateZ(360deg); }
}

.die-icon-anim {
  animation: spin 3s ease-in-out !important;
}

.die-icon {
  opacity: 1;
  width: 100%;
  height: 100%;
  position: absolute;
  animation: dieSpawn 0.4s ease forwards;
}

.dice-header {
  font-size: 1.5rem;
  color: #00ff00;
  text-align: center;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
  text-shadow: 0 0 5px #00ff00;
}

.die-value {
  z-index: 1;
  font-family: 'DotGothic16', sans-serif;
  font-weight: bold;
  color: #fbf013; /* Neon magenta color */
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 2rem;

  /* Neon glow effect */
  text-shadow: 0 0 5px hsl(79, 72%, 45%), /* Main glow */
               0 0 20px hsl(70, 94%, 51%),          
               0 0 30px hsl(75, 100%, 50%)
              
}

.die {
  height: 12rem;
  width: 12rem;
  position: relative;
  display: grid;
  place-items: center;
  padding: 1rem;
  border-radius: 0.3rem;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  background-color: var(--panel-color);
}
.dice-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: 2rem;
}

hr.divider {
  width: 2px;
  height: 100px;
  background-color: white;
  border: none;
  margin: 0 20px;
}

.dice-wrapper {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.result-message {
  margin-top: 10px;
  text-align: center;
  font-size: 1.2rem;
  color: yellow;
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
  font-size: 2rem;
  color: white;
}

.die-separator {
  display: inline-block;
  font-size: 2rem;
  color: #00ff00;
  margin: 0 0.5rem;
  align-self: center;
}
</style>

<!-- HTML -->
<div id="app">
<main class="h-100">
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

     <!-- Add the Start Battle button here -->
     <div class="flex justify-center my-4">
      <button on:click={startBattle} class="btn btn-primary">Start Battle</button>
    </div>


    <!-- Dice Roll Section -->
    <div class="dice-section">
      <div class="dice-buttons">
        {#each dieTypes as dieType}
          <button on:click={() => addDie(dieType)} class="btn btn-primary">D{dieType}</button>
        {/each}
        <button on:click={rollAll} class="btn btn-primary btn-accent">Roll All</button>
      </div>
    
      <div class="dice-container">
        <div class="dice-wrapper">
          <h2 class="dice-header retro-font">User Dice</h2>
          {#each dice as die, index (die.id)}
            <div class="die shadow" id="die-{die.id}" role="button" tabindex="0" on:mouseenter={() => handleMouseEnter(die.id)} on:mouseleave={() => handleMouseLeave(die.id)} in:fly="{{ y: 50, duration: 300 }}" out:fade="{{ duration: 300 }}">
              <img class="{die.isRolling ? 'die-icon-anim die-icon' : 'die-icon'}" src="/icons/d{die.type}.svg" alt="player die" />
              <p class="die-value">{die.currentValue}</p>
              <button class="die-remove shadow non-selectable" id="remove-{die.id}" on:click={() => removeBothDice(die.id)}>
                <Icon icon="mdi:close-box-outline" style="color: #e04410" width="20" height="20" />
              </button>
            </div>
            {#if index < dice.length - 1}
              <div class="die-separator">+</div>
            {/if}
          {/each}
          {#if dice.reduce((sum, die) => sum + die.currentValue, 0) > 0}
            <div class="result-message text-yellow-400 retro-font">
              You rolled {dice.reduce((sum, die) => sum + die.currentValue, 0)}.
            </div>
          {/if}
        </div>

        <div class="dice-wrapper">
          <h2 class="dice-header retro-font">Enemy Dice</h2>
          {#each diceEnemy as die, index (die.id)}
            <div class="die shadow" id="die-{die.id}" role="button" tabindex="0" on:mouseenter={() => handleMouseEnter(die.id)} on:mouseleave={() => handleMouseLeave(die.id)} in:fly="{{ y: 50, duration: 300 }}" out:fade="{{ duration: 300 }}">
              <img class="{die.isRolling ? 'die-icon-anim die-icon' : 'die-icon'}" src="/icons/d{die.type}.svg" alt="player die" />
              <p class="die-value">{die.currentValue}</p>
              <button class="die-remove shadow non-selectable" style="opacity: {die.isHovered ? 1 : 0}" on:click={() => removeBothDice(die.id)}>
                <Icon icon="mdi:close-box-outline" style="color: #e04410" width="20" height="20" />
              </button>
            </div>
            {#if index < diceEnemy.length - 1}
              <div class="die-separator">+</div>
            {/if}
          {/each}
          {#if diceEnemy.reduce((sum, die) => sum + die.currentValue, 0) > 0}
            <div class="result-message text-yellow-400 retro-font">
              Enemy rolled {diceEnemy.reduce((sum, die) => sum + die.currentValue, 0)}.
            </div>
          {/if}
        </div>
      </div>

      {#if dice.length > 0 && diceEnemy.length > 0}
        <div class="text-base font-bold text-center my-3 text-yellow-400 retro-font">
          {resultMessage}
        </div>
      {/if}
    </div>
  {/if}
</main>
</div>

