<script>
  import "../app.css";
</script>

<main>
  <slot />
</main>

<style>
  :global(body) {
    font-family: "Inter", sans-serif;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  :global(p) {
    font-family: "IBM Plex Serif", serif;
  }

  :global(h1, h3) {
    font-family: "Jacquard 24", serif;
  }
  main {
    flex: 1;
  }
</style>
