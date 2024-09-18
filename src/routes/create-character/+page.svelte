<script lang="ts">
  import { onMount } from 'svelte';
  import axios from 'axios';
  import type { Class } from '../../types/class';

  export let userId: string;
  let characterName = '';
  let classId = '';
  let classes: Class[] = [];
  let errorMessage = '';
  let successMessage = '';

  onMount(async () => {
    try {
      const response = await axios.get('https://csharprpg.azurewebsites.net/api/class');
      classes = response.data;
    } catch (error) {
      console.error('Failed to fetch classes:', error);
    }
  });

  const handleCreateCharacter = async () => {
    if (!characterName || !classId) {
      errorMessage = 'Please fill in both character name and class.';
      return;
    }

    try {
      const response = await axios.post('https://csharprpg.azurewebsites.net/api/character', {
        name: characterName,
        classId,
        userId,
      });
      successMessage = 'Character created successfully!';
      errorMessage = '';
      console.log('Character created:', response.data);
    } catch (error) {
      errorMessage = 'Failed to create character. Please try again.';
      console.error('Failed to create character:', error);
    }
  };
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-base-200">
  <div class="card w-full max-w-sm shadow-2xl bg-base-100 p-6">
    <h2 class="text-2xl font-bold mb-4 text-center">Create Your Character</h2>

    <input 
      type="text" 
      placeholder="Character Name" 
      class="input input-bordered w-full mb-4"
      bind:value={characterName}
    />

    <select class="select select-bordered w-full mb-4" bind:value={classId}>
      <option value="">Select Class</option>
      {#each classes as classItem (classItem.id)}
        <option value={classItem.id}>{classItem.name}</option>
      {/each}
    </select>

    <button class="btn btn-primary w-full" on:click={handleCreateCharacter}>
      Create Character
    </button>

    {#if errorMessage}
      <p class="mt-4 text-red-500 text-center">{errorMessage}</p>
    {/if}
    {#if successMessage}
      <p class="mt-4 text-green-500 text-center">{successMessage}</p>
    {/if}
  </div>
</div>
