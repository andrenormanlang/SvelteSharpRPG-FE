<script lang="ts">
	import { Icon, Bars3, type IconSource } from 'svelte-hero-icons';
	import { goto } from '$app/navigation';
	export let isLoggedIn: boolean;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let isMenuOpen = false;

	const toggleMenu = () => {
		isMenuOpen = !isMenuOpen;
	};

	const handleLogin = () => {
		dispatch('openLogin');
		isMenuOpen = false;
	};

	const handleRegister = () => {
		dispatch('openRegister');
		isMenuOpen = false;
	};

	const handleLogout = () => {
		dispatch('logout');
		isMenuOpen = false;
	};

	export let icon: IconSource = Bars3;
</script>

<nav class="navbar bg-black shadow-md p-4 flex items-center justify-between retro-font text-green-400 neon-blue-bg">
	<!-- Title or Icon -->
	<div class="flex items-center space-x-2">
		<a href="/" class="text-xl font-bold hover:neon-glow">🧙‍♂️🪄 LEGENDS OF RUNESTONE RPG 🧝⚔️</a>
	</div>

	<!-- Dropdown Menu -->
	<div class="relative">
		<button on:click={toggleMenu} class="btn btn-ghost flex items-center space-x-1">
			<Icon src="{icon}" class="w-6 h-6 text-green-400 hover:neon-glow" />
		</button>

		{#if isMenuOpen}
		<ul class="absolute right-0 top-full mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg z-10 neon-border">
			{#if !isLoggedIn}
			<li>
				<button
					on:click={handleLogin}
					class="w-full text-left px-4 py-2 hover:bg-indigo-500 hover:text-white transition-colors duration-200 hover:neon-glow"
				>
					Login
				</button>
			</li>
			{:else}
			<li>
				<button
					on:click={() => goto('/battle')}
					class="w-full text-left px-4 py-2 hover:bg-indigo-500 hover:text-white transition-colors duration-200 hover:neon-glow"
				>
					Battles
				</button>
			</li>
			<li>
				<button
					on:click={handleLogout}
					class="w-full text-left px-4 py-2 hover:bg-indigo-500 hover:text-white transition-colors duration-200 hover:neon-glow"
				>
					Logout
				</button>
			</li>
			{/if}
		</ul>
		{/if}
	</div>
</nav>

<style>
	@import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');

	.retro-font {
		font-family: 'DotGothic16', sans-serif;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	/* Neon Glow Effect */
	.neon-glow {
		transition: all 0.2s ease-in-out;
		color: #00ff00;
	}

	.neon-glow:hover {
		color: #00ff00;
		text-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.6);
	}

	/* Blue Neon Glow for Navbar Background */
	.neon-blue-bg {
		background-color: black;
		box-shadow: 0 0 15px rgba(0, 119, 255, 0.8), 0 0 30px rgba(0, 119, 255, 0.6);
	}

	/* Neon Border */
	.neon-border {
		border: 2px solid #00ff00;
		box-shadow: 0px 0px 8px rgba(0, 255, 0, 0.7);
	}

	/* Menu Button Hover Animation */
	.btn:hover {
		transform: scale(1.05);
		transition: transform 0.3s ease;
	}

	.btn:active {
		transform: scale(0.95);
	}
</style>

  
