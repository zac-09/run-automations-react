import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import deviceSlice from "./reducers/device";
import notificationSlice from "./reducers/notification";

const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    notification: notificationSlice.reducer,
    devices: deviceSlice.reducer,
  },
});
// export const url = "http://localhost:5000/api/v1";
export const url = "http://cryptic-wave-64102.herokuapp.com";


export const authActions = authSlice.actions;
export const notificationActions = notificationSlice.actions;
export const deviceActions = deviceSlice.actions;
export default store;
