<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { page } from '$app/stores';  // To get URL params
  import image from '../../../lib/images/heart.png';  

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

  // Function to determine the health bar color based on percentage
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

  /* Apply retro font */
  .retro-font {
    font-family: 'DotGothic16', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px
  }

 
  .card {
    background-color: #000; /* Black background for retro look */
    color: #00ff00; /* Green text for retro terminal look */
    border: 2px solid #008080; /* Teal border */
    border-radius: 8px;
    box-shadow: 0px 0px 8px rgba(0, 255, 0, 0.7);
    padding: 15px;
    margin: 8px;
    width: 230px; /* Adjusted for smaller width */
  }

  .stat {
    font-size: 16px;
    font-weight: bold; /* Bold only for stats */
    margin: -16px 0;
  }

  .progress {
    height: 10px; /* Smaller health bar height */
    background-color: rgba(255, 0, 0, 0.3); /* Light red for health background */
  }

  .progress-health {
    background-color: #00ff00; /* Bright green for health bar */
  }

  .health-label {
    font-size: 12px; /* Smaller health label */
    text-align: center;
    color: white;
  }

   /* Health bar styling with heart icon */
   .health-bar-container {
    display: flex;
    align-items: center;
    margin-top: 16px;
  }

  .heart-icon {
    width: 25px;
    margin-right: 1px;
  }

  .health-bar {
    height: 15px;
    width: 150px;
    background-color: #555; /* Background of the bar */
    border: 2px solid black;
    display: flex;
    border-radius: 10px;
  }

  .health-fill {
    transition: width 0.3s ease-in-out;
    height: 100%;
    border-radius: 10px;
  }

  .health-label {
    font-size: 14px;
    color: white;
    
  }

</style>

<main>
  {#if battleDetails && character && enemy}
  <!-- Battle details and character info -->
   <div class= battle>
    
   </div>
  <div class="text-center text-xl font-semibold text-gray-300 mt-4 mb-2 retro-font">
    Battle: {battleDetails.battleName}
  </div>

    <div class="cards-container flex justify-center gap-4 my-4">
      <!-- Player Card -->
      <div class="card retro-font">
        <h2 class="text-center text-lg mb-2">{character.name}</h2>
        <p class="stat">Class: {character.className}</p>
        <p class="stat">Level: {character.level}</p>
        <p class="stat">Attack: {character.attack}</p>
        <p class="stat">Defense: {character.defense}</p>
        <p class="stat">Mana: {character.mana}</p>
        <p class="stat">Stamina: {character.stamina}</p>

         <!-- Player health bar -->
         <div class="health-bar-container">
          <img src={image} alt="Heart" class="heart-icon" />
          <div class="health-bar">
            <div class={`health-fill ${healthBarColor(playerHealth)}`} style="width: {playerHealth}%"></div>
          </div>
        </div>
        <p class="health-label">{playerHealth}%</p> <!-- Move this below the bar -->
      </div>

      <!-- Enemy Card -->
      <div class="card retro-font">
        <h2 class="text-center text-lg mb-2">{enemy.name}</h2>
        <p class="stat">Type: {enemy.type}</p>
        <p class="stat">Attack: {enemy.attack}</p>
        <p class="stat">Defense: {enemy.defense}</p>
        <p class="stat">Speed: {enemy.speed}</p>
        <p class="stat">Defense: {enemy.defense}</p>
        <p class="stat">Reward: {enemy.experienceReward}</p>

        <!-- Enemy health bar -->
        <div class="health-bar-container">
          <img src={image} alt="Heart" class="heart-icon" />
          <div class="health-bar">
            <div class={`health-fill ${healthBarColor(enemyHealth)}`} style="width: {enemyHealth}%"></div>
          </div>
        </div>
        <p class="health-label">{enemyHealth}%</p> <!-- Move this below the bar -->
      </div>
    </div>

    <!-- Dice Roll Result -->
    <div class="text-base font-bold text-center my-3 text-yellow-400 retro-font">
      {resultMessage}
    </div>
    

    <!-- Dice roll button -->
    <div class="flex justify-center mt-4">
      <button class="btn btn-primary retro-font" on:click={rollDice} disabled={isBattleOver}>
        Roll Dice
      </button>
    </div>
  {/if}
</main>
