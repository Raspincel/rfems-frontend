export interface UserState {
  profile: null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}
