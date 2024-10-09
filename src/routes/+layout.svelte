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
  main {
    flex: 1;
  }
</style>
