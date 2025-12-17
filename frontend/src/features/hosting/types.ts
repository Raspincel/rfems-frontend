export interface HostingState {
  isHosting: boolean;
  folderPath: string;
  isPublic: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface StartHostingData {
  folderPath: string;
  isPublic: boolean;
}
