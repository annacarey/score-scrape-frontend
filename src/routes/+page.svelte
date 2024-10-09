<script lang="ts">
  import type { ConversionState } from "$lib/types";
  import { convertVideoToMarkdown } from "$lib/utils/api";
  import Dropzone from "svelte-file-dropzone";
  import VectorSvg from "$lib/assets/Vector.svg";
  import Group from "$lib/assets/Group.png";
  import Download from "$lib/assets/Download.png";

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
  class="flex bg-[#DCDEE9] flex-col items-center justify-center w-full min-h-screen bg-gray-100 gap-4"
>
  <div class="flex gap-2 items-center">
    <h1 class="text-[110px] text-blue-600 leading-none">ScoreScraper</h1>
    <img src={VectorSvg} alt="Vector" />
  </div>
  <p class="text-[#0D42FFB2] text-[28px]">
    Download sheet music from YouTube videos
  </p>
  <div class="flex gap-4 mt-4">
    <button
      class="bg-[#406AFF] text-[#DCDEE9] text-[32px] px-5 py-3 rounded-md font-normal"
    >
      <Dropzone
        disableDefaultStyles
        multiple={false}
        on:drop={handleFileSelect}
      >
        <p>Upload MP4</p></Dropzone
      >
    </button>
    <button
      on:click={handleDownload}
      disabled={!conversionState.pdfBytes}
      class="bg-blue-500 text-[#406AFF66] px-5 py-3 rounded-md text-[32px] border-2 border-[#406AFF66] bg-[#DCDEE9] flex gap-1 items-center"
    >
      <p>Download</p>
      <img src={Download} alt="Download" />
    </button>
  </div>
  <div class="absolute right-0">
    <img class="lg:w-[700px] w-[400px]" src={Group} alt="" />
  </div>
</div>
