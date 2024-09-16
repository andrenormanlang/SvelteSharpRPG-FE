<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  let email = '';
  let password = '';
  let name = '';

  const dispatch = createEventDispatcher();

  const handleRegister = async () => {
    try {
      const response = await fetch('https://csharprpg.azurewebsites.net/api/User/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      // Dispatch the register event
      dispatch('register');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };
</script>

<div class="flex flex-col space-y-4">
  <input 
    type="text" 
    bind:value={name} 
    placeholder="Name" 
    class="input input-bordered w-full text-sm p-2" 
  />
  
  <input 
    type="email" 
    bind:value={email} 
    placeholder="Email" 
    class="input input-bordered w-full text-sm p-2" 
  />
  
  <input 
    type="password" 
    bind:value={password} 
    placeholder="Password" 
    class="input input-bordered w-full text-sm p-2" 
  />
  
  <button on:click={handleRegister} class="btn btn-primary w-full">Register</button>
</div>
