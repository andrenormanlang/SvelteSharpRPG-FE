<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { page } from '$app/stores';  // To get URL params

  import type { Battle } from '../../../types/battle';
  import type { Character } from '../../../types/character';
  import type { Enemy } from '../../../types/enemy';

  let battleDetails: Battle | null = null;
  let character: Character | null = null;
  let enemy: Enemy | null = null;  // Enemy details
  let slug = '';
  let playerHealth = 100;
  let enemyHealth = 100;
  let isBattleOver = false;
  let resultMessage = '';

  $: slug = $page.params.slug;  // Get the battle ID from the URL

  // Fetch battle and character data
  onMount(async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      // Fetch the battle details using slug from URL
      const battleResponse = await axios.get(`https://localhost:5000/api/battle/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      battleDetails = battleResponse.data;

      // Fetch the player's character
      const characterResponse = await axios.get(`https://localhost:5000/api/character/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      character = characterResponse.data[0];

      // Fetch the enemy details based on the first enemy ID in the battle
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

  // Function to handle dice rolling and health adjustments
  function rollDice() {
    const playerRoll = Math.floor(Math.random() * 6) + 1;
    const enemyRoll = Math.floor(Math.random() * 6) + 1;

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
</script>

<style>
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');

  /* Apply retro font */
  .retro-font {
    font-family: 'DotGothic16', sans-serif;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .battle-info {
    @apply text-center text-2xl font-semibold text-gray-300 mt-6 mb-4;
  }

  .card {
    background-color: #000; /* Black background for retro look */
    color: #00ff00; /* Green text for retro terminal look */
    border: 3px solid #008080; /* Teal border */
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.7);
    padding: 20px;
    margin: 10px;
    width: 250px;
  }

  .stat {
    font-size: 14px;
    margin: 5px 0;
  }

  .progress {
    height: 15px;
    background-color: rgba(255, 0, 0, 0.3); /* Light red for health background */
  }

  .progress-health {
    background-color: #00ff00; /* Bright green for health bar */
  }

  .health-label {
    font-size: 14px;
    text-align: center;
    color: white;
  }

  .dice-container {
    @apply flex justify-center mt-6;
  }

  .result-message {
    @apply text-lg font-bold text-center my-4 text-yellow-400;
  }

  .btn-primary {
    @apply bg-teal-700 text-white hover:bg-teal-500;
  }
</style>

<main>
  {#if battleDetails && character && enemy}
    <div class="battle-info retro-font">
      <h2>Battle: {battleDetails.battleName}</h2>
    </div>

    <div class="cards-container flex justify-center gap-6 my-8">
      <!-- Player Card -->
      <div class="card retro-font">
        <h2 class="text-center text-xl mb-4">{character.name}</h2>
        <p class="stat">Class: {character.className}</p>
        <p class="stat">Level: {character.level}</p>
        <p class="stat">Attack: {character.attack}</p>
        <p class="stat">Defense: {character.defense}</p>
        <p class="stat">Mana: {character.mana}</p>
        <p class="stat">Stamina: {character.stamina}</p>

        <!-- Player health bar -->
        <div class="my-4">
          <progress class="progress progress-health w-full" value={playerHealth} max="100"></progress>
          <p class="health-label mt-2">Health: {playerHealth}%</p>
        </div>
      </div>

      <!-- Enemy Card -->
      <div class="card retro-font">
        <h2 class="text-center text-xl mb-4">{enemy.name}</h2>
        <p class="stat">Type: {enemy.type}</p>
        <p class="stat">Attack: {enemy.attack}</p>
        <p class="stat">Defense: {enemy.defense}</p>
        <p class="stat">Reward: {enemy.experienceReward}</p>

        <!-- Enemy health bar -->
        <div class="my-4">
          <progress class="progress progress-health w-full" value={enemyHealth} max="100"></progress>
          <p class="health-label mt-2">Health: {enemyHealth}%</p>
        </div>
      </div>
    </div>

    <!-- Dice Roll Result -->
    <div class="result-message retro-font">
      {resultMessage}
    </div>

    <!-- Dice roll button -->
    <div class="dice-container">
      <button class="btn btn-primary retro-font" on:click={rollDice} disabled={isBattleOver}>
        Roll Dice
      </button>
    </div>
  {/if}
</main>
