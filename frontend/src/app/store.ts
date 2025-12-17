import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import rootReducer from "./root-reducer";

export const store = configureStore({
  reducer: rootReducer,
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore["dispatch"];
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;

export type APIReturn<T> = {
  message: string;
  success: boolean;
  data: T;
  errors?: {
    code: string;
    field?: string;
    message: string;
  }[];
  meta: {
    timestamp: string;
    trace_id: string;
  };
};

export type ThunkConfig = {
  rejectValue: {
    message: string;
    errors?: APIReturn<null>["errors"];
  };
};
