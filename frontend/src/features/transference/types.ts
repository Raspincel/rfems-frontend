export interface TransferenceState {
  transferences: {
    [id: string]: {
      status: "requesting" | "completed" | "error" | "progress";
      type: "upload" | "download";
      origin: string;
      destination: string;
      progress: number;
      totalBytes: number;
      error: string | null;
    };
  };
}

export interface RequestSaveDestinationSelection {
  path: string[];
}
export interface RequestFileDownload {
  id: string;
  destinationPath: string;
  originPath: string;
  totalBytes: number;
}

export interface DownloadUpdate {
  id: string;
  progress: number;
}
