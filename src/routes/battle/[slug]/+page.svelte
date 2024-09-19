<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { page } from '$app/stores';  // To get URL params

  import type { Battle } from '../../../types/battle';
  import type { Character } from '../../../types/character';

  // Battle and character information
  let battleDetails: Battle | null = null;
  let character: Character | null = null;
  let enemy: any = null;  // Enemy details, add proper typing if needed
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

      // Fetch enemy data (for now we use static data, replace with actual logic)
      enemy = {
        name: "Goblin",
        type: "Beast",
        health: 30,
        attack: 10,
        defense: 5,
        experienceReward: 10,
      };

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
  .cards-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
  }

  .card {
    border-radius: 8px;
    padding: 20px;
    margin: 10px;
    width: 250px;
    background-color: #333;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    text-align: center;
  }

  .card-title {
    font-size: 20px;
    margin-bottom: 10px;
  }

  .stat {
    font-size: 14px;
    margin: 5px 0;
  }

  .health-bar-container {
    height: 15px;
    width: 100%;
    background-color: #ddd;
    border-radius: 10px;
    overflow: hidden;
    margin: 10px 0;
  }

  .health-bar {
    height: 100%;
    transition: width 0.5s ease;
  }

  .player-health {
    background-color: #4caf50;
  }

  .enemy-health {
    background-color: #ff4d4d;
  }

  .button {
    padding: 10px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
  }

  .button:hover {
    background-color: #0056b3;
  }

  .dice-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .result-message {
    font-size: 16px;
    margin: 10px;
    text-align: center;
  }

  .battle-info {
    text-align: center;
    margin-top: 20px;
  }
</style>

<main>
  {#if battleDetails && character && enemy}
    <div class="battle-info">
      <h2>Battle: {battleDetails.battleName}</h2>
    </div>

    <div class="cards-container">
      <!-- Player Card -->
      <div class="card">
        <div class="card-title">{character.name} (Level: {character.level})</div>
        <div class="stat">Class: {character.className}</div>
        <div class="stat">Attack: {character.attack}</div>
        <div class="stat">Defense: {character.defense}</div>
        <div class="stat">Mana: {character.mana}</div>
        <div class="stat">Stamina: {character.stamina}</div>

        <!-- Player health bar -->
        <div class="health-bar-container">
          <div class="health-bar player-health" style="width: {playerHealth}%"></div>
        </div>
      </div>

      <!-- Enemy Card -->
      <div class="card">
        <div class="card-title">{enemy.name} ({enemy.type})</div>
        <div class="stat">Attack: {enemy.attack}</div>
        <div class="stat">Defense: {enemy.defense}</div>
        <div class="stat">Experience Reward: {enemy.experienceReward}</div>

        <!-- Enemy health bar -->
        <div class="health-bar-container">
          <div class="health-bar enemy-health" style="width: {enemyHealth}%"></div>
        </div>
      </div>
    </div>

    <!-- Dice Roll Result -->
    <div class="result-message">
      {resultMessage}
    </div>

    <!-- Dice roll button -->
    <div class="dice-container">
      <button class="button" on:click={rollDice} disabled={isBattleOver}>
        Roll Dice
      </button>
    </div>
  {/if}
</main>
