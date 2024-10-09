<script lang="ts">
  import type { ConversionState } from "$lib/types";
  import { convertVideoToMarkdown } from "$lib/utils/api";
  import Dropzone from "svelte-file-dropzone";

  let file: File | null = null;
  let conversionState: ConversionState = {
    markdown: "",
    isLoading: false,
    isError: false,
  };

  const handleFileSelect = async (event: CustomEvent<File>) => {
    file = event.detail;
    if (!file) throw new Error("No file selected");

    conversionState.isLoading = true;

    try {
      conversionState.markdown = await convertVideoToMarkdown(file);
      conversionState.isLoading = false;
    } catch (error) {
      conversionState.isError = true;
    }
  };
</script>

<div
  class="flex bg-black/10 flex-col items-center justify-center w-full min-h-screen bg-gray-100"
>
  <h1 class="text-4xl font-bold text-blue-600 mb-4">Welcome to ScoreScrape!</h1>
  <div>
    <Dropzone multiple={false} on:drop={handleFileSelect}>
      <p>Upload an MP4</p></Dropzone
    >
  </div>
  {#if conversionState.markdown}
    <div class="bg-white p-4 rounded-md">
      {conversionState.markdown}
    </div>
  {/if}
</div>
