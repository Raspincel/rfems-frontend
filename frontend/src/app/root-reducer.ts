import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/slice";
import userReducer from "../features/user/store/slice";
import hostingReducer from "../features/hosting/store/slice";
import { explorerReducer } from "../features/explorer";
import { transferenceReducer } from "../features/transference";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  hosting: hostingReducer,
  explorer: explorerReducer,
  transference: transferenceReducer,
});

export default rootReducer;
