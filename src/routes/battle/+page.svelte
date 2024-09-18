<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import { goto } from '$app/navigation'; // Import SvelteKit's navigate function
  import type { Battle } from '../../types/battle';

  let battles: Battle[] = [];
  let errorMessage = '';

  // Fetch battles when component mounts
  onMount(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      errorMessage = 'Authorization token missing. Please log in.';
      return;
    }

    try {
      // https://csharprpg.azurewebsites.net/api/battle
      const response = await axios.get('https://localhost:5000/api/battle', {
        headers: { Authorization: `Bearer ${token}` },
      });
      battles = response.data;
    } catch (error) {
      errorMessage = 'Failed to fetch battles. Please try again later.';
      console.error(error);
    }
  });

  // Navigate to the battle page using SvelteKit's native routing
  const enterBattle = (battleId: string) => {
    goto(`/battle/${battleId}`);
  };
</script>

<!-- HTML for displaying battle cards -->
<div class="battle-list p-4 flex flex-col items-center space-y-4">
  <h2 class="text-3xl font-bold mb-4 text-center">Available Battles</h2>

  {#if errorMessage}
    <p class="text-red-500">{errorMessage}</p>
  {/if}

  {#if battles.length === 0}
    <p class="text-lg text-gray-400">No battles available at the moment.</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each battles as battle}
        <div class="card bg-base-200 shadow-md hover:shadow-lg transition-shadow duration-300 rounded-lg p-6 flex flex-col items-center text-center">
          <h3 class="text-xl font-semibold mb-2">{battle.battleName ?? 'Unknown Battle'}</h3>
          <p class="text-gray-500 mb-4">{battle.description ?? 'No description available.'}</p>
          <p class="text-sm text-gray-400 mb-4">
            Date: {battle.battleDate ? new Date(battle.battleDate).toLocaleDateString() : 'Unknown Date'}
          </p>
          <button
            on:click={() => enterBattle(battle.id)}
            class="btn btn-primary w-full">
            Enter Battle
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
