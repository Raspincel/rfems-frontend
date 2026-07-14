export type Folder = {
  name: string;
  isDir: true;
};

export type File = {
  name: string;
  isDir: false;
  size: number;
};

export interface ExplorerState {
  hostID: string | null;
  connected: boolean;
  path: string[];
  folders: Folder[];
  files: File[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface RequestFilesList {
  path: string[];
}

export interface ConnectToHostData {
  hostId: string;
}

export interface ConnectToHostResponse {
  ticket: string;
}

export interface DisconnectFromHostData {
  hostId: string;
  reason: string;
}

export interface UpdateFilesList {
  path: string[];
  files: Array<File | Folder>;
}

export interface OpenFolder {
  folderName: string;
}

export interface ContextMenuData {
  x: number;
  y: number;
  item: { name: string; isDir: boolean };
}
