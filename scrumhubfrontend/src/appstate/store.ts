import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { reducer } from "./reducer";

export const store = configureStore({
  reducer: reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;