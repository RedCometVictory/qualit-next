import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
  error: {} 
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
    userReset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.userById = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUserProfileAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserProfileAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.userById = action.payload;
      })
      .addCase(getUserProfileAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUsersAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUsersAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsersAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userById = action.payload;
        toast.success("User information updated!", {theme: "colored", toastId: "updateUserInfoToastId"});
      })
      .addCase(updateUserInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userById = action.payload;
        toast.success("Profile created.", {theme: "colored", toastId: "profileCreatedToastId"});
      })
      .addCase(createUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateUserAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.userById = action.payload;
      })
      .addCase(updateUserAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  }
});

export const { userReset } = userSlice.actions;
export default userSlice.reducer;