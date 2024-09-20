<!-- TODO Integrate this to Battle and Navbar -->

<script lang="ts">
    import { muteAudio, rollOnTemplate, useDarkTheme } from "../stores/preferenceStore";
    import { browser } from '$app/environment'; // Import browser check from SvelteKit
  
    let muted: boolean;
    muteAudio.subscribe((x) => {
      muted = x;
    });
  
    let darkTheme: boolean;
    useDarkTheme.subscribe((x) => {
      darkTheme = x;
    });
  
    let autoRoll: boolean;
    rollOnTemplate.subscribe((x) => {
      autoRoll = x;
    });
  
    // Function to apply the theme, only runs on the client
    const setTheme = (theme: string) => {
      if (browser) {
        document.documentElement.style.setProperty(
          "--background-color",
          `var(--background-color-${theme})`
        );
        document.documentElement.style.setProperty(
          "--text-color",
          `var(--text-color-${theme})`
        );
        document.documentElement.style.setProperty(
          "--panel-color",
          `var(--panel-color-${theme})`
        );
      }
    };
  
    // Reactive block to handle theme change
    $: {
      let theme = darkTheme ? "dark" : "light";
      setTheme(theme);
    }
  </script>
  
  <div class="util-panel shadow">
    <!-- <button class="non-selectable" on:click={() => (autoRoll = !autoRoll)}>
      Auto roll: {autoRoll ? "on" : "off"}
    </button>
    <button class="non-selectable" on:click={() => (muted = !muted)}>
      Mute sound: {muted ? "on" : "off"}
    </button>
    <button class="non-selectable" on:click={() => (darkTheme = !darkTheme)}>
      Theme: {darkTheme ? "dark" : "light"}
    </button> -->
  </div>
  
  <style>
    .util-panel {
      z-index: 1;
      position: fixed;
      top: 0.4rem;
      right: 0.4rem;
      background-color: var(--panel-color);
      border-radius: 0.3rem;
      font-size: 0.8rem;
      display: grid;
      padding: 0.3rem;
    }
    .util-panel button {
      cursor: pointer;
      padding: 0.2rem;
      border-radius: 0.3rem;
      margin-top: 0.2rem;
      background-color: var(--statement-color);
    }
  </style>
  