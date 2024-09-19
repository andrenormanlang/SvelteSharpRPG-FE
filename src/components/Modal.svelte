<script lang="ts">
  export let title: string;
  export let closeModal: () => void;
  
  let dialogElement: HTMLDialogElement;

  const handleClose = () => {
    dialogElement.close();  // Close the dialog
    closeModal();  // Call parent-provided function to handle additional modal closing logic
  };

  export function open() {
    dialogElement.showModal();
  }

  $: {
    if (dialogElement) {
      dialogElement.showModal();
    }
  }
</script>

<!-- Use Tailwind classes for the modal -->
<dialog bind:this={dialogElement} class="modal fixed inset-0 z-50 flex items-center justify-center">
  <div class="modal-box bg-base-100 p-6 shadow-lg rounded-lg relative w-full max-w-md mx-auto">
    <!-- X Close Icon at the top-right corner -->
    <button class="absolute top-3 right-3 text-gray-400 hover:text-gray-600" on:click={handleClose}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <h3 class="font-bold text-lg text-center">{title}</h3>
    <div class="py-4">
      <slot></slot> <!-- Slot for child content -->
    </div>
  </div>
</dialog>

<style>
  /* Style the backdrop to cover the entire screen with a fade */
  dialog::backdrop {
     /* Semi-transparent black background */
    position: fixed;
    top: 0;
    left: 0;

   ; /* Ensure it's behind the modal but in front of the rest of the content */
  }
</style>
