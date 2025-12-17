export interface UserState {
  profile: UserProfile;
  profileStatus: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  users: BasicUserInfos[];
  usersStatus: "idle" | "loading" | "succeeded" | "failed";
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export interface BasicUserInfos {
  id: string;
  name: string;
  lastActiveAt: string | undefined;
  status: "online" | "offline" | "hosting";
  folderBeingHosted: string | null;
  activeTransfers: number;
  isPublic: boolean;
}

export type UserStatusUpdatePayload =
  | {
      userId: string;
      status: "online" | "hosting";
    }
  | {
      userId: string;
      status: "offline";
      lastActiveAt: string;
    };
