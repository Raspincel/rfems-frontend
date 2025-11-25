import { createSlice } from "@reduxjs/toolkit";
import { UserState } from "./userTypes";
import { fetchUserThunk } from "./userThunks";

const initialState: UserState = {
  profile: null,
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserThunk.pending, (s) => {
        s.status = "loading";
      })
      .addCase(fetchUserThunk.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.profile = a.payload;
      })
      .addCase(fetchUserThunk.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message || null;
      });
  },
});

export default userSlice.reducer;
