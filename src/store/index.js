import { configureStore } from "@reduxjs/toolkit";
import reservationReducer from "./reservationSlice.js";
import authReducer from "./authSlice.js";
import { reservationActionMonitorMiddleware, storageSyncMiddleware } from "./middleware.js";

export const store = configureStore({
  reducer: {
    reservation: reservationReducer,
    auth: authReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(reservationActionMonitorMiddleware, storageSyncMiddleware)
});

export default store;
