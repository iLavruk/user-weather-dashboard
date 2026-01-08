import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchForecast, fetchWeatherSnapshot } from "../lib/api";
import type { ForecastDay, WeatherSnapshot } from "../types/weather";
import { AsyncStatus } from "./async-status";

export type WeatherRequest = {
  userId: string;
  latitude: number;
  longitude: number;
};

type WeatherSnapshotsPayload = {
  snapshots: Record<string, WeatherSnapshot>;
  errorMessage: string | null;
};

export type WeatherState = {
  snapshotByUserId: Record<string, WeatherSnapshot>;
  snapshotsStatus: AsyncStatus;
  snapshotsError: string | null;
  forecastUserId: string | null;
  forecastDays: ForecastDay[];
  forecastStatus: AsyncStatus;
  forecastError: string | null;
};

const INITIAL_STATE: WeatherState = {
  snapshotByUserId: {},
  snapshotsStatus: AsyncStatus.IDLE,
  snapshotsError: null,
  forecastUserId: null,
  forecastDays: [],
  forecastStatus: AsyncStatus.IDLE,
  forecastError: null
};

const WEATHER_SLICE_NAME = "weather";
const LOAD_SNAPSHOTS_ACTION = `${WEATHER_SLICE_NAME}/loadWeatherSnapshots`;
const LOAD_FORECAST_ACTION = `${WEATHER_SLICE_NAME}/loadForecast`;
const LOAD_SNAPSHOTS_ERROR = "Failed to load weather snapshots";
const LOAD_FORECAST_ERROR = "Failed to load forecast";

function resolveErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const loadWeatherSnapshots = createAsyncThunk<
  WeatherSnapshotsPayload,
  WeatherRequest[],
  { rejectValue: string }
>(LOAD_SNAPSHOTS_ACTION, async (requests, { rejectWithValue }) => {
  try {
    const snapshots: Record<string, WeatherSnapshot> = {};
    let errorMessage: string | null = null;

    for (const request of requests) {
      try {
        snapshots[request.userId] = await fetchWeatherSnapshot(
          request.latitude,
          request.longitude
        );
      } catch (error) {
        if (!errorMessage) {
          errorMessage = resolveErrorMessage(error, LOAD_SNAPSHOTS_ERROR);
        }
      }
    }

    return { snapshots, errorMessage };
  } catch (error) {
    return rejectWithValue(resolveErrorMessage(error, LOAD_SNAPSHOTS_ERROR));
  }
});

export const loadForecast = createAsyncThunk<
  ForecastDay[],
  WeatherRequest,
  { rejectValue: string }
>(LOAD_FORECAST_ACTION, async (request, { rejectWithValue }) => {
  try {
    return await fetchForecast(request.latitude, request.longitude);
  } catch (error) {
    return rejectWithValue(resolveErrorMessage(error, LOAD_FORECAST_ERROR));
  }
});

const weatherSlice = createSlice({
  name: WEATHER_SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadWeatherSnapshots.pending, (state) => {
        state.snapshotsStatus = AsyncStatus.LOADING;
        state.snapshotsError = null;
        state.snapshotByUserId = {};
      })
      .addCase(loadWeatherSnapshots.fulfilled, (state, action) => {
        state.snapshotByUserId = action.payload.snapshots;
        state.snapshotsError = action.payload.errorMessage;
        state.snapshotsStatus = action.payload.errorMessage
          ? AsyncStatus.FAILED
          : AsyncStatus.SUCCEEDED;
      })
      .addCase(loadWeatherSnapshots.rejected, (state, action) => {
        state.snapshotsStatus = AsyncStatus.FAILED;
        state.snapshotsError =
          action.payload ?? action.error.message ?? LOAD_SNAPSHOTS_ERROR;
      })
      .addCase(loadForecast.pending, (state, action) => {
        state.forecastStatus = AsyncStatus.LOADING;
        state.forecastError = null;
        state.forecastUserId = action.meta.arg.userId;
        state.forecastDays = [];
      })
      .addCase(loadForecast.fulfilled, (state, action) => {
        state.forecastStatus = AsyncStatus.SUCCEEDED;
        state.forecastError = null;
        state.forecastUserId = action.meta.arg.userId;
        state.forecastDays = action.payload;
      })
      .addCase(loadForecast.rejected, (state, action) => {
        state.forecastStatus = AsyncStatus.FAILED;
        state.forecastError =
          action.payload ?? action.error.message ?? LOAD_FORECAST_ERROR;
        state.forecastUserId = action.meta.arg.userId;
        state.forecastDays = [];
      });
  }
});

export default weatherSlice.reducer;
