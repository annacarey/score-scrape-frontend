<script lang="ts">
  export let isDisabled: boolean = false;
</script>

<button
  disabled={isDisabled}
  class="flex gap-2 items-center justify-center bg-[#406AFF] text-[#DCDEE9] text-[32px] px-5 py-3 rounded-md disabled:bg-[#DCDEE9] disabled:text-[#406AFF] disabled:border-2 disabled:border-[#406AFF] disabled:cursor-not-allowed"
>
  <slot />
</button>
