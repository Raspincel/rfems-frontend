import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DisconnectFromHostData,
  ExplorerState,
  UpdateFilesList,
} from "../types";
import {
  connectToHostThunk,
  exitHostingSessionThunk,
  requestFilesListThunk,
} from "./thunks";
import { toast } from "react-toastify";
import { createAppSelector } from "../../../app/hooks";
import { RootState } from "../../../app/store";

const initialState: ExplorerState = {
  folders: [],
  files: [],
  path: [],
  hostID: null,
  error: null,
  connected: false,
  status: "idle",
};

const hostingSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {
    disconnectFromHost(state, action: PayloadAction<DisconnectFromHostData>) {
      if (state.hostID !== action.payload.hostId) {
        return;
      }

      state.connected = false;
      state.status = "idle";
      state.error = null;
      state.hostID = null;
      state.files = [];
      state.folders = [];
      state.path = [];
      toast.info("Disconnected from host: " + action.payload.reason);
    },
    updateFilesList(state, action: PayloadAction<UpdateFilesList>) {
      state.folders = [];
      state.files = [];
      state.path = action.payload.path;

      // keep track of current path to exhibit it and use to request new files list
      for (const item of action.payload.files) {
        if (item.isDir) {
          state.folders.push(item);
        } else {
          state.files.push(item);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addAsyncThunk(connectToHostThunk, {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "succeeded";
          state.error = null;
          state.connected = true;
          state.hostID = action.meta.arg.hostId;
          toast.success(action.payload.message);
        },
        rejected: (state, action) => {
          state.status = "failed";
          state.error = action.payload!.message;
          state.connected = false;
          toast.error(state.error || "Failed to connect to host");
        },
      })
      .addAsyncThunk(requestFilesListThunk, {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state) => {
          state.status = "succeeded";
          state.error = null;
        },
        rejected: (state, action) => {
          state.status = "failed";
          state.error = action.payload!.message;
          toast.error(state.error || "Failed to retrieve files");
        },
      })
      .addAsyncThunk(exitHostingSessionThunk, {
        pending: (state) => {
          state.status = "loading";
        },
        fulfilled: (state, action) => {
          state.status = "succeeded";
          state.error = null;
          state.connected = false;
          state.hostID = null;
          state.files = [];
          state.folders = [];
          state.path = [];
          toast.info(action.payload.message);
        },
        rejected: (state, action) => {
          state.status = "failed";
          state.error = action.payload!.message;
          toast.error(state.error || "Failed to exit hosting session");
        },
      });
  },
});

const { disconnectFromHost, updateFilesList } = hostingSlice.actions;

export { disconnectFromHost, updateFilesList };

export const selectIsConnectedToHost = (state: RootState) =>
  state.explorer.connected;

export const selectLoadingStatus = (state: RootState) =>
  state.explorer.status === "loading";

export const selectCurrentPath = (state: RootState) => state.explorer.path;

export const selectFiles = (state: RootState) => state.explorer.files;

export const selectFolders = (state: RootState) => state.explorer.folders;

export const selectNumberOfFolders = createAppSelector(
  [(state) => state.explorer.folders],
  (folders) => folders.length
);

export const selectNumberOfFiles = createAppSelector(
  [(state) => state.explorer.files],
  (files) => files.length
);

export const selectRootFolder = createAppSelector(
  [(state) => state.explorer.hostID, (state) => state.user.users],
  (hostID, users) =>
    users.find((user) => user.id === hostID)?.folderBeingHosted || null
);

export default hostingSlice.reducer;
