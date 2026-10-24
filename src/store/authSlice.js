import { createSlice } from "@reduxjs/toolkit";

const AUTH_TOKEN_KEY = "auth_token";
const AUTH_USER_KEY = "auth_user";

// Helper to hydrate auth state from browser storage (Requirement b)
const loadStoredAuth = () => {
  try {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const user = localStorage.getItem(AUTH_USER_KEY);
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true
      };
    }
  } catch (err) {
    console.error("Failed to load auth from localStorage:", err);
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false
  };
};

const initialAuth = loadStoredAuth();

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initialAuth.token,
    user: initialAuth.user,
    isAuthenticated: initialAuth.isAuthenticated,
    isLoading: false,
    error: null
  },
  reducers: {
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;

      // Token Management: Store in browser storage
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
      console.log("%c[Token Management: STORE TOKEN]", "color: #8b5cf6; font-weight: bold", {
        token: token.slice(0, 15) + "...",
        user
      });
    },

    // Token Management: Logout and token removal
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;

      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      console.log("%c[Token Management: REMOVE TOKEN]", "color: #ef4444; font-weight: bold", "Cleared auth token from localStorage");
    },

    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    }
  }
});

export const { loginSuccess, logout, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
