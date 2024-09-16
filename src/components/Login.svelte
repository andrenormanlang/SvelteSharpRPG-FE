<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  let email = '';
  let password = '';

  const dispatch = createEventDispatcher();

  const handleLogin = async () => {
    try {
      const response = await fetch('https://csharprpg.azurewebsites.net/api/Login/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      const token = data.token;
      const userId = data.userId;

      // Dispatch login event with token and userId
      dispatch('login', { token, userId });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
</script>

<div class="flex flex-col space-y-4">
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
  <button on:click={handleLogin} class="btn btn-primary w-full">Login</button>
</div>
