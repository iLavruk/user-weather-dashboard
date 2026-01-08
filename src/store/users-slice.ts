import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUsers } from "../lib/api";
import type { User } from "../types/user";
import { AsyncStatus } from "./async-status";

export type UsersState = {
  items: User[];
  status: AsyncStatus;
  error: string | null;
};

const INITIAL_STATE: UsersState = {
  items: [],
  status: AsyncStatus.IDLE,
  error: null
};

const USERS_SLICE_NAME = "users";
const LOAD_USERS_ERROR = "Failed to load users";
const LOAD_USERS_ACTION = `${USERS_SLICE_NAME}/loadUsers`;

export const loadUsers = createAsyncThunk<User[], void, { rejectValue: string }>(
  LOAD_USERS_ACTION,
  async (_arg, { rejectWithValue }) => {
    try {
      return await fetchUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : LOAD_USERS_ERROR;
      return rejectWithValue(message);
    }
  }
);

const usersSlice = createSlice({
  name: USERS_SLICE_NAME,
  initialState: INITIAL_STATE,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = AsyncStatus.LOADING;
        state.error = null;
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = AsyncStatus.SUCCEEDED;
        state.items = action.payload;
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = AsyncStatus.FAILED;
        state.error =
          action.payload ?? action.error.message ?? LOAD_USERS_ERROR;
      });
  }
});

export default usersSlice.reducer;
