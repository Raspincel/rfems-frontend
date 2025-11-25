import { createAsyncThunk } from "@reduxjs/toolkit";
import { Register } from "../types";
import { LoginSchema } from "../schemas/login";
import { loginUser } from "../api";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (data: LoginSchema, { rejectWithValue }) => {
    try {
      const response = await loginUser(data);

      if (!response.success) {
        return rejectWithValue(response.message || "Login failed");
      }

      return response;
    } catch (err) {
      return rejectWithValue((err as any)?.response?.message || "Login failed");
    }
  }
);

const registerThunk = createAsyncThunk(
  "auth/register",
  async (data: Register) => {}
);

const refreshTokenThunk = createAsyncThunk(
  "auth/refresh",
  async (refreshToken) => {}
);
