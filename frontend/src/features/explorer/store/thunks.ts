import { createAsyncThunk } from "@reduxjs/toolkit";
import { connectToHost, requestFiles } from "../api";
import { APIReturn, ThunkConfig } from "../../../app/store";
import {
  ConnectToHostData,
  ConnectToHostResponse,
  RequestFilesList,
} from "../types";

export const connectToHostThunk = createAsyncThunk<
  APIReturn<ConnectToHostResponse>,
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

export const requestFilesListThunk = createAsyncThunk<
  APIReturn<void>,
  RequestFilesList,
  ThunkConfig
>("explorer/requestFilesList", async (data, { rejectWithValue }) => {
  try {
    const response = await requestFiles(data.path);

    if (!response.success) {
      return rejectWithValue({
        message: response.message || "Failed to retrieve files",
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
