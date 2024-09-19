<script lang="ts">
  import { onMount } from 'svelte';
  import { tweened } from 'svelte/motion';
  import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
  import axios from 'axios';
  import type { Battle } from '../types/battle';
  import type { Character } from '../types/character';


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

  // Three.js variables for player and enemy dice
  let scene: Scene;
  let camera: PerspectiveCamera;
  let renderer: WebGLRenderer;
  let playerDice: Mesh;
  let enemyDice: Mesh;
  let diceRotation = tweened(0, { duration: 500 });  // Animation timing
  let enemyDiceRotation = tweened(0, { duration: 500 });

  // Fetch battle and character data
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
      initThreeScene();
    } catch (error) {
      console.error('Error fetching battle or character details:', error);
    }
  });

  // Initialize Three.js scene and dice meshes
  function initThreeScene() {
    scene = new Scene();
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(200, 200);

    const diceContainer = document.querySelector(".dice-container");
    if (diceContainer) {
      diceContainer.appendChild(renderer.domElement);
    }

    // Create player dice
    const playerGeometry = new BoxGeometry();
    const playerMaterial = new MeshBasicMaterial({ color: 0x00ff00 });
    playerDice = new Mesh(playerGeometry, playerMaterial);
    scene.add(playerDice);

    // Create enemy dice
    const enemyGeometry = new BoxGeometry();
    const enemyMaterial = new MeshBasicMaterial({ color: 0xff0000 });
    enemyDice = new Mesh(enemyGeometry, enemyMaterial);
    enemyDice.position.x = 2;
    scene.add(enemyDice);

    // Start animation loop
    animate();
  }

  // Animation loop for rotating dice
  function animate() {
    requestAnimationFrame(animate);

    playerDice.rotation.x += 0.02;
    playerDice.rotation.y += 0.02;
    enemyDice.rotation.x += 0.02;
    enemyDice.rotation.y += 0.02;

    renderer.render(scene, camera);
  }

  // Roll dice for player and enemy
  function rollDice() {
    playerRoll = Math.floor(Math.random() * dieType) + 1;
    enemyRoll = Math.floor(Math.random() * 6) + 1;

    // Update health and result message
    if (playerRoll > enemyRoll) {
      enemyHealth -= playerRoll;
      resultMessage = `You won this round! Rolled ${playerRoll}. Enemy rolled ${enemyRoll}.`;
    } else {
      playerHealth -= enemyRoll;
      resultMessage = `You lost this round! Rolled ${playerRoll}. Enemy rolled ${enemyRoll}.`;
    }

    // End game if any player's health reaches 0
    if (playerHealth <= 0) {
      resultMessage = 'You lost the battle!';
      isBattleOver = true;
    } else if (enemyHealth <= 0) {
      resultMessage = 'You won the battle!';
      isBattleOver = true;
    }

    // Simulate dice roll animation using tweened values
    diceRotation.set(Math.random() * Math.PI * 2);  
    enemyDiceRotation.set(Math.random() * Math.PI * 2);
  }

  // Dice type adjustments
  function upType() {
    dieType = dieType === 20 ? 6 : dieType + 2;
  }

  function downType() {
    dieType = dieType === 6 ? 20 : dieType - 2;
  }
</script>

<style>
  .dice-roll {
    text-align: center;
    margin: 20px;
  }

  .health-bar {
    width: 100%;
    background-color: #ddd;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .health-fill {
    height: 20px;
    background-color: #4caf50;
    transition: width 0.5s ease;
  }

  .enemy-health-fill {
    height: 20px;
    background-color: #f44336;
    transition: width 0.5s ease;
  }

  .dice-container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 20px;
  }

  button {
    margin: 10px;
    padding: 10px;
    font-size: 18px;
    border-radius: 5px;
  }
</style>

<main>
  <div>
    <h2>{battleDetails?.battleName}</h2>
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
        <button on:click={upType}>Increase Dice Type</button>
        <button on:click={rollDice}>Roll Dice</button>
      </div>
    {/if}
  </div>

  <div class="dice-container"></div>
</main>

