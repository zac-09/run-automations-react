import { createSlice } from "@reduxjs/toolkit";

const intialState = {
  selectedDevice_id: null,
  voltage: 0,
  current: 0,
  power: 0,
  createdAt: null,
  devices: [],
};
const deviceSlice = createSlice({
  name: "device",
  initialState: intialState,
  reducers: {
    setDeviceData(state, action) {
      state.selectedDevice_id = action.payload.selectedDevice_id;

      state.devices = action.payload.devices;
    },
    upadateDeviceParameters(state, action) {
      state.voltage = action.payload.voltage;
      state.current = action.payload.current;
      state.power = action.payload.power;
      state.createdAt = action.payload.createdAt;
    },
  },
});

export default deviceSlice;
