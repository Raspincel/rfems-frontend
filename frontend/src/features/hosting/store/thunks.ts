import { createAsyncThunk } from "@reduxjs/toolkit";
import { StartHostingData } from "../types";
import { startHosting, stopHosting } from "../api";
import { APIReturn, ThunkConfig } from "../../../app/store";

export const startHostingThunk = createAsyncThunk<
  APIReturn<void>,
  StartHostingData,
  ThunkConfig
>("hosting/start", async (data: StartHostingData, { rejectWithValue }) => {
  try {
    const name = data.folderPath.split("/").pop()?.split("/").pop();

    if (!name) {
      return rejectWithValue({ message: "Invalid folder path" });
    }

    const response = await startHosting(name, data.isPublic);

    if (!response.success) {
      return rejectWithValue(response);
    }

    return response;
  } catch (err) {
    return rejectWithValue((err as any)?.response?.message || "Login failed");
  }
});

export const stopHostingThunk = createAsyncThunk<
  APIReturn<void>,
  void,
  ThunkConfig
>("hosting/stop", async (_, { rejectWithValue }) => {
  try {
    const response = await stopHosting();

    if (!response.success) {
      return rejectWithValue(response);
    }

    return response;
  } catch (err) {
    return rejectWithValue({
      message: (err as any)?.response?.message || "Failed to stop hosting",
    });
  }
});
