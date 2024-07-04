import nc from 'next-connect';
import { onError, onNoMatch } from '@/utils/ncOptions';
import { verifAuth, authRoleDev } from '@/utils/verifAuth';
import { pool } from '@/config/db';

export const config = {
  api: { bodyParser: true }
};

const handler = nc({onError, onNoMatch});
handler.use(verifAuth, authRoleDev);

// update column sequence
// TODO: apply sequence to column to reflect change
handler.put(async (req, res) => {
  const { boardId, columnId } = req.query;
  // const { id, sequence } = req.body;
  const { sequence } = req.body;

  console.log("()()()()()()()()()")
  console.log("req.query")
  console.log(req.query)
  console.log("()()()()()()()()()")
  console.log("req.body")
  console.log(req.body)
  console.log("()()()()()()()()()")
  //! TODO: Check if there is a name, then update if there is a change, else skip the name update

  let updatedByTimeStamp = new Date();
  let updatedColumnSeq;
  
  updatedColumnSeq = await pool.query('UPDATE columns SET sequence = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [sequence, updatedByTimeStamp, columnId]);
  // updatedColumnSeq = await pool.query('UPDATE columns SET sequence = $1, updated_at = $2 WHERE id = $3 RETURNING *;', [sequence, updatedByTimeStamp, id]);
  
  if (updatedColumnSeq.rowCount === 0 || updatedColumnSeq === null) {
    throw new Error('Failed to update column.');
  }

  return res.status(200).json({
    status: "Success! Updated board.",
    data: {
      // column: updatedColumnSeq.rows[0]
    }
  });
});
export default handler;




















































/*
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColumns, addColumn, updateColumnSequence, updateColumnSequenceInLocalState } from '@/redux/features/column/columnSlice';
import { updateCardSequence, updateCardSequenceInLocalState } from '@/redux/features/card/cardSlice';
import { v4 as uuidv4 } from 'uuid';
import Column from './Column';
import AddColumn from './AddColumn';
import CardDetailModal from '../modals/CardDetailModal';

const initialCardState = {
  id: '',
  title: '',
  description: '',
  priority: '',
  type: '',
}

const Columns = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: boardId } = router.query;
  const { columns } = useSelector((state) => state.column);
  const cards = useSelector((state) => state.card.cards);
  const [isModalOpen, setModalOpen] = useState(false);
  const [cardDetail, setCardDetail] = useState(null);

  

  const showCardDetail = (cardId) => {
    const card = cards.find(card => card.id === cardId);
    if (card) setCardDetail(cardDetail => cardDetail = card);
    setModalOpen(true); // ? card modal
  };

  const addColumnToBoard = async (e) => {
    let totalColumnsArr = columns ?? [];
    let sequence = 1;

    if (columns.length > 0) {
      sequence = totalColumnsArr[totalColumnsArr.length - 1].sequence + 1;
    };

    const formData = {
      name: "Add Title",
      sequence
    };

    await dispatch(addColumn({boardId: boardId, formData}));
    await dispatch(fetchColumns({boardId: boardId}));
  };

  const filterCards = (columnId) => {
    const filteredCards = cards.filter((card) => card.column_id === columnId);
    return filteredCards;
  };

  const saveCardSequence = async (destinationIndex, destinationColId, cardId) => {
    const cardsFromColumn = cards.filter(
      card => card.column_id === destinationColId && card.id !== cardId
    );

    const sortedCards = cardsFromColumn.sort((a, b) => a.sequence - b.sequence);
    let sequence = destinationIndex === 0 ? 1 : sortedCards[destinationIndex - 1].sequence + 1;

    const formData = {
      id: cardId,
      sequence,
      column_id: destinationColId
    };
    await dispatch(updateCardSequenceInLocalState(formData));
    await dispatch(updateCardSequence({boardId: boardId, cardId: cardId, formData}));

    for (let i = destinationIndex; i < sortedCards.length; i++) {
      const card = sortedCards[i];
      sequence += 1;
      
      const formData = {
        id: card.id,
        sequence,
        column_id: destinationColId
      };
      await dispatch(updateCardSequenceInLocalState(formData));
      await dispatch(updateCardSequence({boardId: boardId, cardId: card.id, formData}));
    };
  };

  const saveColumnSequence = async (destinationIndex, columnId) => {
    const draggedColumn = columns.find(column => column.id === columnId);
    const remainingColumns = columns.filter(column => column.id !== columnId);
    remainingColumns.splice(destinationIndex, 0, draggedColumn);
    const updatedColumns = remainingColumns.map((column, index) => ({
      ...column,
      sequence: index + 1
    }));
    // const formData = {
    //   column_id: columnId,
    //   sequence: updatedColumns[0].sequence
    // }
    // await dispatch(updateColumnSequenceInLocalState(formData));
    // await dispatch(updateColumnSequence({boardId: boardId, columnId: updatedColumns[0].id, formData: { sequence: updatedColumns[0].sequence }}));
    for (let i = 0; i < updatedColumns.length; i++) {
      const column = updatedColumns[i];
      const formData = {
        column_id: column.id,
        sequence: column.sequence
      }
      await dispatch(updateColumnSequenceInLocalState(formData));
      await dispatch(updateColumnSequence({boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }}));
    }
    await dispatch(fetchColumns({ boardId: boardId }));
  };
    
  const onDragEnd = async (placement) => {
    const { destination, source, draggableId, type } = placement;

    if (!destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    };

    if (type === 'card') {
      await saveCardSequence(destination.index, destination.droppableId, draggableId);
    };

    if (type === 'column') {
      await saveColumnSequence(destination.index, draggableId);
    };
  };

  return (
    <section className="board__inner-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId='all-columns' direction='horizontal' type='column'>
        {(provided) => (
          <div
            className="board__lanes"
            ref={provided.innerRef}
            {...provided.droppableProps}
            // {...provided.dragHandleProps}
          >
            {columns.map((column, index) => (
              <Column
                key={column.id}
                column={column}
                id={column.id}
                index={index}
                cards={filterCards(column.id)}
                showCardDetail={showCardDetail}
                setModalOpen={setModalOpen}
              />
            ))}
            {provided.placeholder}
            <AddColumn addColumnToBoard={addColumnToBoard}/>
          </div>
        )}
        </Droppable>
      </DragDropContext>
      {isModalOpen && <CardDetailModal setModalOpen={setModalOpen} card={cardDetail} />}
    </section>
  )
};
export default Columns;

// ----------------------------------------

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
  async ({boardId, formData}, thunkAPI) => {
    try {
      return await columnService.addColumn(boardId, formData, thunkAPI);
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
      return await columnService.updateColumnSequence(boardId, columnId, formData, thunkAPI);
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
      const columnIndex = state.columns.findIndex(column => column.id === payload.column_id);
      // if (columnIndex !== -1) {
        state.columns[columnIndex].sequence = payload.sequence;
        // state.columns[cardIndex].column_id = payload.column_id;
      // }
      state.columns.sort((a, b) => a.sequence - b.sequence);
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
      state.isRequested = true;
      state.loading = true;
    },
    [fetchColumns.fulfilled]: (state, { payload }) => {
      if (Array.isArray(payload) && payload.length > 1) {
        state.columns = payload.columns.sort((a, b) => a.sequence - b.sequence);
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
    [updateColumnSequence.fulfilled]: (state, { payload }) => {
      // console.log("33333333-+-+-EEEEEEEE")
      // console.log("updating sequence")
      // console.log("payload")
      // console.log(payload)
      // const columnIndex = state.columns.findIndex(column => column.id === payload.column.id);
      // console.log("columnIndex")
      // console.log(columnIndex)
      // if (columnIndex !== -1) {
      //   state.columns[columnIndex].sequence = payload.column.sequence;
      //   // state.columns[cardIndex].column_id = payload.column_id;
      // }
      // state.columns.sort((a, b) => a.sequence - b.sequence);

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
*/