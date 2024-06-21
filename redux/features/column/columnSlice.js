import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { HYDRATE } from "next-redux-wrapper";
import { toast } from 'react-toastify';
import columnService from './columnService';

const initColumnState = {
  id: '',
  sequence: 0 || undefined || null,
  columnId: ''
};

const initialState = {
  columns: typeof window !== "undefined" && localStorage.getItem('qual__cols') ? JSON.parse(localStorage.getItem('qual__cols')) : [],
  column: typeof window !== "undefined" && localStorage.getItem('qual__colm') ? JSON.parse(localStorage.getItem('qual__colm')) : initColumnState,
  status: 'idle',
  isRequested: false,
  loading: false,
  error: {} 
};

export const fetchColumns = createAsyncThunk(
  'columns/get/fetch-All-Columns',
  async ({boardId, cookie}, thunkAPI) => {
    try {
      return await columnService.fetchColumns(boardId, cookie);
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

export const addColumn = createAsyncThunk(
  'columns/post/column-add',
  // async ({boardId, formData}, thunkAPI) => {
  async (boardId, thunkAPI) => {
    try {
      return await columnService.addColumn(boardId, thunkAPI);
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

export const updateColumn = createAsyncThunk(
  'columns/put/update-column',
  async ({formData, boardId, columnId}, thunkAPI) => {
    try {
      return await columnService.updateColumn(boardId, columnId, formData, thunkAPI);
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

export const updateColumnSequence = createAsyncThunk(
  'columns/put/column-update-sequence',
  async ({boardId, columnId, formData}, thunkAPI) => {
    try {
      return await columnService.updateColumnSequence(columnId, boardId, formData, thunkAPI);
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

export const deleteColumn = createAsyncThunk(
  'columns/delete',
  async ({boardId, columnId}, thunkAPI) => {
    try {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      console.log("columnSlice")
      console.log("boardId")
      console.log(boardId)
      console.log("columnId")
      console.log(columnId)
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
      return await columnService.deleteColumn(boardId, columnId, thunkAPI);
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

const columnSlice = createSlice({
  name: 'column',
  initialState,
  reducers: {
    rehydrate(state, action) {
      state.columns = action.payload.columns;
      state.column = action.payload.column;
      state.status = action.payload.status;
      state.isRequested = action.payload.isRequested;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
    resetColumns: () => initialState,
    updateColumnSequenceInLocalState: (state, { payload }) => {
      const columnIndex = state.columns.findIndex(column => column.id === payload.id);
      state.columns[columnIndex].sequence = payload.sequence;
    }
  },
  extraReducers: {
    // [HYDRATE]: (state, action) => {
    //   console.log("HYDRATE", action.payload);
    //   return {
    //     ...state,
    //     ...action.payload.column
    //   }
    // },
    [fetchColumns.pending]: (state) => {
      state.status = 'pending';
      // state.isRequested = true;
      state.isRequested = false;
      state.loading = true;
    },
    [fetchColumns.fulfilled]: (state, { payload }) => {
      // state.columns = payload;
      // const sortedColumns = payload.sort((a, b) => a.sequence - b.sequence);
      // state.columns = sortedColumns;

      if (Array.isArray(payload) && payload.length > 1) {
        state.columns = payload.sort((a, b) => a.sequence - b.sequence);
      } else {
        state.columns = payload.columns; // Either an empty array or a single item array
      }
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [fetchColumns.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
    [addColumn.pending]: (state) => {
      state.status = 'pending';
      state.isRequested = true;
      state.loading = true;
    },
    [addColumn.fulfilled]: (state) => {
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [addColumn.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
    [updateColumn.pending]: (state) => {
      state.status = 'pending';
      state.isRequested = true;
      state.loading = true;
    },
    [updateColumn.fulfilled]: (state) => {
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [updateColumn.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
    [updateColumnSequence.pending]: (state) => {
      state.status = 'pending';
      state.isRequested = true;
      state.loading = true;
    },
    [updateColumnSequence.fulfilled]: (state) => {
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [updateColumnSequence.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
    [deleteColumn.pending]: (state) => {
      state.status = 'pending';
      // state.isRequested = true;
      state.isRequested = false;
      state.loading = true;
    },
    [deleteColumn.fulfilled]: (state) => {
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [deleteColumn.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
  }
});
export const { rehydrate, resetColumns, updateColumnSequenceInLocalState } = columnSlice.actions;
export default columnSlice.reducer;