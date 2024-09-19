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
      // API call to fetch battles
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
<div class="battle-list p-4 flex flex-col items-center space-y-6">
  <h2 class="text-4xl font-bold mb-6 text-center retro-font neon-glow">Available Battles</h2>

  {#if errorMessage}
    <p class="text-red-500 text-lg retro-font">{errorMessage}</p>
  {/if}

  {#if battles.length === 0}
    <p class="text-lg text-gray-400 retro-font">No battles available at the moment.</p>
  {:else}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {#each battles as battle}
        <div class="card bg-gray-900 border-2 border-teal-400 text-green-500 shadow-lg hover:shadow-xl transition-shadow duration-300 retro-card p-6 flex flex-col items-center text-center">
          <!-- Battle name with MedievalSharp font and bold style -->
          <h3 class="battle-name text-xl font-bold mb-2 neon-glow">{battle.battleName ?? 'Unknown Battle'}</h3>
          <!-- Battle description with MedievalSharp font -->
          <p class="retro-font text-gray-300 mb-4">{battle.description ?? 'No description available.'}</p>
          <p class="text-sm text-gray-400 mb-4 retro-font">
            <!-- Date: {battle.battleDate ? new Date(battle.battleDate).toLocaleDateString() : 'Unknown Date'} -->
          </p>
          <button
            on:click={() => enterBattle(battle.id)}
            class="btn btn-primary w-full retro-font hover:scale-105 transform transition-transform duration-300">
            Enter Battle
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&family=MedievalSharp&display=swap');

  /* Apply retro font */
  .retro-font {
    font-family: 'DotGothic16', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Font for battle name and description */
  .battle-name, .battle-description {
    font-family: 'MedievalSharp', cursive;
  }

  .battle-name {
    font-weight: bold; /* Bold for battle name */
  }

  /* Add neon glow effect */
  .neon-glow {
    text-shadow: 0 0 5px rgba(0, 255, 0, 0.8), 0 0 10px rgba(0, 255, 0, 0.6);
  }

  h2 {
    color: #00ff00;
  }

  .card {
    background-color: #000; /* Black background for retro look */
    border-radius: 10px;
    transition: transform 0.3s ease;
  }

  /* Card hover effects */
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.8), 0 0 30px rgba(0, 255, 0, 0.6);
  }

  .btn-primary {
    background-color: #008080;
    color: #fff;
    border: none;
    padding: 10px;
    cursor: pointer;
  }

  .btn-primary:hover {
    background-color: #00ff00;
    color: #000;
  }

  /* Ensure layout works on smaller devices */
  .p-4 {
    padding: 24px;
  }

  /* Responsive grid for battles */
  .grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 768px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 1024px) {
    .grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>
