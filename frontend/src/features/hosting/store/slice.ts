import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActiveUser, HostingState, PendingUser, UserUpdated } from "../types";
import { startHostingThunk, stopHostingThunk } from "./thunks";
import { RootState } from "../../../app/store";
import { toast } from "react-toastify";

const initialState: HostingState = {
  isHosting: false,
  folderPath: "",
  isPublic: false,
  status: "idle",
  error: null,
  users: [],
};

const hostingSlice = createSlice({
  name: "hosting",
  initialState,
  reducers: {
    updateConnectedUser: (
      state,
      action: PayloadAction<ActiveUser | PendingUser>
    ) => {
      const userIndex = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (userIndex !== -1) {
        state.users[userIndex] = action.payload;
      } else {
        state.users.push(action.payload);
      }
    },
    removeDisconnectedUser: (state, action: PayloadAction<UserUpdated>) => {
      if (action.payload.status !== "offline") return;

      state.users = state.users.filter(
        (user) => user.id !== action.payload.userId
      );
    },
  },
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
          state.users = [];
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
export const selectFolderPath = (state: RootState) => state.hosting.folderPath;
export const selectIsPublic = (state: RootState) => state.hosting.isPublic;
export const selectActiveUsers = (state: RootState) =>
  state.hosting.users.filter((user) => user.approved);
export const selectPendingUsers = (state: RootState) =>
  state.hosting.users.filter((user) => !user.approved);

const { updateConnectedUser, removeDisconnectedUser } = hostingSlice.actions;

export { updateConnectedUser, removeDisconnectedUser };
export default hostingSlice.reducer;
