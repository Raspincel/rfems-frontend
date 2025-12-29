interface User {
  id: string;
  name: string;
  email: string;
}

export type ActiveUser = User & {
  approved: true;
  currentFolder: string;
  action?: {
    type: "downloading" | "uploading";
    file: string;
    progress: number;
  };
};

export type PendingUser = User & {
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

export interface UserStatusUpdated {
  userId: string;
  status: "online" | "hosting" | "offline";
}

export interface RemoveClient {
  userId: string;
}

export interface UserPathUpdated {
  clientId: string;
  path: string;
}
