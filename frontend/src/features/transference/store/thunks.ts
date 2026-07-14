import { createAsyncThunk } from "@reduxjs/toolkit";
import { requestFileDownload } from "../api";
import { APIReturn, ThunkConfig } from "../../../app/store";
import { RequestSaveDestinationSelection, RequestFileDownload } from "../types";

export const requestFileDownloadThunk = createAsyncThunk<
  APIReturn<RequestFileDownload>,
  RequestSaveDestinationSelection,
  ThunkConfig
>(
  "explorer/requestFileDownload",
  async (data, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const fileName = data.path[data.path.length - 1];

      const file = state.explorer.files.find(
        (f) => !f.isDir && f.name === fileName
      );

      if (!file) {
        return rejectWithValue({
          message: "File not found in explorer state",
        });
      }

      const response = await requestFileDownload(data.path);

      if (!response.success) {
        return rejectWithValue({
          message: response.message || "Failed to exit hosting session",
          errors: response.errors,
        });
      }

      return {
        ...response,
        data: {
          id: response.data.id,
          destinationPath: data.path.join("/"),
          originPath: response.data.originPath,
          totalBytes: file.size,
        },
      };
    } catch (error) {
      return rejectWithValue({
        message: (error as Error).message || "An unexpected error occurred",
      });
    }
  }
);
