import type { Action, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import patientReducer from "./slice/patientSlice";

const store = configureStore({
  reducer: {
    patient: patientReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [""],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;

export type RootAction = {
  type: string;
  payload?: any;
};

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

let reduxStore: null | typeof store = null;

export const getReduxStore = () => {
  if (!reduxStore) {
    reduxStore = store;
  }
  return reduxStore;
};

export default store;