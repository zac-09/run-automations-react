import { createSlice } from "@reduxjs/toolkit";
import { act } from "react-dom/cjs/react-dom-test-utils.production.min";

const intialState = {
  showAlert: false,
  alertType: null,
  alertMessage: null,
};
const notificationSlice = createSlice({
  name: "notification",
  initialState: intialState,
  reducers: {
    showAlert(state, action) {
      state.showAlert = true;
      state.alertType = action.payload.type;
      state.alertMessage = action.payload.message;
    },
    hideAlert(state, action) {
      state.showAlert = false;
      state.alertType = null;
      state.alertMessage = null;
    },
  },
});

export default notificationSlice;
