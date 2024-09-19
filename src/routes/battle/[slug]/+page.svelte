<script lang="ts">
  import { onMount } from 'svelte';
  import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
  import { tweened } from 'svelte/motion';
  import { page } from '$app/stores';
  import axios from 'axios';

  // Import types for battles and characters
  import type { Battle } from '../../../types/battle';
  import type { Character } from '../../../types/character';

  let battleDetails: Battle | null = null;
  let character: Character | null = null;
  let playerRoll = 0;
  let enemyRoll = 0;
  let resultMessage = '';
  let isBattleOver = false;
  let slug = '';
  let playerHealth = 100;
  let enemyHealth = 100;
  let currentRound = 1;
  let maxRounds = 3;

  // Dice settings
  let diceNum = 1;
  let dieType = 6;  // Default to a 6-sided die for now
  let result = 0;

  // Three.js variables
  let diceRotation = tweened(0, { duration: 400 });
  let enemyDiceRotation = tweened(0, { duration: 400 });
  let scene: Scene;
  let camera: PerspectiveCamera;
  let renderer: WebGLRenderer;
  let playerDice: Mesh;
  let enemyDice: Mesh;

  $: slug = $page.params.slug;

  onMount(async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const battleResponse = await axios.get(`https://localhost:5000/api/battle/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      battleDetails = battleResponse.data;

      const characterResponse = await axios.get(`https://localhost:5000/api/character/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      character = characterResponse.data[0];
      
      // Initialize Three.js scene
      scene = new Scene();
      camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;
      renderer = new WebGLRenderer();

      const diceContainer = document.querySelector(".dice-container");
      if (diceContainer) {
        diceContainer.appendChild(renderer.domElement);
      }

      renderer.setSize(200, 200);

      // Create player dice (Cube)
      const geometry = new BoxGeometry();
      const playerMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
      playerDice = new Mesh(geometry, playerMaterial);
      scene.add(playerDice);

      // Create enemy dice (Cube)
      const enemyMaterial = new MeshBasicMaterial({ color: 0xff0000 });
      enemyDice = new Mesh(geometry, enemyMaterial);
      enemyDice.position.x = -2; // Position enemy dice next to the player's dice
      scene.add(enemyDice);

      // Start the render loop
      const animate = function () {
        requestAnimationFrame(animate);
        playerDice.rotation.x += 0.01;
        playerDice.rotation.y += 0.01;
        enemyDice.rotation.x += 0.01;
        enemyDice.rotation.y += 0.01;
        renderer.render(scene, camera);
      };
      animate();
      
    } catch (error) {
      console.error('Failed to fetch battle and character details:', error);
    }
  });

  // Rolling logic
  function rollDice() {
    playerRoll = Math.floor(Math.random() * dieType) + 1;  // Simulate the player dice roll
    enemyRoll = Math.floor(Math.random() * 6) + 1;         // Simulate the enemy dice roll (D6)
    
    if (playerRoll > enemyRoll) {
      enemyHealth -= playerRoll;
      resultMessage = 'You won this round!';
    } else {
      playerHealth -= enemyRoll;
      resultMessage = 'You lost this round!';
    }

    if (playerHealth <= 0) {
      resultMessage = 'You lost the battle!';
      isBattleOver = true;
    } else if (enemyHealth <= 0) {
      resultMessage = 'You won the battle!';
      isBattleOver = true;
    }

    diceRotation.set(Math.random() * 6 + 1);  // Trigger the dice animation
    enemyDiceRotation.set(Math.random() * 6 + 1); // Trigger enemy dice animation
  }

  function upNum() {
    diceNum++;
  }

  function downNum() {
    diceNum = Math.max(1, diceNum);
  }

  function upType() {
    dieType = dieType === 20 ? 4 : dieType + 2; // Cycle through common die types
  }

  function downType() {
    dieType = dieType === 4 ? 20 : dieType - 2;
  }
</script>

<style>
  .dice-roll {
    font-family: 'Courier New', Courier, monospace;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .health-bar {
    width: 100%;
    background-color: #ccc;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
  }
  
  .health-fill {
    height: 20px;
    background-color: #4caf50;
    transition: width 0.5s ease;
  }

  .enemy-health-fill {
    background-color: #ff4d4d;
    transition: width 0.5s ease;
  }

  .dice-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 200px;
    margin-top: 20px;
  }
</style>

<main>
  <div>
    <h2>Battle: {battleDetails?.battleName}</h2>
    <div class="health-bar">
      <div class="health-fill" style="width: {playerHealth}%"></div>
    </div>
    <div class="health-bar">
      <div class="enemy-health-fill" style="width: {enemyHealth}%"></div>
    </div>
    <h4>{resultMessage}</h4>

    {#if !isBattleOver}
      <div class="dice-roll">
        <h4>Roll {diceNum} D{dieType}</h4>
        <button on:click={upNum}>Increase Dice Number</button>
        <button on:click={downNum}>Decrease Dice Number</button>
        <button on:click={upType}>Increase Dice Type</button>
        <button on:click={downType}>Decrease Dice Type</button>
        <button on:click={rollDice} class="btn btn-primary">Start Battle</button>
      </div>
    {/if}
  </div>

  <div class="dice-container"></div>
</main>

