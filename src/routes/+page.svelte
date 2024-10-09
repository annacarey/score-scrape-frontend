<script lang="ts">
  import type { ConversionState } from "$lib/types";
  import { convertVideoToMarkdown } from "$lib/utils/api";
  import Dropzone from "svelte-file-dropzone";

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
      console.log("conversionState.pdfBytes", conversionState.pdfBytes);
      conversionState.isLoading = false;
    } catch (error) {
      console.error("error", error);
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
  class="flex bg-black/10 flex-col items-center justify-center w-full min-h-screen bg-gray-100"
>
  <h1 class="text-4xl font-bold text-blue-600 mb-4">Welcome to ScoreScrape!</h1>
  <p>Download sheet music from YouTube videos</p>
  <div>
    <Dropzone multiple={false} on:drop={handleFileSelect}>
      <p>Upload an MP4</p></Dropzone
    >
  </div>
  <button
    on:click={handleDownload}
    disabled={!conversionState.pdfBytes}
    class="bg-blue-500 text-white px-4 py-2 rounded-md"
  >
    Download
  </button>
</div>
