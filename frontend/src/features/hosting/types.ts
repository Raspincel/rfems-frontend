interface User {
  id: string;
  name: string;
}

type ActiveUser = User & {
  approved: true;
  currentFolder: string;
  action?: {
    type: "downloading" | "uploading";
    file: string;
    progress: number;
  };
};

type PendingUser = User & {
  approved: false;
  requestedAt: string;
};

export interface HostingState {
  isHosting: boolean;
  folderPath: string;
  isPublic: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  users: (ActiveUser | PendingUser)[];
}

export interface StartHostingData {
  folderPath: string;
  isPublic: boolean;
}
