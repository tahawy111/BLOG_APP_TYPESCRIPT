import { createSlice } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

export interface socketState {
  socket: Socket | any;
}

const initialState: socketState = {
  socket: null,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    socket: (state: socketState, action) => {
      return {
        ...state,
        socket: action.payload,
      };
    },
  },
});

// Action creators are generated for each case reducer function
export const { socket } = socketSlice.actions;

export default socketSlice.reducer;
