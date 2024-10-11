import type { ConversionResult, PollResponse } from "../types";

// Replace with your app's endpoint
const API_BASE_URL =
  "https://annacarey--score-scrape-fastapi-app-dev.modal.run";

async function startConversion(videoFile: File): Promise<string> {
  const formData = new FormData();
  formData.append("video", videoFile);

  const response = await fetch(`${API_BASE_URL}/accept`, {
    method: "POST",
    body: formData,
  });

  const data: string = await response.json();

  return data;
}

async function pollResult(callId: string): Promise<PollResponse> {
  const response = await fetch(`${API_BASE_URL}/result/${callId}`);
  if (response.status === 202) {
    return {
      status: "processing",
    };
  }
  const data: ConversionResult = await response.json();
  return {
    status: "completed",
    result: data,
  };
}

export async function convertVideoToMarkdown(videoFile: File): Promise<string> {
  const callId = await startConversion(videoFile);

  while (true) {
    const pollResponse = await pollResult(callId);
    if (pollResponse.status === "completed" && pollResponse.result) {
      const result = atob(pollResponse.result.pdfBytes);
      return result;
    }
    // Wait for 5 seconds before polling again
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
}
