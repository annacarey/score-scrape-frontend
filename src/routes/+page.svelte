<script lang="ts">
  import type { ConversionState } from "$lib/types";
  import { convertVideoToMarkdown } from "$lib/utils/api";
  import Dropzone from "svelte-file-dropzone";
  import VectorSvg from "$lib/assets/Vector.svg";
  import Group from "$lib/assets/Group.png";
  import Download from "$lib/assets/Download.png";
  import Button from "$lib/components/Button.svelte";

  let file: File | null = null;
  let conversionState: ConversionState = {
    pdfBytes: null,
    isLoading: false,
    isError: false,
  };

  const handleFileSelect = async (event: CustomEvent<any>) => {
    file = event.detail.acceptedFiles[0];
    if (!file) throw new Error("No file selected");

    conversionState.isLoading = true;

    try {
      conversionState.pdfBytes = await convertVideoToMarkdown(file);
      conversionState.isLoading = false;
    } catch (error) {
      conversionState.isError = true;
    }
  };

  const handleDownload = () => {
    // Create a Blob from the PDF bytes
    if (!conversionState.pdfBytes) return;

    const bytes = new Uint8Array(conversionState.pdfBytes.length);
    for (let i = 0; i < conversionState.pdfBytes.length; i++) {
      bytes[i] = conversionState.pdfBytes.charCodeAt(i);
    }

    const blob = new Blob([conversionState.pdfBytes], {
      type: "application/pdf",
    });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create an anchor element to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "sheet_music.pdf";

    // Append the anchor to the body, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Revoke the object URL to free up memory
    URL.revokeObjectURL(url);
  };
</script>

<div
  class="flex bg-[#DCDEE9] flex-col items-center justify-center w-full min-h-screen bg-gray-100 gap-2"
>
  {#if conversionState.isLoading}
    <img
      src={VectorSvg}
      alt="Vector"
      class="vector-image vector-image-animated"
    />
  {:else}
    <img src={VectorSvg} alt="Vector" class="vector-image" />
  {/if}
  <div class="flex gap-2 items-center">
    <h1 class="lg:text-[140px] text-[110px] text-blue-600 leading-none">
      ScoreScraper
    </h1>
  </div>
  <p class="text-[#0D42FFB2] text-[28px]">
    Download sheet music from video files
  </p>
  <div class="flex gap-4 mt-4">
    <Button isDisabled={conversionState.isLoading}>
      <Dropzone
        class={conversionState.isLoading ? "cursor-not-allowed" : ""}
        disableDefaultStyles
        multiple={false}
        on:drop={handleFileSelect}
      >
        <p>Upload video</p></Dropzone
      >
    </Button>
    <button
      class="flex gap-2 items-center justify-center bg-[#406AFF] text-[#DCDEE9] text-[32px] px-5 py-3 rounded-md disabled:bg-[#DCDEE9] disabled:text-[#406AFF] disabled:border-2 disabled:border-[#406AFF] disabled:cursor-not-allowed"
      on:click={handleDownload}
      disabled={!conversionState.pdfBytes}
    >
      <p>Download</p>
      <img src={Download} alt="Download" />
    </button>
  </div>
  {#if conversionState.isError}
    <p class="text-red-500">There was an error. Please try again</p>
  {/if}
  <div class="absolute right-0 z-index--1">
    <img class="lg:w-[700px] w-[400px]" src={Group} alt="" />
  </div>
</div>

<style>
  .vector-image {
    position: absolute;
    top: calc(50% - 220px);
    left: 50%;
  }
  .vector-image-animated {
    transform: translate(-50%, -50%);
    animation: spin 1s ease-in-out infinite;
  }

  @keyframes spin {
    from {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
</style>
