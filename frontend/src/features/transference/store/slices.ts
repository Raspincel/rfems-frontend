import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DownloadUpdate, TransferenceState } from "../types";
import { requestFileDownloadThunk } from "./thunks";
import { toast } from "react-toastify";
import { createAppSelector } from "../../../app/hooks";

const initialState: TransferenceState = {
  transferences: {},
};

const transferenceSlice = createSlice({
  name: "transference",
  initialState,
  reducers: {
    updateDownloadProgress: (state, action: PayloadAction<DownloadUpdate>) => {
      state.transferences[action.payload.id].progress = action.payload.progress;
      state.transferences[action.payload.id].status = "progress";
    },
    completeDownload: (state, action: PayloadAction<DownloadUpdate>) => {
      state.transferences[action.payload.id].progress =
        state.transferences[action.payload.id].totalBytes;
      state.transferences[action.payload.id].status = "completed";
    },
  },
  extraReducers: (builder) => {
    builder.addAsyncThunk(requestFileDownloadThunk, {
      fulfilled: (state, action) => {
        state.transferences[action.payload.data.id] = {
          destination: action.payload.data.destinationPath,
          origin: action.payload.data.originPath,
          totalBytes: action.payload.data.totalBytes,
          progress: 0,
          error: null,
          status: "requesting",
          type: "download",
        };
      },
      rejected: (_, action) => {
        toast.error(action.payload?.message);
      },
    });
  },
});

const { updateDownloadProgress, completeDownload } = transferenceSlice.actions;
export { updateDownloadProgress, completeDownload };

export const selectTransferences = createAppSelector(
  [(state) => state.transference.transferences],
  (transferences) =>
    Object.entries(transferences)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => Number(a.id) - Number(b.id))
);

export const selectActiveTransferencesCount = createAppSelector(
  [selectTransferences],
  (transferences) =>
    transferences.filter(
      (t) => t.status === "requesting" || t.progress / t.totalBytes < 1
    ).length
);

export default transferenceSlice.reducer;
