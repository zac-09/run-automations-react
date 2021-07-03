import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  relay_on: false,
};
const switchSlice = createSlice({
  name: "switch",
  initialState: initialState,
  reducers: {
    toggleSwitch(state, action) {
      state.relay_on = action.payload.relay_on;
    },
  },
});

export default switchSlice;
