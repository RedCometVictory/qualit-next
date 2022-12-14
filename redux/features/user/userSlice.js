import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { HYDRATE } from "next-redux-wrapper";
import { toast } from "react-toastify";
import userService from "./userService";

const initUserState = {
  id: '',
  f_name: '',
  l_name: '',
  username: '',
  email: ''
};

const initialState = {
  users: typeof window !== "undefined" && localStorage.getItem('qual__users') ? JSON.parse(localStorage.getItem('qual__users')) : [],
  user: typeof window !== "undefined" && localStorage.getItem('qual__user') ? JSON.parse(localStorage.getItem('qual__user')) : initUserState,
  loading: false,
  error: ""
};

export const getUserProfile = createAsyncThunk(
  'user/get/profile',
  async (_, thunkAPI) => {
    try {
      return await userService.getUserProfile();
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to get user profile.", {theme: "colored", toastId: "getUserToastId"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserProfileAdmin = createAsyncThunk(
  'user/get/profile-admin',
  async (user_id, thunkAPI) => {
    try {
      return await userService.getUserProfileAdmin(user_id);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to get user profile.", {theme: "colored", toastId: "getUserToastId"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUsersAdmin = createAsyncThunk(
  'user/get/All-Admin',
  async (_, thunkAPI) => {
    try {
      return await userService.getUsersAdmin();
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to list users.", {theme: "colored", toastId: "getUsersToastId"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserInfo = createAsyncThunk(
  'user/put/info-update',
  async (userForm, thunkAPI) => {
    try {
      return await userService.updateUserInfo(userForm);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to update user information.", {theme: "colored", toastId: "updateUserToastId"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createUserProfile = createAsyncThunk(
  'user/post/create-profile',
  async (profileForm, thunkAPI) => {
    try {
      return await userService.createUserProfile(profileForm);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to create user profile.", {theme: "colored", toastId: "createUserToastId"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserAdmin = createAsyncThunk(
  'user/put/update-user-admin',
  async ({user_id, userForm}, thunkAPI) => {
    try {
      return await userService.updateUserAdmin(user_id, userForm);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Admin failed to update user profile.", {theme: "colored", toastId: "updateUserToastId"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    rehydrate(state, action) {
      state.users = action.payload.users;
      state.user = action.payload.user;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
    userReset: (state) => initialState,
  },
  extraReducers: {
    // [HYDRATE]: (state, action) => {
    //   console.log("HYDRATE", action.payload);
    //   return {
    //     ...state,
    //     ...action.payload.user
    //   }
    // },
    [getUserProfile.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getUserProfile.fulfilled]: (state, { payload }) => {
      state.userById = payload;
      state.loading = false;
    },
    [getUserProfile.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [getUserProfileAdmin.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getUserProfileAdmin.fulfilled]: (state, { payload }) => {
      state.userById = payload;
      state.loading = false;
    },
    [getUserProfileAdmin.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [getUsersAdmin.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getUsersAdmin.fulfilled]: (state, { payload }) => {
      state.users = payload;
      state.loading = false;
    },
    [getUsersAdmin.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [updateUserInfo.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [updateUserInfo.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.userById = payload;
      toast.success("User information updated!", {theme: "colored", toastId: "updateUserInfoToastId"});
    },
    [updateUserInfo.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [createUserProfile.pending]: (state) => {
      state.loading = true;
    },
    [createUserProfile.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.userById = payload;
      toast.success("Profile created.", {theme: "colored", toastId: "profileCreatedToastId"});
    },
    [createUserProfile.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [updateUserAdmin.pending]: (state) => {
      state.loading = true;
    },
    [updateUserAdmin.fulfilled]: (state, { payload }) => {
      state.loading = false;
      state.success = true;
      state.userById = payload;
    },
    [updateUserAdmin.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    }
  }
});

export const { rehydrate, userReset } = userSlice.actions;
export default userSlice.reducer;