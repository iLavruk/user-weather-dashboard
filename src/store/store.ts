import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./users-slice";
import weatherReducer from "./weather-slice";

export function createAppStore() {
  return configureStore({
    reducer: {
      users: usersReducer,
      weather: weatherReducer
    }
  });
}

export type AppStore = ReturnType<typeof createAppStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
