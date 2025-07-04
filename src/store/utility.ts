import { PayloadAction } from "@reduxjs/toolkit";

export function createSetState<
  TKey extends keyof TState,
  TState extends object
>(
  key: TKey,
  validation?: (value: TState[TKey]) => boolean
): (state: TState, action: PayloadAction<TState[TKey]>) => void;
export function createSetState<
  TState extends object,
  TKey extends keyof TState,
  TNestedKey extends keyof TState[TKey]
>(
  key: TKey,
  nestedKey: TNestedKey,
  validation?: (action: TState[TKey][TNestedKey]) => boolean
): (state: TState, action: PayloadAction<TState[TKey][TNestedKey]>) => void;
export function createSetState<
  TKey extends keyof TState,
  TNestedKey extends keyof TState[TKey],
  TState extends object
>(
  key: TKey,
  nestedKey?: TNestedKey,
  validation?: (value: TState[TKey] | TState[TKey][TNestedKey]) => boolean
) {
  if (!nestedKey) {
    return (state: TState, action: PayloadAction<TState[TKey]>) => {
      if (!validation) {
        state[key] = action.payload;
        return;
      }

      if (validation(action.payload)) {
        state[key] = action.payload;
        return;
      }
    };
  }

  return (state: TState, action: PayloadAction<TState[TKey][TNestedKey]>) => {
    if (!validation) {
      state[key][nestedKey] = action.payload;
      return;
    }

    if (validation(action.payload)) {
      state[key][nestedKey] = action.payload;
      return;
    }
  };
}