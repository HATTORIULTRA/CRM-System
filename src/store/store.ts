import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.ts";
import adminReducer from "./slices/adminSlice.ts";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
