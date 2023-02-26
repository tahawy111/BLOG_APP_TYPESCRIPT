import { createSlice } from "@reduxjs/toolkit";

export interface globalState {
  loading: boolean;
}

const initialState: globalState = {
  loading: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    startLoading: (state) => {
      return { ...state, loading: true };
    },
    stopLoading: (state) => {
      return { ...state, loading: false };
    },
  },
});

// Action creators are generated for each case reducer function
export const { startLoading, stopLoading } = globalSlice.actions;

export default globalSlice.reducer;
