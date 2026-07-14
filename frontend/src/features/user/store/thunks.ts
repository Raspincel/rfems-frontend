import { createAsyncThunk } from "@reduxjs/toolkit";
import { getUsersList, getMe } from "../api";

export const fetchUserThunk = createAsyncThunk("user/fetchUser", async () => {
  try {
    const response = await getMe();

    if (!response.success) {
      return response.message || "Fetching user profile failed";
    }

    return response.data;
  } catch (err) {
    return (err as any)?.response?.message || "Fetching user profile failed";
  }
});

export const fetchBasicUsersInfosThunk = createAsyncThunk(
  "user/fetchBasicUsersInfos",
  async () => {
    try {
      const response = await getUsersList();

      if (!response.success) {
        return response.message || "Fetching users info failed";
      }

      return response.data;
    } catch (err) {
      return (err as any)?.response?.message || "Fetching users info failed";
    }
  }
);
