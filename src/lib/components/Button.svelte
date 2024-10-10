<script lang="ts">
  export let isDisabled: boolean = false;
  export let onClick: (() => void) | undefined = undefined;
</script>

<button
  disabled={isDisabled}
  on:click={onClick}
  class="z-50 flex gap-2 items-center justify-center bg-[#406AFF] text-[#DCDEE9] text-[32px] px-5 py-3 rounded-md disabled:bg-[#DCDEE9] disabled:bg-opacity-50 disabled:text-[#406AFF] disabled:border-2 disabled:border-[#406AFF] disabled:cursor-not-allowed"
>
  <slot />
</button>
