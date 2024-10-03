<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  let email = '';
  let password = '';
  let error = ''; // Declare error here

  // Access the base URL from environment variables
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const dispatch = createEventDispatcher();

  const handleLogin = async () => {
    try {
      const res = await fetch(baseURL + 'Login/login', {
        method: 'POST',
        body: JSON.stringify({
          email,
          password
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token); // Store token in localStorage
        localStorage.setItem('userId', data.userId); // Store userId in localStorage
        dispatch('login', { token: data.token, userId: data.userId });  // Dispatch login success
      } else {
        const errorData = await res.json(); // Get error message from the response
        error = errorData.message || 'An error occurred';
      }
    } catch (err) {
      console.log('Network error:', err);
      error = 'A network error occurred. Please try again later.';
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

  <!-- Display error message if any -->
  {#if error}
    <p class="text-red-500">{error}</p>
  {/if}
</div>
