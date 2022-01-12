import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import { initState } from "./initStateValues";
import {reducerFunction } from "./reducer";

export const store = configureStore({
  reducer: reducerFunction(initState),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;