import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../app/store";
import { AuthState } from "../types";
import { loginThunk, logoutThunk } from "./thunks";
import { toast } from "react-toastify";

const initialState: AuthState = {
  isLoggedIn: null,
  error: null,
  status: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsLoggedIn(state, action: { payload: boolean }) {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (s) => {
        s.status = "loading";
      })
      .addCase(loginThunk.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.isLoggedIn = a.payload.success;
        toast.success(a.payload.message);
      })
      .addCase(loginThunk.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message || null;
        toast.error(s.error || "Login failed");
      })
      .addCase(logoutThunk.fulfilled, (s) => {
        s.isLoggedIn = false;
        s.status = "idle";
        toast.success("Logged out successfully");
      })
      .addCase(logoutThunk.rejected, (s, a) => {
        s.error = a.error.message || null;
        toast.error(s.error || "Logout failed");
      })
      .addCase(logoutThunk.pending, (s) => {
        s.status = "loading";
      });
  },
});

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isLoggedIn === true;

export const { setIsLoggedIn } = authSlice.actions;

export default authSlice.reducer;
