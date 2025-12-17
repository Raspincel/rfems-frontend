export interface ExplorerState {
  path: string;
  folders: string[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
