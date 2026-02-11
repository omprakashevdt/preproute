import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "../../service/auth/Login.service";
import type {
  LoginPayload,
  LoginResponse,
} from "../../service/auth/Login.service";


interface AuthState {
  user: LoginResponse["user"] | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Initial state
const initialToken = localStorage.getItem("token");
const initialUser = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user") as string)
  : null;

const initialState: AuthState = {
  user: initialUser,
  token: initialToken,
  isAuthenticated: !!initialToken,
  loading: false,
  error: null,
  success: false,
};

// Async thunk for login
export const login = createAsyncThunk<
  LoginResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const response = await loginUser(payload);
    if (response.token) {
      localStorage.setItem("token", response.token);
    }
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Login failed");
  }
});

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    resetLoginState: (state) => {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        localStorage.setItem("user", JSON.stringify(state.user));
        state.success = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.user = null;
        state.success = false;
        state.error = action.payload ?? "Login failed";
      });
  },
});

export const { logout, clearAuthError, resetLoginState } = authSlice.actions;
export default authSlice.reducer;
