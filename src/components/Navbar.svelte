<script lang="ts">
  import { Icon, Bars3, type IconSource } from 'svelte-hero-icons'; // Import the icon as Bars3 and Icon component
  
  export let isLoggedIn: boolean;

  // Dispatch custom events for login, register, and logout
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let isMenuOpen = false;

  const toggleMenu = () => {
    isMenuOpen = !isMenuOpen;
  };

  const handleLogin = () => {
    dispatch('openLogin');  // Dispatch the openLogin event
    isMenuOpen = false;
  };

  const handleRegister = () => {
    dispatch('openRegister');  // Dispatch the openRegister event
    isMenuOpen = false;
  };

  const handleLogout = () => {
    dispatch('logout');  // Dispatch the logout event
    isMenuOpen = false;
  };

  // Rename Bars3 to MenuIcon for usage
  export let icon: IconSource = Bars3;
</script>

<nav class="navbar bg-base-100 shadow-md p-4 flex items-center justify-between">
	<!-- Title or Icon -->
	<div class="flex items-center space-x-2">
	  <a href="/" class="text-xl font-bold">🧙‍♂️🪄🧝⚔️</a>
	</div>
  
	<!-- Dropdown Menu -->
	<div class="relative">
	  <button on:click={toggleMenu} class="btn btn-ghost flex items-center space-x-1">
		<!-- Use the MenuIcon from Heroicons for the hamburger menu -->
		<Icon src="{icon}" class="w-6 h-6 text-gray-500 hover:text-gray-700" />
	  </button>
  
	  {#if isMenuOpen}
		<!-- Ensure the dropdown is properly positioned below the navbar -->
		<ul class="absolute right-0 top-full mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg z-10">
		  {#if !isLoggedIn}
			<li>
			  <button on:click={handleLogin} class="w-full text-left px-4 py-2 bg-gray-800 hover:bg-indigo-500 hover:text-white transition-colors duration-200">
				Login
			  </button>
			</li>
		  {:else}
			<li>
			  <a href="/battle" class="w-full text-left px-4 py-2 bg-gray-800 hover:bg-indigo-500 hover:text-white transition-colors duration-200">
				Battles
			  </a>
			</li>
			<li>
			  <button on:click={handleLogout} class="w-full text-left px-4 py-2 bg-gray-800 hover:bg-indigo-500 hover:text-white transition-colors duration-200">
				Logout
			  </button>
			</li>
		  {/if}
		</ul>
	  {/if}
	</div>
  </nav>
  
