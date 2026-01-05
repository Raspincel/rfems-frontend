import { createSlice } from "@reduxjs/toolkit";
import { TransferenceState } from "../types";
import { requestFileDownloadThunk } from "./thunks";
import { toast } from "react-toastify";
import { createAppSelector } from "../../../app/hooks";

const initialState: TransferenceState = {
  transferences: {},
};

const transferenceSlice = createSlice({
  name: "transference",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addAsyncThunk(requestFileDownloadThunk, {
      fulfilled: (state, action) => {
        state.transferences[action.payload.data.id] = {
          destination: action.payload.data.destinationPath,
          origin: action.payload.data.originPath,
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

const {} = transferenceSlice.actions;
export {};

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
    transferences.filter((t) => t.status === "requesting" || t.progress < 10000)
      .length
);

export default transferenceSlice.reducer;
