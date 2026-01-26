import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LoginResponse } from '../../utils/api/authApi';

export interface User {
  id: string;
  email: string;
  name?: string;
  permissions?: string[]; // User permissions for menu/access control
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isRestoring: boolean; // Flag to track if session is being restored
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isRestoring: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state, _action: PayloadAction<{ email: string; password: string }>) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
      state.isLoading = false;
      state.token = action.payload.access_token;
      state.user = action.payload.user || null;
      state.isAuthenticated = true;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
    },
    restoreSessionRequest: (state) => {
      state.isLoading = true;
      state.isRestoring = true;
      state.error = null;
    },
    restoreSessionSuccess: (state, action: PayloadAction<{ token: string; user?: User | null }>) => {
      state.isLoading = false;
      state.isRestoring = false;
      state.token = action.payload.token;
      state.user = action.payload.user || null;
      state.isAuthenticated = !!action.payload.token;
      state.error = null;
    },
    restoreSessionFailure: (state) => {
      state.isLoading = false;
      state.isRestoring = false;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.error = null;
    },
    fetchUserInfoRequest: (_state) => {
      // Don't set loading to true to avoid UI flicker
    },
    fetchUserInfoSuccess: (state, action: PayloadAction<User>) => {
      // Merge with existing user data to preserve token/auth state
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    fetchUserInfoFailure: (_state) => {
      // Don't clear auth state, just log error
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { 
  loginRequest, 
  loginSuccess, 
  loginFailure, 
  restoreSessionRequest,
  restoreSessionSuccess,
  restoreSessionFailure,
  fetchUserInfoRequest,
  fetchUserInfoSuccess,
  fetchUserInfoFailure,
  logout, 
  clearError, 
  setUser 
} = authSlice.actions;
export default authSlice.reducer;