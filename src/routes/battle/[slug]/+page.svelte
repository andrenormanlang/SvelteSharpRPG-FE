<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { page } from '$app/stores';
  import type { Battle } from '../../../types/battle';
  import type { Character } from '../../../types/character';
  import { tweened } from 'svelte/motion';  // For dice animation

  let battleDetails: Battle | null = null;
  let character: Character | null = null;
  let playerRoll = 0;
  let enemyRoll = 0;
  let resultMessage = '';
  let isBattleOver = false;
  let slug = '';
  let errorMessage = ''; // Declare the errorMessage variable
  let playerHealth = 100;  // Example values for health
  let enemyHealth = 100;
  let currentRound = 1;  // Keep track of rounds
  let maxRounds = 3;
  let diceValue = tweened(0, { duration: 400 });  // For dice animation

  // Fetch battle and character details on mount
  $: slug = $page.params.slug;

  onMount(async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Get userId from local storage

      // Fetch the battle details
      const battleResponse = await axios.get(`https://localhost:5000/api/battle/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      battleDetails = battleResponse.data;

      // Fetch the character details using the userId
      const characterResponse = await axios.get(`https://localhost:5000/api/character/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      character = characterResponse.data[0]; // Assuming the API returns an array of characters
    } catch (error) {
      console.error('Failed to fetch battle and character details:', error);
    }
  });

  // Simulate a dice roll (1 to 6)
  function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  // Start the battle by posting to the backend
  const startBattle = async () => {
    try {
      const token = localStorage.getItem('token');

      // Check if character is defined
      if (!character || !character.id) {
        throw new Error("Character is not defined or missing ID");
      }

      // Simulate a round of battle
      for (let round = 1; round <= maxRounds; round++) {
        await new Promise(resolve => setTimeout(resolve, 1000));  // Delay between rounds

        playerRoll = rollDice();
        enemyRoll = rollDice();

        // Update dice animation
        diceValue.set(playerRoll);

        if (playerRoll > enemyRoll) {
          enemyHealth -= playerRoll;
        } else if (enemyRoll > playerRoll) {
          playerHealth -= enemyRoll;
        }

        // Check if battle is over
        if (playerHealth <= 0) {
          resultMessage = 'You lost the battle!';
          break;
        } else if (enemyHealth <= 0) {
          resultMessage = 'You won the battle!';
          character.level++;  // Level up character
          break;
        }

        if (round === maxRounds) {
          resultMessage = 'It’s a tie after 3 rounds!';
        }
      }

      isBattleOver = true;

    } catch (error) {
      console.error("Battle error:", error);
      errorMessage = "Failed to start the battle. Please try again later.";
    }
  };
</script>

<!-- Battle Details UI -->
<div class="battle-details p-4 flex flex-col items-center space-y-4">
  <h2 class="text-3xl font-bold mb-4 text-center">Battle: {battleDetails?.battleName}</h2>

  {#if isBattleOver}
    <div>
      <p class="text-xl">Player Health: {playerHealth}</p>
      <p class="text-xl">Enemy Health: {enemyHealth}</p>
      <p class="text-xl">You rolled: {playerRoll}</p>
      <p class="text-xl">Enemy rolled: {enemyRoll}</p>
      <p class="text-xl font-bold mt-2">{resultMessage}</p>
    </div>
  {:else}
    <div class="dice-roll">
      <p class="text-2xl">Rolling Dice...</p>
      <!-- Visual dice roll (can add dice images or use tweened values) -->
      <p class="text-4xl">{diceValue}</p>
      <button on:click={startBattle} class="btn btn-primary w-full">Start Battle</button>
    </div>
  {/if}
</div>

<style>
  .dice-roll {
    font-family: 'Courier New', Courier, monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

