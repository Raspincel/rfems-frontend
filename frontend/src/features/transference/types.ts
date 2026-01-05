export interface TransferenceState {
  transferences: {
    [id: string]: {
      status: "requesting" | "completed" | "error" | "progress";
      type: "upload" | "download";
      origin: string;
      destination: string;
      progress: number; // 0 to 10000
      error: string | null;
    };
  };
}

export interface RequestSaveDestinationSelection {
  path: string[];
}
export interface SelectSaveDestinationResponse {
  id: string;
  destinationPath: string;
  originPath: string;
}
