import { AnyAction } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";

import type { AppState } from "./store";

export const useAppDispatch = () =>
  useDispatch<ThunkDispatch<AppState, undefined, AnyAction>>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;