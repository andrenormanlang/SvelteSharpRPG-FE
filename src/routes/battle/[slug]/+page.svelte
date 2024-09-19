<script lang="ts">
  import { onMount } from 'svelte';
  import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader, Group } from 'three';

  let scene: Scene;
  let camera: PerspectiveCamera;
  let renderer: WebGLRenderer;
  let diceGroup: Group;  // Group to hold all dice
  let diceOptions = [4, 6, 8, 10, 12, 20]; // Available dice types
  let selectedDice = [6, 20];  // Default dice selection
  let rollResults = [];
  let totalRoll = 0;
  let isRolling = false;

  onMount(() => {
    scene = new Scene();

    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 10;

    renderer = new WebGLRenderer({ antialias: true });
    const diceContainer = document.querySelector('.dice-container');
    if (diceContainer) {
      diceContainer.appendChild(renderer.domElement);
    }
    renderer.setSize(400, 400);

    diceGroup = new Group();
    scene.add(diceGroup);

    // Initialize dice
    selectedDice.forEach((dice) => {
      addDiceToScene(dice);
    });

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      if (isRolling) {
        diceGroup.rotation.x += 0.05;
        diceGroup.rotation.y += 0.05;
      }
      renderer.render(scene, camera);
    };
    animate();
  });

  // Add a dice to the scene
  function addDiceToScene(diceType: number) {
    const geometry = new BoxGeometry(1, 1, 1);  // Use different geometry for various dice types
    const material = new MeshBasicMaterial({ color: Math.random() * 0xffffff });
    const dice = new Mesh(geometry, material);

    dice.position.x = Math.random() * 4 - 2;  // Random positioning
    dice.position.y = Math.random() * 4 - 2;

    diceGroup.add(dice);
  }

  // Remove all dice from the scene and reinitialize
  function resetScene() {
    diceGroup.clear();
    selectedDice.forEach((dice) => {
      addDiceToScene(dice);
    });
  }

  // Function to roll dice
  function rollAllDice() {
    if (isRolling) return;
    isRolling = true;
    rollResults = [];
    totalRoll = 0;

    // Simulate dice roll (stop after some time)
    setTimeout(() => {
      diceGroup.rotation.x = 0;
      diceGroup.rotation.y = 0;
      isRolling = false;

      // Generate roll results
      selectedDice.forEach((dice) => {
        const result = Math.floor(Math.random() * dice) + 1;
        rollResults.push(result);
        totalRoll += result;
      });
    }, 2000);  // Simulate 2-second dice roll
  }

  // Add a new dice type to the selected dice array
  function addDice(diceType: number) {
    selectedDice.push(diceType);
    resetScene();
  }

  // Remove a dice from the selected list
  function removeDice(index: number) {
    selectedDice.splice(index, 1);
    resetScene();
  }
</script>

<style>
  .dice-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    margin-bottom: 20px;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0056b3;
  }

  .dice-selector {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
  }

  .total-display {
    font-size: 32px;
    font-weight: bold;
  }
</style>

<!-- UI Layout -->
<h2>Roll Dice</h2>
<div class="dice-container"></div>

<!-- Roll button -->
<div>
  <button on:click={rollAllDice} disabled={isRolling}>Roll</button>
</div>

<!-- Total result display -->
<h3>Total: <span class="total-display">{totalRoll}</span></h3>

<!-- Dice options to select from -->
<div class="dice-selector">
  {#each diceOptions as dice}
    <button on:click={() => addDice(dice)} class="dice-option">D{dice}</button>
  {/each}
  <button on:click={() => removeDice(selectedDice.length - 1)} class="dice-option">Remove Dice</button>
</div>
