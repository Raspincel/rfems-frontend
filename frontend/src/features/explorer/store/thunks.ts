import { createAsyncThunk } from "@reduxjs/toolkit";
import { connectToHost } from "../api";
import { APIReturn, ThunkConfig } from "../../../app/store";
import { ConnectToHostData } from "../types";

export const connectToHostThunk = createAsyncThunk<
  APIReturn<{ token: string }>,
  ConnectToHostData,
  ThunkConfig
>("explorer/connectToHost", async (data, { rejectWithValue }) => {
  try {
    const response = await connectToHost(data.hostId);

    if (!response.success) {
      return rejectWithValue({
        message: response.message || "Failed to connect to host",
        errors: response.errors,
      });
    }

    return response;
  } catch (error) {
    return rejectWithValue({
      message: (error as Error).message || "An unexpected error occurred",
    });
  }
});
