import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUserThunk = createAsyncThunk("user/fetchUser", async () => {
  const response = await fetch(`/api/users/me`);
  const data = await response.json();
  return data;
});
