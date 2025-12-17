import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/store/slice";
import userReducer from "../features/user/store/slice";
import hostingReducer from "../features/hosting/store/slice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  hosting: hostingReducer,
});

export default rootReducer;
