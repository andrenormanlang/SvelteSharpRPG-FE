<script>
  // Additional script logic can go here, if necessary
</script>

<svelte:head>
  <title>Legends of Runestone</title>
  <meta name="description" content="Welcome to the ultimate RPG experience. Battle monsters, level up, and become a hero! Sign in or register to get started." />
</svelte:head>

<div class="p-6 text-center retro-font">
  <h1 class="text-5xl font-bold mb-4 neon-glow">Welcome to Runestone!</h1>
  <p class="text-2xl mb-2 neon-glow">Come and battle monsters, level up, and become the ultimate hero! 🛡️🗡️</p>
  <p class="text-lg mt-4 neon-glow">Sign in or create an account to get started!</p>
</div>

<style>
  @import url('https://fonts.googleapis.com/css2?family=DotGothic16&display=swap');

  .retro-font {
    font-family: 'DotGothic16', sans-serif;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #00ff00; /* Retro green */
  }

  .neon-glow {
    transition: all 0.3s ease-in-out;
    text-shadow: 0 0 10px rgba(0, 255, 0, 0.8), 0 0 20px rgba(0, 255, 0, 0.6);
  }

  h1:hover, p:hover {
    transform: scale(1.05);
    color: #00ff00;
    text-shadow: 0 0 15px rgba(0, 255, 0, 1), 0 0 30px rgba(0, 255, 0, 0.8);
  }

  /* Ensure layout works on smaller devices */
  .p-6 {
    padding: 24px;
  }

  /* Responsive text sizes */
  h1 {
    font-size: 3.5rem;
  }

  p {
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    p {
      font-size: 1rem;
    }
  }
</style>
