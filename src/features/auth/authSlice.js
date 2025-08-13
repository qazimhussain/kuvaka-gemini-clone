import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  otpSent: false,
  loading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    startOtpSend(state) {
      state.loading = true;
      state.otpSent = false;
    },
    otpSentSuccess(state) {
      state.loading = false;
      state.otpSent = true;
    },
    verifyOtpSuccess(state, action) {
      state.user = action.payload;
      state.otpSent = false;
      state.loading = false;
    },
    logout(state) {
      state.user = null;
      state.otpSent = false;
      state.loading = false;
    }
  }
});

export const { startOtpSend, otpSentSuccess, verifyOtpSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
