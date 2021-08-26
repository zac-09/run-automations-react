import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import deviceSlice from "./reducers/device";
import notificationSlice from "./reducers/notification";
import switchSlice from "./reducers/switch";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    notification: notificationSlice.reducer,
    devices: deviceSlice.reducer,
    switch: switchSlice.reducer,
  },
});
// export const url = "http://localhost:5000/api/v1";
// export const socketUrl = "http://localhost:5000";

export const url = "https://cryptic-wave-64102.herokuapp.com/api/v1";
export const socketUrl = "https://cryptic-wave-64102.herokuapp.com";

export const authActions = authSlice.actions;
export const notificationActions = notificationSlice.actions;
export const deviceActions = deviceSlice.actions;
export const switchActions = switchSlice.actions;
export default store;
 