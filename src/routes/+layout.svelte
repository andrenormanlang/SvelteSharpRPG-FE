<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import Navbar from '../components/Navbar.svelte';
  import Modal from '../components/Modal.svelte';
  import Login from '../components/Login.svelte';
  import "../app.css";

  let isLoggedIn = false;
  let isLoginModalOpen = false;
  let isRegisterModalOpen = false;
  let userId: string | null = null;

  // Function to handle login logic
  const handleLogin = async (token: string, newUserId: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', newUserId);
    isLoggedIn = true;
    userId = newUserId;
    closeLoginModal();

    // Navigate to the battle list after successful login
    goto('/battle');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    isLoggedIn = false;
    userId = null;
    goto('/');
  };

  onMount(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (token && storedUserId) {
      isLoggedIn = true;
      userId = storedUserId;
    } else if (window.location.pathname === '/') {
      goto('/');
    }
  });

  const openLoginModal = () => {
    isLoginModalOpen = true;
  };

  const closeLoginModal = () => {
    isLoginModalOpen = false;
  };
</script>

<!-- Navbar with login/logout functionality -->
<Navbar
  {isLoggedIn}
  on:logout={handleLogout}
  on:openLogin={openLoginModal}
/>

<!-- Login Modal -->
{#if isLoginModalOpen}
  <Modal title="Login" closeModal={closeLoginModal} on:close={closeLoginModal}>
    <Login on:login={(event) => handleLogin(event.detail.token, event.detail.userId)} />
  </Modal>
{/if}

<main>
  <slot />
</main>
