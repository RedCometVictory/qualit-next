import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from 'react-toastify';
import themeService from "./themeService";

let currentTheme;
currentTheme = typeof window !== "undefined" && localStorage.getItem('qual__theme');
  
if(typeof window !== "undefined" && !currentTheme) {
  localStorage.setItem('qual__theme', 'light');
  currentTheme = localStorage.getItem('qual__theme');
}

const initialState = {
  // theme: 'light',
  theme: currentTheme ? currentTheme : false,
  drawer: false,
  backgroundImage: '',
  error: ''
};

export const globalTheme = createAsyncThunk(
  'theme/setTheme',
  async (newTheme, thunkAPI) => {
    try {
      return await themeService.globalTheme(newTheme);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to set theme.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const unsplashTheme = createAsyncThunk(
  'theme/toggle-drawer',
  async (expanded, thunkAPI) => {
    try {
      return themeService.unsplashTheme(expanded);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to set theme.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const backgroundImageTheme = createAsyncThunk(
  'theme/toggle-drawer',
  async (bgImage, thunkAPI) => {
    try {
      return themeService.backgroundImageTheme(bgImage);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to set theme.", {theme: "colored", toastId: "ThemeError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    themeReset: (state, action) => {
      state = initialState
    },
    clearTheme: (state) => {
      localStorage.removeItem('qual__theme')
      state.theme = 'light'
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(globalTheme.pending, (state) => {
        state.loading = true
      })
      .addCase(globalTheme.fulfilled, (state, action) => {
        state.theme = action.payload;
        // toast.success("Theme changed!", {theme: "colored", toastId: "themeSetSuccess"});
      })
      .addCase(globalTheme.rejected, (state, action) => {
        state.error = action.payload;
      })
      // .addCase(unsplashTheme.pending, (state) => {
      //   state.loading = true
      // })
      .addCase(unsplashTheme.fulfilled, (state, action) => {
        state.drawer = action.payload;
        // toast.success("Theme changed!", {theme: "colored", toastId: "themeSetSuccess"});
      })
      // .addCase(unsplashTheme.rejected, (state, action) => {
      //   state.error = action.payload;
      // })
      // .addCase(backgroundImageTheme.pending, (state) => {
      //   state.loading = true
      // })
      // .addCase(backgroundImageTheme.fulfilled, (state, action) => {
      //   state.backgroundImage = action.payload;
      //   // toast.success("Theme changed!", {theme: "colored", toastId: "themeSetSuccess"});
      // })
      // .addCase(backgroundImageTheme.rejected, (state, action) => {
      //   state.error = action.payload;
      // })
  }
});
export const { themeReset, clearTheme } = themeSlice.actions;
export default themeSlice.reducer;