import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { HYDRATE } from 'next-redux-wrapper';
import { toast } from 'react-toastify';
import boardService from './boardService';

let initBoardState = {
  id: '',
  name: '',
  columns: [],
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
  async (cookie, thunkAPI) => {
    try {
      return await boardService.getAllBoards(cookie, thunkAPI);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to fetch all boards.", {theme: "colored", toastId: "FetchBoardsError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createBoard = createAsyncThunk(
  'board/post/create-board',
  async (formData, thunkAPI) => {
    try {
      return await boardService.createBoard(formData, thunkAPI);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to create new board.", {theme: "colored", toastId: "CreateBoardError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ######## BoardById ########
// create | update board by id
export const saveBoard = createAsyncThunk(
  'board/put/save-board',
  async ({boardFormData, boardId}, thunkAPI) => {
    try {
      return await boardService.saveBoard(boardFormData, boardId);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to save board.", {theme: "colored", toastId: "SaveProjectError"});
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getBoard = createAsyncThunk(
  'board/get/Board-By-Id',
  async ({boardId, cookie}, thunkAPI) => {
    try {
      return await boardService.getBoard(boardId, cookie, thunkAPI);
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString()
      toast.error("Failed to get board details.", {theme: "colored", toastId: "GetProjectError"});
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
      toast.error("Failed to delete board.", {theme: "colored", toastId: "DeleteBoardError"});
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
      state.boards = payload.boards;
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
    [createBoard.fulfilled]: (state, { payload }) => {
      state.status = 'success';
      // todo: ensure order is from newest first to oldest
      state.boards = [payload, ...state.boards];
      state.requestingNew = false;
    },
    [createBoard.rejected]: (state) => {
      state.status = 'failed';
      state.requestingNew = false;
    },
    [saveBoard.pending]: (state, { payload }) => {
      state.status = 'pending';
      // state.board = payload;
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
      state.board = payload.board;
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