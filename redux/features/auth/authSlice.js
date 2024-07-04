import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
// import { HYDRATE } from "next-redux-wrapper";
import { toast } from "react-toastify";
import authService from "./authService";

const initialState = {
  // token: typeof window !== "undefined" && localStorage.getItem("qual__token") ? localStorage.getItem("qual__token") : null,
  user: typeof window !== "undefined" && localStorage.getItem("qual__user") ? JSON.parse(localStorage.getItem("qual__user")) : {},
  isAuthenticated: typeof window !== "undefined" && localStorage.getItem("qual__user") && Cookies.get("qual__isLoggedIn") ? true : false,
  loading: false,
  error: null,
  allowReset: false
};

export const demoUser = createAsyncThunk(
  'auth/demo',
  async (thunkAPI) => {
    try {
      // return await authService.demoUser(navigate, thunkAPI);
      return await authService.demoUser();
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to login (DEMO).", {theme: "colored", toastId: "DemoLoginError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);
  
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      return await authService.loadUser(thunkAPI);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to load user.", {theme: "colored", toastId: "UserLoadError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (formRegData, thunkAPI) => {
    try {
      return await authService.registerUser(formRegData, thunkAPI);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to register.", {theme: "colored", toastId: "RegUserError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({formData, router}, thunkAPI) => {
    try {
      return await authService.loginUser(formData, router, thunkAPI);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to login. Incorrect email or password.", {theme: "colored", toastId: "LoginError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      return await authService.logout(_, thunkAPI);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to logout.", {theme: "colored", toastId: "LogoutError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const expiredTokenLogout = createAsyncThunk(
  'auth/expiredTokenLogout',
  async (_, thunkAPI) => {
    try {
      return await authService.expiredTokenLogout(_, thunkAPI);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'auth/delete',
  async (navigate, thunkAPI) => {
    try {
      return await authService.deleteUser(navigate);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to delete account.", {theme: "colored", toastId: "DelAccountError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      return await authService.forgotPassword(email);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to send reset link. Check email address and try again.", {theme: "colored", toastId: "ResetError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const verifyPassword = createAsyncThunk(
  'auth/verifyPassword',
  async ({token, email, navigate}, thunkAPI) => {
    try {
      return await authService.verifyPassword(token, email);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Reset link invalid. Please try password reset again.", {theme: "colored", toastId: "ResetError2"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({token, email, password, password2, navigate}, thunkAPI) => {
    try {
      let passwords = {password, password2};
      return await authService.resetPassword(token, email, passwords, navigate);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to reset password. Please try password reset again.", {theme: "colored", toastId: "ResetError3"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshAccessToken',
  async (newAccessToken, thunkAPI) => {
    try {
      let tokenExample = thunkAPI.getState().auth.token;
      return await authService.refreshAccessToken(newAccessToken, tokenExample);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to refresh token.", {theme: "colored", toastId: "RefTokenRenewError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    rehydrate(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.allowReset = action.payload.allowReset;
    },
    authReset: (state, action) => {
      state = initialState;
    },
    clearAuth: (state) => {
      localStorage.removeItem('qual__token')
      localStorage.removeItem('qual__user')
      localStorage.removeItem('qual__theme')
      state.token = null
      state.isAuthenticated = false
      state.loading = false
      state.user = {}
    }
  },
  extraReducers: {
    // [HYDRATE]: (state, action) => {
    //   console.log("HYDRATE", action.payload);
    //   return {
    //     ...state,
    //     ...action.payload.auth
    //   }
    // },
    [demoUser.pending]: (state) => {
      state.loading = true;
    },
    [demoUser.fulfilled]: (state, { payload }) => {
      state.token = payload.token;
      state.loading = false;
      state.isAuthenticated = true;
      state.user = payload.user;
      toast.success("Welcome!", {theme: "colored", toastId: "welcomeToastId"});
    },
    [demoUser.rejected]: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = true;
    },
    [loadUser.pending]: (state) => {
      state.loading = true;
    },
    [loadUser.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = payload.user;
    },
    [loadUser.rejected]: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = true;
    },
    [registerUser.pending]: (state) => {
      state.loading = true;
    },
    [registerUser.fulfilled]: (state, { payload }) => {
      state.token = payload.token;
      state.loading = false;
      state.isAuthenticated = true;
      state.user = payload.user;
      toast.success("Successfully registered. Welcome.", {theme: "colored", toastId: "registerSuccessToastId"});
    },
    [registerUser.rejected]: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = true;
    },
    [loginUser.pending]: (state) => {
      state.loading = true;
    },
    [loginUser.fulfilled]: (state, { payload }) => {
      state.token = payload.token;
      state.loading = false;
      state.isAuthenticated = true;
      state.user = payload.user;
      toast.success("Welcome!", {theme: "colored", toastId: "welcomeToastId"});
    },
    [loginUser.rejected]: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = true;
    },
    [logout.pending]: (state) => {
      state.loading = true;
    },
    [logout.fulfilled]: (state) => {
      localStorage.removeItem('qual__token')
      localStorage.removeItem('qual__user')
      localStorage.removeItem('qual__theme')
      state.token = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    [logout.rejected]: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = true;
    },
    [expiredTokenLogout.pending]: (state) => {
      state.loading = true;
    },
    [expiredTokenLogout.fulfilled]: (state) => {
      localStorage.removeItem('qual__token')
      localStorage.removeItem('qual__user')
      localStorage.removeItem('qual__theme')
      state.token = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
    },
    [expiredTokenLogout.rejected]: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = true;
    },
    [deleteUser.pending]: (state) => {
      state.loading = true;
    },
    [deleteUser.fulfilled]: (state, action) => {
      state.token = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      toast.success("Your account has been deleted.", {theme: "colored", toastId: "deleteAcctToastId"});
    },
    [deleteUser.rejected]: (state) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = true;
    },
    [forgotPassword.pending]: (state) => {
      state.loading = true;
    },
    [forgotPassword.fulfilled]: (state, action) => {
      state.status = action.payload;
      state.loading = false;
      state.allowReset = false;
      toast.success("Password reset link sent to your email.", {theme: "colored", toastId: "forgotPasswordToastId"});
    },
    [forgotPassword.rejected]: (state, action) => {
      state.loading = false;
      state.allowReset = false;
      state.error = action.payload;
    },
    [verifyPassword.pending]: (state) => {
      state.loading = true;
    },
    [verifyPassword.fulfilled]: (state, action) => {
      state.status = action.payload.status;
      state.loading = false;
      state.allowReset = true;
      toast.success("Reset link valid.", {theme: "colored", toastId: "resetLinkToastId"});
    },
    [verifyPassword.rejected]: (state, action) => {
      state.loading = false;
      state.allowReset = false;
      state.error = action.payload;
    },
    [resetPassword.pending]: (state) => {
      state.loading = true;
    },
    [resetPassword.fulfilled]: (state, action) => {
      state.status = action.payload.status;
      state.loading = false;
      state.allowReset = false;
      toast.success("Password reset. Please login using new password.", {theme: "colored", toastId: "resetValidToastId"});
    },
    [resetPassword.rejected]: (state, action) => {
      state.loading = false;
      state.allowReset = false;
      state.error = action.payload;
    },
    [refreshAccessToken.pending]: (state) => {
      state.loading = true;
    },
    [refreshAccessToken.fulfilled]: (state, action) => {
      state.token = action.payload;
      state.loading = false;
    },
    [refreshAccessToken.rejected]: (state, action) => {
      state.loading = false;
      state.allowReset = false;
      state.error = action.payload;
    }
  }
});
export const { rehydrate, authReset, clearAuth } = authSlice.actions;
export default authSlice.reducer;