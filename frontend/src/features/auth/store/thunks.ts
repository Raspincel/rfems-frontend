import { createAsyncThunk } from "@reduxjs/toolkit";
import { LoginResponse, Register } from "../types";
import { LoginSchema } from "../schemas/login";
import { loginUser, logoutUser } from "../api";
import { APIReturn, ThunkConfig } from "../../../app/store";

export const loginThunk = createAsyncThunk<
  APIReturn<LoginResponse>,
  LoginSchema,
  ThunkConfig
>("auth/login", async (data: LoginSchema, { rejectWithValue }) => {
  try {
    const response = await loginUser(data);

    if (!response.success) {
      return rejectWithValue({
        message: response.message || "Login failed",
      });
    }

    return response;
  } catch (err) {
    return rejectWithValue((err as any)?.response?.message || "Login failed");
  }
});

export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  try {
    const response = await logoutUser();
    return response;
  } catch (err) {
    return (err as any)?.response?.message || "Logout failed";
  }
});

const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: Register) => {}
);

const refreshTokenThunk = createAsyncThunk(
  "auth/refresh",
  async (refreshToken) => {}
);
