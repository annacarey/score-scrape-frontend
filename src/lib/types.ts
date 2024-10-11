// src/lib/types.ts

export interface ConversionResult {
  markdown: string;
}

export type ConversionState = {
  pdfBytes: string | null;
  isLoading: boolean;
  isError: boolean;
};

export interface AcceptResponse {
  call_id: string;
}

export interface PollResponse {
  status: "processing" | "completed";
  result?: ConversionResult;
}
