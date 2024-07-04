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
let initialState = {
  users: [],
  unassignedUsers: [],
  assignedUsers: [],
  // users: typeof window !== "undefined" && localStorage.getItem('qual__users') ? JSON.parse(localStorage.getItem('qual__users')) : [],
  // user: typeof window !== "undefined" && localStorage.getItem('qual__user') ? JSON.parse(localStorage.getItem('qual__user')) : initUserState,
  user: initUserState,
  loading: false,
  error: "",
  page: null,
  pages: null
};

export const getUsersAdmin = createAsyncThunk(
  'user/get/All-Admin',
  async ({projectId}, thunkAPI) => {
    try {
      return await userService.getUsersAdmin(projectId);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to list all users for admin.", {theme: "colored", toastId: "getUsersAdmin"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUsersListAdmin = createAsyncThunk(
  'user/get/List-All-Admin',
  async ({keyword, pageNumber, itemsPerPage, orderBy, cookie}, thunkAPI) => {
    try {
      return await userService.getUsersListAdmin(keyword, pageNumber, itemsPerPage, orderBy, cookie);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to list users for admin.", {theme: "colored", toastId: "getUsersListAdmin"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserAccount = createAsyncThunk(
  'user/get/account',
  async ({cookie}, thunkAPI) => {
    try {
      return await userService.getUserAccount(cookie);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to get user account.", {theme: "colored", toastId: "getUserAccount"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const getUserProfile = createAsyncThunk(
  'user/get/profile',
  async ({user_id, cookie}, thunkAPI) => {
    try {
      return await userService.getUserProfile(user_id, cookie);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to get user profile.", {theme: "colored", toastId: "getUserProfile"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateAndSaveProjectPersonnelList = createAsyncThunk(
  'user/update/Project-Personnel/user-assignments',
  async ({projectId, assignedUsers, unassignedUsers}, thunkAPI) => {
    try {
      return await userService.updateAndSaveProjectPersonnelList(projectId, assignedUsers, unassignedUsers);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to update project personnel list regarding users assigned to project.", {theme: "colored", toastId: "UpdateProjectPersonnelError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/put/update-profile',
  async ({formData, userId, router}, thunkAPI) => {
    try {
      return await userService.updateUserProfile(formData, userId, router);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to update user information.", {theme: "colored", toastId: "updateUserProfileId"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// export const updateAssignmentListsAdmin = createAsyncThunk(
//   'user/update/Assign-Lists-Admin',
//   async ({projectId, updatedAssignedArr, updatedUnassignedArr}, thunkAPI) => {
//     try {
//       return await userService.updateAssignmentListsAdmin(projectId, updatedAssignedArr, updatedUnassignedArr);
//     } catch (err) {
//       const message =
//         (err.response &&
//           err.response.data &&
//           err.response.data.message) ||
//         err.message ||
//         err.toString()
//       toast.error("Failed to list users.", {theme: "colored", toastId: "getUsersToastId"});
//       return thunkAPI.rejectWithValue(message);
//     }
//   }
// );

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
      toast.error("Failed to get user profile.", {theme: "colored", toastId: "getUserProfileId"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);


// TODO: consider deleting
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
      toast.error("Failed to update user information.", {theme: "colored", toastId: "updateUserInfoId"});
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
      toast.error("Failed to create user profile.", {theme: "colored", toastId: "createUserError"});
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
      toast.error("Admin failed to update user profile.", {theme: "colored", toastId: "updateUserAdminError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    rehydrate(state, action) {
      state.unassignedUsers = action.payload.unassignedUsers;
      state.assignedUsers = action.payload.assignedUsers;
      state.users = action.payload.users;
      state.user = action.payload.user;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
      state.page = action.payload.page;
      state.pages = action.payload.pages;
    },
    updateAssignmentListsAdmin: (state, { payload }) => {
      console.log(payload)
      state.assignedUsers = [...state.assignedUsers, ...payload.updatedAssignedArr];
      // state.unassignedUsers = [...state.unassignedUsers, ...payload.updatedUnassignedArr];
      state.unassignedUsers = payload.updatedUnassignedArr;
    },
    updateUnassignmentListsAdmin: (state, { payload }) => {
      console.log(payload)
      state.assignedUsers = payload.updatedAssignedArr;
      state.unassignedUsers = [...state.unassignedUsers, ...payload.updatedUnassignedArr];
      // state.unassignedUsers = [...state.unassignedUsers, ...payload.updatedUnassignedArr];
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
    [getUsersAdmin.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getUsersAdmin.fulfilled]: (state, { payload }) => {
      // state.users = payload;
      state.users = payload.users,
      state.assignedUsers = payload.assignedUsers,
      state.unassignedUsers = payload.unassignedUsers,
      state.loading = false;
    },
    [getUsersAdmin.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [getUsersListAdmin.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getUsersListAdmin.fulfilled]: (state, { payload }) => {
      state.users = payload.users;
      state.page = payload.page;
      state.pages = payload.pages;
      state.loading = false;
    },
    [getUsersListAdmin.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },

    [updateAndSaveProjectPersonnelList.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [updateAndSaveProjectPersonnelList.fulfilled]: (state, { payload }) => {
      // state.users = payload.users,
      state.assignedUsers = payload.assignedUsers,
      state.unassignedUsers = payload.unassignedUsers,
      state.loading = false;
    },
    [updateAndSaveProjectPersonnelList.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [getUserAccount.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getUserAccount.fulfilled]: (state, { payload }) => {
      state.user = payload.user;
      state.loading = false;
    },
    [getUserAccount.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    [getUserProfile.pending]: (state) => {
      state.error = '';
      state.loading = true;
    },
    [getUserProfile.fulfilled]: (state, { payload }) => {
      state.user = payload.user;
      state.loading = false;
    },
    [getUserProfile.rejected]: (state) => {
      state.loading = false;
      state.error = 'failed';
    },
    // ++++++++++++++++++++++
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

export const { rehydrate, userReset, updateAssignmentListsAdmin, updateUnassignmentListsAdmin } = userSlice.actions;
export default userSlice.reducer;