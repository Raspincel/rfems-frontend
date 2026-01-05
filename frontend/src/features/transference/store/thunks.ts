import { createAsyncThunk } from "@reduxjs/toolkit";
import { requestFileDownload } from "../api";
import { APIReturn, ThunkConfig } from "../../../app/store";
import {
  RequestSaveDestinationSelection,
  SelectSaveDestinationResponse,
} from "../types";

export const requestFileDownloadThunk = createAsyncThunk<
  APIReturn<SelectSaveDestinationResponse>,
  RequestSaveDestinationSelection,
  ThunkConfig
>("explorer/selectFileSaveDestionation", async (data, { rejectWithValue }) => {
  try {
    const response = await requestFileDownload(data.path);

    if (!response.success) {
      return rejectWithValue({
        message: response.message || "Failed to exit hosting session",
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
