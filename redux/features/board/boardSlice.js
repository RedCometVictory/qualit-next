import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { HYDRATE } from 'next-redux-wrapper';
import { toast } from 'react-toastify';
import boardService from './boardService';

let initBoardState = {
  id: '',
  name: '',
  columns: '',
  createdBy: '',
  dateCreated: '',
  backgroundImage: '',
  users: []
};

const initialState = {
  boards: typeof window !== "undefined" && localStorage.getItem('qual__boards') ? JSON.parse(localStorage.getItem('qual__boards')) : [],
  board: typeof window !== "undefined" && localStorage.getItem('qual__board') ? JSON.parse(localStorage.getItem('qual__board')) : initBoardState,
  status: 'idle',
  requestingNew: false,
  loading: false,
  error: {}
};

// ########## Boards ##########
export const getAllBoards = createAsyncThunk(
  'boards/get/All-Boards',
  async (userData, thunkAPI) => {
    try {
      return await boardService.getAllBoards(userData, thunkAPI);
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

export const createBoard = createAsyncThunk(
  'board/post/create-board',
  async (boardFormData, thunkAPI) => {
    try {
      return await boardService.createBoard(boardFormData, thunkAPI);
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

// ######## BoardById ########
// create | update board by id
export const saveBoard = createAsyncThunk(
  'board/put/save-board',
  async (boardFormData, thunkAPI) => {
    try {
      return await boardService.saveBoard(boardFormData, thunkAPI);
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

export const getBoard = createAsyncThunk(
  'board/get/Board-By-Id',
  async (boardId, thunkAPI) => {
    try {
      return await boardService.getBoard(boardId, thunkAPI);
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

export const deleteBoard = createAsyncThunk(
  'board/delete',
  async (boardId, thunkAPI) => {
    try {
      return await boardService.deleteBoard(boardId, thunkAPI);
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

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    rehydrate(state, action) {
      state.boards = action.payload.boards;
      state.board = action.payload.board;
      state.status = action.payload.status;
      state.requestingNew = action.payload.requestingNew;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
    updateBoardDetail: (state, { payload }) => {
      state.board[payload.type] = payload.value;
    },
    resetBoard: () => initialState
  },
  extraReducers: {
    // [HYDRATE]: (state, action) => {
    //   console.log("HYDRATE", action.payload);
    //   return {
    //     ...state,
    //     ...action.payload.board
    //   }
    // },
    [getAllBoards.pending]: (state) => {
      state.status = 'pending';
      state.loading = true;
    },
    [getAllBoards.fulfilled]: (state, { payload }) => {
      state.boards = payload;
      state.status = 'success';
      state.loading = false;
    },
    [getAllBoards.rejected]: (state) => {
      state.status = 'failed';
    },
    [createBoard.pending]: (state) => {
      state.pending = 'pending';
      state.requestingNew = true;
    },
    [createBoard.fulfilled]: (state) => {
      state.status = 'success';
      state.requestingNew = false;
    },
    [createBoard.rejected]: (state) => {
      state.status = 'failed';
      state.requestingNew = false;
    },
    [saveBoard.pending]: (state) => {
      state.status = 'pending';
      state.loading = true;
    },
    [saveBoard.fulfilled]: (state) => {
      state.status = 'success';
      state.loading = false;
    },
    [saveBoard.rejected]: (state) => {
      state.status = 'failed';
      state.loading = false;
    },
    [getBoard.pending]: (state) => {
      state.status = 'pending';
      state.loading = true;
    },
    [getBoard.fulfilled]: (state, { payload }) => {
      state.board = payload;
      state.status = 'success';
      state.loading = false;
    },
    [getBoard.rejected]: (state) => {
      state.status = 'failed';
      state.loading = false;
    },
    [deleteBoard.pending]: (state) => {
      state.status = 'pending';
      state.loading = true;
    },
    [deleteBoard.fulfilled]: (state) => {
      state.status = 'success';
      state.loading = false;
    },
    [deleteBoard.rejected]: (state) => {
      state.status = 'failed';
      state.loading = false;
    }
  }
});
export const { rehydrate, updateBoardDetail, resetBoard } = boardSlice.actions;
export default boardSlice.reducer;