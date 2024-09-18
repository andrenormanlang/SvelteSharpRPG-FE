<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { page } from '$app/stores';
  import type { Battle } from '../../../types/battle';
  import type { Character } from '../../../types/character';


  
  let battleDetails: Battle | null = null;
  let character: Character | null = null;
  let playerRoll = 0;
  let enemyRoll = 0;
  let resultMessage = '';
  let isBattleOver = false;
  let slug = '';
  let errorMessage = ''; // Declare the errorMessage variable

  // Fetch battle and character details on mount
  $: slug = $page.params.slug;
  
  onMount(async () => {
    try {
      const token = localStorage.getItem('token');
      const battleResponse = await axios.get(`https://localhost:5000/api/battle/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      battleDetails = battleResponse.data;

      const characterResponse = await axios.get('https://localhost:5000/api/character/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      character = characterResponse.data;
    } catch (error) {
      console.error('Failed to fetch battle details:', error);
    }
  });

  // Start the battle by posting to the backend
  const startBattle = async () => {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');

    // Check if character is defined
    if (!character || !character.id) {
      throw new Error("Character is not defined or missing ID");
    }

    // Make a POST request to the backend to start the battle
    const response = await axios.post(
      `https://localhost:5000/api/battle/${slug}/fight`,
      {
        characterId: character.id, // Send character ID to the backend
      },
      {
        headers: { Authorization: `Bearer ${token}` }, // Include the auth token
      }
    );

    // Extract battle results from the response
    playerRoll = response.data.playerRoll;
    enemyRoll = response.data.enemyRoll;
    resultMessage =
      response.data.result === "win"
        ? "You won!"
        : response.data.result === "lose"
        ? "You lost!"
        : "It’s a tie!";
    
    // Mark the battle as over
    isBattleOver = true;

    // Update the character's state with the new data from the server
    character = response.data.updatedCharacter;

    // Optionally, you can handle any additional logic here (e.g., update the UI)

  } catch (error) {
    console.error("Battle error:", error);

    // Handle the error gracefully by showing a user-friendly message
    errorMessage = "Failed to start the battle. Please try again later.";
  }
};

</script>

<!-- Battle Details UI -->
<div class="battle-details p-4 flex flex-col items-center space-y-4">
  <h2 class="text-3xl font-bold mb-4 text-center">Battle: {battleDetails?.battleName}</h2>

  {#if isBattleOver}
    <div>
      <p class="text-xl">You rolled: {playerRoll}</p>
      <p class="text-xl">Enemy rolled: {enemyRoll}</p>
      <p class="text-xl font-bold mt-2">{resultMessage}</p>
    </div>
  {:else}
    <button on:click={startBattle} class="btn btn-primary w-full">Start Battle</button>
  {/if}
</div>
