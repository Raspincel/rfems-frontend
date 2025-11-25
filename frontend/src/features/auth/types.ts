export interface AuthState {
  isLoggedIn: boolean | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

export interface LoginRequest {
  handle: string;
  email: string;
  password: string;
}

export interface Register {}
