import { createSlice } from "@reduxjs/toolkit";
import { HostingState } from "../types";
import { startHostingThunk, stopHostingThunk } from "./thunks";
import { RootState } from "../../../app/store";
import { toast } from "react-toastify";

const initialState: HostingState = {
  isHosting: false,
  folderPath: "",
  isPublic: false,
  status: "idle",
  error: null,
};

const hostingSlice = createSlice({
  name: "hosting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addAsyncThunk(startHostingThunk, {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "succeeded";
          state.isHosting = true;
          state.isPublic = action.meta.arg.isPublic;
          state.folderPath = action.meta.arg.folderPath;
          toast.success(action.payload.message);
        },
        rejected: (state, action) => {
          state.status = "failed";
          state.error = action.payload!.message;
          toast.error(state.error || "Failed to start hosting");
        },
      })
      .addAsyncThunk(stopHostingThunk, {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "succeeded";
          state.isHosting = false;
          state.isPublic = false;
          state.folderPath = "";
          toast.success(action.payload.message);
        },
        rejected: (state, action) => {
          state.status = "failed";
          state.error = action.payload!.message;
          toast.error(state.error || "Failed to stop hosting");
        },
      });
  },
});

export const selectIsHosting = (state: RootState) => state.hosting.isHosting;

export default hostingSlice.reducer;
