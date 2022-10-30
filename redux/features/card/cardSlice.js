import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { HYDRATE } from "next-redux-wrapper";
import { toast } from 'react-toastify';
import cardService from './cardService';

let initCardState = {
  id: '',
  title: '',
  description: '',
  priority: '',
  type: '',
  sequence: 0 || undefined || null,
  boardId: '',
  columnId: '',
  userId: ''
};

const initialState = {
  cards: typeof window !== "undefined" && localStorage.getItem('qual__cards') ? JSON.parse(localStorage.getItem('qual__cards')) : [],
  card: typeof window !== "undefined" && localStorage.getItem('qual__card') ? JSON.parse(localStorage.getItem('qual__card')) : initCardState,
  status: 'idle',
  isRequested: false,
  loading: false,
  error: {} 
};

export const fetchCards = createAsyncThunk(
  'cards/get/fetch-All-Cards',
  async (_, thunkAPI) => {
    try {
      return await cardService.fetchCards();
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

export const addCard = createAsyncThunk(
  'cards/post/add-card',
  async (formData, thunkAPI) => {
    try {
      return await cardService.addCard(formData, thunkAPI);
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

export const updateCard = createAsyncThunk(
  'cards/put/update-Card',
  async (formData, thunkAPI) => {
    try {
      return await cardService.updateCard(formData, thunkAPI);
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

export const updateCardSequence = createAsyncThunk(
  'cards/put/card-update-sequence',
  async (formData, thunkAPI) => {
    try {
      return await cardService.updateCardSequence(formData, thunkAPI);
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

export const deleteCard = createAsyncThunk(
  'cards/delete',
  async (formData, thunkAPI) => {
    try {
      return await cardService.deleteCard(formData, thunkAPI);
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

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    rehydrate(state, action) {
      state.cards = action.payload.cards;
      state.card = action.payload.card;
      state.status = action.payload.status;
      state.isRequested = action.payload.isRequested;
      state.loading = action.payload.loading;
      state.error = action.payload.error;
    },
    resetCards: () => initialState,
    updateCardSequenceInLocalState: (state, { payload }) => {
      const cardIndex = state.cards.findIndex(card => card.id === payload.id);
      state.cards[cardIndex].sequence = payload.sequence;
      state.cards[cardIndex].columnId = payload.columnId; 
    }
  },
  extraReducers: {
    // [HYDRATE]: (state, action) => {
    //   console.log("HYDRATE", action.payload);
    //   return {
    //     ...state,
    //     ...action.payload.card
    //   }
    // },
    [fetchCards.pending]: (state) => {
      state.status = 'pending';
      state.isRequested = true;
      state.loading = true;
    },
    [fetchCards.fulfilled]: (state, { payload }) => {
      state.cards = payload;
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [fetchCards.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
    [addCard.pending]: (state) => {
      state.status = 'pending';
      state.isRequested = true;
      state.loading = true;
    },
    [addCard.fulfilled]: (state) => {
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [addCard.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
    [updateCard.pending]: (state) => {
      state.status = 'pending';
      state.isRequested = true;
      state.loading = true;
    },
    [updateCard.fulfilled]: (state) => {
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [updateCard.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
    [updateCardSequence.pending]: (state) => {
      state.status = 'pending';
      state.isRequested = true;
      state.loading = true;
    },
    [updateCardSequence.fulfilled]: (state) => {
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [updateCardSequence.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
    [deleteCard.pending]: (state) => {
      state.status = 'pending';
      state.isRequested = true;
      state.loading = true;
    },
    [deleteCard.fulfilled]: (state) => {
      state.status = 'success';
      state.isRequested = false;
      state.loading = false;
    },
    [deleteCard.rejected]: (state) => {
      state.status = 'failed';
      state.isRequested = false;
      state.loading = false;
    },
  }
});

export const { rehydrate, resetCards, updateCardSequenceInLocalState } = cardSlice.actions;
export default cardSlice.reducer;