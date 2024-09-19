<script lang="ts">
  import { onMount } from 'svelte';
  import { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh, TextureLoader } from 'three';
  import { tweened } from 'svelte/motion'; // For dice animations

  let scene: Scene;
  let camera: PerspectiveCamera;
  let renderer: WebGLRenderer;
  let dice: Mesh;
  let isRolling = false;

  // Set roll duration for the dice animation
  let rollDuration = 2000;

  onMount(() => {
    // Create scene
    scene = new Scene();

    // Create camera
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Create WebGLRenderer and attach it to the DOM
    renderer = new WebGLRenderer({ antialias: true });
    const diceContainer = document.querySelector('.dice-container');
    if (diceContainer) {
      diceContainer.appendChild(renderer.domElement);
    }
    renderer.setSize(300, 300);

    // Load dice face textures
    const loader = new TextureLoader();
    const materials = [
      new MeshBasicMaterial({ map: loader.load('/static/dice-face-1.png') }), // Use your uploaded dice textures here
      new MeshBasicMaterial({ map: loader.load('/static/dice-face-2.png') }),
      new MeshBasicMaterial({ map: loader.load('/static/dice-face-3.png') }),
      new MeshBasicMaterial({ map: loader.load('/static/dice-face-4.png') }),
      new MeshBasicMaterial({ map: loader.load('/static/dice-face-5.png') }),
      new MeshBasicMaterial({ map: loader.load('/static/dice-face-6.png') })
    ];

    // Create dice (cube) with textures applied to each face
    const geometry = new BoxGeometry(1, 1, 1);
    dice = new Mesh(geometry, materials);
    scene.add(dice);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      if (isRolling) {
        dice.rotation.x += 0.1;
        dice.rotation.y += 0.1;
      }
      renderer.render(scene, camera);
    };
    animate();
  });

  // Simulate dice roll
  function rollDice() {
    if (isRolling) return;
    isRolling = true;

    // Randomize dice rotation
    const targetRotationX = Math.random() * Math.PI * 4;
    const targetRotationY = Math.random() * Math.PI * 4;

    // Animate dice rotation and simulate dice stop
    tweened(dice.rotation.x, { duration: rollDuration }).set(targetRotationX);
    tweened(dice.rotation.y, { duration: rollDuration }).set(targetRotationY);

    setTimeout(() => {
      isRolling = false;
      // Get random result between 1 and 6
      const result = Math.floor(Math.random() * 6) + 1;
      console.log('Dice result:', result);
      // Optionally display result to user
    }, rollDuration);
  }
</script>

<style>
  .dice-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
  }

  button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #0056b3;
  }
</style>

<div class="dice-container"></div>
<button on:click={rollDice} disabled={isRolling}>Roll Dice</button>
