import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  HostingStatusUpdatePayload,
  UserState,
  UserStatusUpdatePayload,
} from "../types";
import { fetchUserThunk, fetchBasicUsersInfosThunk } from "./thunks";
import { RootState } from "../../../app/store";
import { toast } from "react-toastify";

const initialState: UserState = {
  profile: { id: "", name: "", email: "" },
  profileStatus: "idle",
  error: null,
  users: [],
  usersStatus: "idle",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUserStatus(state, action: PayloadAction<UserStatusUpdatePayload>) {
      state.users = state.users.map((user) => {
        if (user.id === action.payload.userId) {
          return {
            ...user,
            status: action.payload.status,
            lastActiveAt:
              action.payload.status === "offline"
                ? action.payload.lastActiveAt
                : undefined,
          };
        }
        return user;
      });
    },
    updateUserHostingStatus(
      state,
      action: PayloadAction<HostingStatusUpdatePayload>
    ) {
      state.users = state.users.map((user) => {
        if (user.id !== action.payload.userId) return user;

        return {
          ...user,
          isPublic: action.payload.isPublic,
          folderBeingHosted: action.payload.folder,
          activeTransfers: action.payload.activeTransferences,
          status: action.payload.status,
        };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (s) => {
        s.profileStatus = "loading";
      })
      .addCase(fetchUserThunk.fulfilled, (s, a) => {
        s.profileStatus = "succeeded";
        s.profile = a.payload;
        toast.success("User profile fetched successfully");
      })
      .addCase(fetchUserThunk.rejected, (s, a) => {
        s.profileStatus = "failed";
        s.error = a.error.message || null;
        toast.error(s.error || "Failed to fetch user profile");
      })
      .addCase(fetchBasicUsersInfosThunk.pending, (s) => {
        s.usersStatus = "loading";
      })
      .addCase(fetchBasicUsersInfosThunk.fulfilled, (s, a) => {
        s.usersStatus = "succeeded";
        s.users = a.payload;
        toast.success("Users fetched successfully");
      })
      .addCase(fetchBasicUsersInfosThunk.rejected, (s, a) => {
        s.usersStatus = "failed";
        s.error = a.error.message || null;
        toast.error(s.error || "Failed to fetch users");
      });
  },
});

const selectAllUsers = (state: RootState) => state.user.users;
const selectProfileId = (state: RootState) => state.user.profile.id;

export const selectUsers = createSelector(
  [selectAllUsers, selectProfileId],
  (users, profileId) => users.filter((user) => user.id !== profileId)
);

export const selectProfile = (state: RootState) => state.user.profile;
export const selectUsersStatus = (state: RootState) => state.user.usersStatus;
export const selectProfileStatus = (state: RootState) =>
  state.user.profileStatus;

const { updateUserStatus, updateUserHostingStatus } = userSlice.actions;

export { updateUserStatus, updateUserHostingStatus };
export default userSlice.reducer;
