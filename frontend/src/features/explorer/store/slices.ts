import { createSlice } from "@reduxjs/toolkit";
import { ExplorerState } from "../types";

const initialState: ExplorerState = {
  folders: [],
  path: "",
  error: null,
  status: "idle",
};

const hostingSlice = createSlice({
  name: "explorer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default hostingSlice.reducer;
