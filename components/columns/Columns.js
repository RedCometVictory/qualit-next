import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { DragDropContext, Droppable } from 'react-beautiful-dnd';
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
    console.log("##### showCardDetail #####")
    // const card = cards.filter(card => card.id === cardId);
    const card = cards.find(card => card.id === cardId);
    console.log("card")
    console.log(card)
    console.log("card.id")
    console.log(card.id)
    console.log("0-0-0-0-0-0-0")
    // todo 0 - dispatch a call to ssearch for card details by simply pushing card id to the backend
    // console.log(card[0])
    // if (card) setCardDetail(card.id);
    if (card) setCardDetail(cardDetail => cardDetail = card);
    // setCardDetail(card[0]);
    // setCardDetail((state) => ({ ...state, ...card[0]}));
    console.log("cardDetail")
    console.log(cardDetail)
    console.log("##### showCardDetail end #####")
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
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")

    console.log("total cards from state")
    console.log(cards)

    console.log("-=-=-=-=-=-=-=-=-=-=-=-")
    console.log("-=-=-=-=-=-=-=-=-=-=-=-")
    console.log("destinationIndex")
    console.log(destinationIndex)
    console.log(".......................")
    console.log("destinationColId")
    console.log(destinationColId)
    console.log(".......................")
    console.log("cardId")
    console.log(cardId)
    console.log("-=-=-=-=-=-=-=-=-=-=-=-")
    console.log("-=-=-=-=-=-=-=-=-=-=-=-")
    const cardsFromColumn = cards.filter(
      card => card.column_id === destinationColId && card.id !== cardId
    );

    console.log("cardsFromColumn")
    console.log(cardsFromColumn)

    const sortedCards = cardsFromColumn.sort((a, b) => a.sequence - b.sequence);
    console.log("sortedCards")
    console.log(sortedCards)

    let sequence = destinationIndex === 0 ? 1 : sortedCards[destinationIndex - 1].sequence + 1;
    
    console.log("sequence")
    console.log(sequence)
    console.log("------------------")
    console.log("sortedCards again...")
    console.log(sortedCards)

    const formData = {
      id: cardId,
      sequence,
      column_id: destinationColId
    };
    console.log("formData")
    console.log(formData)
    console.log("updating the dragged card's sequence?")
    await dispatch(updateCardSequenceInLocalState(formData));
    await dispatch(updateCardSequence({boardId: boardId, cardId: cardId, formData}));

    for (let i = destinationIndex; i < sortedCards.length; i++) {
      console.log("___ for loop ___")
      const card = sortedCards[i];
      sequence += 1;
      
      const formData = {
        id: card.id,
        sequence,
        column_id: destinationColId
      };
      console.log("formData - vai form loop")
      console.log(formData)
      await dispatch(updateCardSequenceInLocalState(formData));
      await dispatch(updateCardSequence({boardId: boardId, cardId: card.id, formData}));
      console.log("___ for loop end ___")
    };
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    // TODO: need to create a localStorage mamory of the column sequence for more faster update wiothout backend delay. Also i need to develop a saving data method to finalize all changes to the backend. This save method needs to be prompted to the user when they are about to refresh or leave the page.
  };

  // const saveColumnSequence = async (destinationIndex, columnId) => {
  //   // find the dragged column
  //   const draggedColumn = columns.find(column => column.id === columnId);
  //   // remove column dragged from list
  //   const remainingColumns = columns.filter(column => column.id !== columnId);
  //   // insert the dragged column into the destination index
  //   remainingColumns.splice(destinationIndex, 0, draggedColumn);
  //   // update the sequence for each column
  //   const updatedColumns = remainingColumns.map((column, index) => ({
  //     ...column,
  //     sequence: index + 1
  //   }));
  //   // const formData = {
  //   //   column_id: columnId,
  //   //   sequence: updatedColumns[0].sequence
  //   // }
  //   // await dispatch(updateColumnSequenceInLocalState(formData));
  //   // await dispatch(updateColumnSequence({boardId: boardId, columnId: updatedColumns[0].id, formData: { sequence: updatedColumns[0].sequence }}));
  //   // dispatch the update for each column
  //   // for (const column of updatedColumns) {
  //   for (let i = 0; i < updatedColumns.length; i++) {
  //     // console.log("___ for loop ___")
  //     const column = updatedColumns[i];
  //     const formData = {
  //       column_id: column.id,
  //       sequence: column.sequence
  //     }
  //     await dispatch(updateColumnSequenceInLocalState(formData));
  //     await dispatch(updateColumnSequence({boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }}));
  //   }
  //   await dispatch(fetchColumns({ boardId: boardId }));
  // };

  // --------------------------------------------------------------------
  // const saveColumnSequence = async (destinationIndex, columnId) => {
  //   // find the dragged column
  //   // const draggedColumn = columns.find(column => column.id === columnId);

  //   // console.log("draggedColumn")
  //   // console.log(draggedColumn)
    
  //   // remove column dragged from list
  //   // const remainingColumns = columns.filter(column => column.id !== columnId);
  //   // const remainingColumns = columns.filter(column => column.id !== draggedColumn.id);
    
  //   // console.log("remainingColumns - filtered:" + ' ' + remainingColumns.length)
  //   // console.log(remainingColumns)
  //   // insert the dragged column into the destination index
  //   // remainingColumns.splice(destinationIndex, 0, draggedColumn);
  //   // console.log("remainingColumns - after splice")
  //   // console.log(remainingColumns)
    
  //   // update the sequence for each column
  //   // const updatedColumns = remainingColumns.map((column, index) => ({
  //   //   ...column,
  //   //   sequence: index + 1
  //   // }));

  //   // console.log("updatedColumns")
  //   // console.log(updatedColumns)
  //   // ------------------------------------
  //   // const filteredColumns = columns;

  //   // console.log("filterCards - befpre filter")
  //   // console.log(filteredColumns)
  //   const filteredColumns = columns.filter(column => column.id !== columnId);
  //   // filteredColumns = filteredColumns.filter(column => column.id !== columnId);
  //   console.log("filterCards - after filter")
  //   console.log(filteredColumns)
    
  //   const sortedColumns = filteredColumns.sort((a, b) => a.sequence - b.sequence);
  //   console.log("sortedColumns")
  //   console.log(sortedColumns)

  //   // does not set sequence to two (2)
  //   let sequence = destinationIndex === 0 ? 1 : sortedColumns[destinationIndex - 1].sequence + 1;
  //   console.log("sequence")
  //   console.log(sequence)

  //   const formData = {
  //     column_id: columnId,
  //     sequence
  //     // sequence: updatedColumns[0].sequence
  //   }
  //   await dispatch(updateColumnSequenceInLocalState(formData));
  //   await dispatch(updateColumnSequence({boardId: boardId, columnId: columnId, formData: { sequence: sequence }}));
  //   // dispatch the update for each column
  //   // TODO: need to create a localStorage mamory of the column sequence for more faster update wiothout backend delay. Also i need to develop a saving data method to finalize all changes to the backend. This save method needs to be prompted to the user when they are about to refresh or leave the page.
  //   for (let i = destinationIndex; i < sortedColumns.length; i++) {
  //     const column = sortedColumns[i];
  //     sequence += 1;

  //     const formData = {
  //       column_id: column.id,
  //       sequence: column.sequence
  //     };

  //     await dispatch(updateColumnSequenceInLocalState(formData));
  //     await dispatch(updateColumnSequence({boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }}));
  //   }

  //   // for (let i = 0; i < updatedColumns.length; i++) {
  //   //   // console.log("___ for loop ___")
  //   //   const column = updatedColumns[i];
  //   //   // console.log("column")
  //   //   // console.log(column)
  //   //   // console.log("column name and sequence")
  //   //   // console.log(column.name + ' ' + column.sequence)

  //   //   // console.log("boardId")
  //   //   // console.log(boardId)
  //   //   // console.log("columnId")
  //   //   // console.log(column.id)
  //   //   const formData = {
  //   //     column_id: column.id,
  //   //     sequence: column.sequence
  //   //   }
  //   //   // console.log("formData - aka - column.sequence")
  //   //   // console.log(column.sequence)
  //   //   // await dispatch(updateColumnSequenceInLocalState(formData));
  //   //   await dispatch(updateColumnSequence({boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }}));
  //   //   // console.log("___ for loop end ___")
  //   // }

  //   // console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
  //   // console.log("END OF COLUMN SEQ SAVE TO LOCAL")
  //   // console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
  //   await dispatch(fetchColumns({ boardId: boardId }));
  // };

  // --------------------------------------------------------------------

  // !DO NOT DELETE - current working function
  // const saveColumnSequence = async (destinationIndex, columnId) => {
  //   // find the dragged column
  //   const draggedColumn = columns.find(column => column.id === columnId);

  //   console.log("draggedColumn")
  //   console.log(draggedColumn)
    
  //   // remove column dragged from list
  //   // const remainingColumns = columns.filter(column => column.id !== columnId);
  //   const remainingColumns = columns.filter(column => column.id !== draggedColumn.id);
    
  //   console.log("remainingColumns - filtered:" + ' ' + remainingColumns.length)
  //   console.log(remainingColumns)
  //   // insert the dragged column into the destination index
  //   remainingColumns.splice(destinationIndex, 0, draggedColumn);
  //   console.log("remainingColumns - after splice")
  //   console.log(remainingColumns)
    
  //   // update the sequence for each column
  //   const updatedColumns = remainingColumns.map((column, index) => ({
  //     ...column,
  //     sequence: index + 1
  //   }));

  //   console.log("updatedColumns")
  //   console.log(updatedColumns)
    
  //   // const formData = {
  //   //   column_id: columnId,
  //   //   sequence: updatedColumns[0].sequence
  //   // }
  //   // await dispatch(updateColumnSequenceInLocalState(formData));
  //   // dispatch the update for each column
  //   // TODO: need to create a localStorage mamory of the column sequence for more faster update wiothout backend delay. Also i need to develop a saving data method to finalize all changes to the backend. This save method needs to be prompted to the user when they are about to refresh or leave the page.
  //   // for (const column of updatedColumns) {
  //   for (let i = 0; i < updatedColumns.length; i++) {
  //     // console.log("___ for loop ___")
  //     const column = updatedColumns[i];
  //     // console.log("column")
  //     // console.log(column)
  //     // console.log("column name and sequence")
  //     // console.log(column.name + ' ' + column.sequence)

  //     // console.log("boardId")
  //     // console.log(boardId)
  //     // console.log("columnId")
  //     // console.log(column.id)
  //     const formData = {
  //       column_id: column.id,
  //       sequence: column.sequence
  //     }
  //     // console.log("formData - aka - column.sequence")
  //     // console.log(column.sequence)
  //     await dispatch(updateColumnSequenceInLocalState(formData));
  //     await dispatch(updateColumnSequence({boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }}));
  //     // console.log("___ for loop end ___")
  //   }

  //   // console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
  //   // console.log("END OF COLUMN SEQ SAVE TO LOCAL")
  //   // console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
  //   await dispatch(fetchColumns({ boardId: boardId }));
  // };



  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  const saveColumnSequence = async (destinationIndex, columnId) => {
    // find the dragged column
    const draggedColumn = columns.find(column => column.id === columnId);

    console.log("draggedColumn")
    console.log(draggedColumn)
    
    // remove column dragged from list
    const remainingColumns = columns.filter(column => column.id !== columnId);
    // const remainingColumns = columns.filter(column => column.id !== draggedColumn.id);
    
    console.log("remainingColumns - filtered:" + ' ' + remainingColumns.length)
    console.log(remainingColumns)
    // insert the dragged column into the destination index
    remainingColumns.splice(destinationIndex, 0, draggedColumn);
    console.log("remainingColumns - after splice")
    console.log(remainingColumns)
    
    // update the sequence for each column
    const updatedColumns = remainingColumns.map((column, index) => ({
      ...column,
      sequence: index + 1
    }));

    console.log("updatedColumns")
    console.log(updatedColumns)
    
    // const formData = {
    //   column_id: columnId,
    //   sequence: updatedColumns[0].sequence
    // }
    // await dispatch(updateColumnSequenceInLocalState(formData));
    // dispatch the update for each column
    // TODO: need to create a localStorage mamory of the column sequence for more faster update wiothout backend delay. Also i need to develop a saving data method to finalize all changes to the backend. This save method needs to be prompted to the user when they are about to refresh or leave the page.
    // for (const column of updatedColumns) {
    for (let i = 0; i < updatedColumns.length; i++) {
      // console.log("___ for loop ___")
      const column = updatedColumns[i];
      // console.log("column")
      // console.log(column)
      // console.log("column name and sequence")
      // console.log(column.name + ' ' + column.sequence)

      // console.log("boardId")
      // console.log(boardId)
      // console.log("columnId")
      // console.log(column.id)
      const formData = {
        column_id: column.id,
        sequence: column.sequence
      }
      // console.log("formData - aka - column.sequence")
      // console.log(column.sequence)
      await dispatch(updateColumnSequenceInLocalState(formData));
      // await dispatch(updateColumnSequence({boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }}));
      // console.log("___ for loop end ___")
    }

    const updateColumnsPromise = updatedColumns.map(column => {
      // const formData = {
      //   column_id: column.id,
      //   sequence: column.sequence
      // }
      
      return dispatch(updateColumnSequence({boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }}));
    });

    await Promise.all(updateColumnsPromise);

    // console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    // console.log("END OF COLUMN SEQ SAVE TO LOCAL")
    // console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    await dispatch(fetchColumns({ boardId: boardId }));
  };
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$









  //! DO NOT DELETE! this is the original version...
  // const saveColumnSequence = async (destinationIndex, columnId) => {
  //   // remove column dragged from list
  //   const filteredColumns = columns.filter(column => column.id !== columnId);
  
  //   const sortedColumns = filteredColumns.sort((a, b) => a.sequence - b.sequence);

  //   let sequence = destinationIndex === 0 ? 1 : sortedColumns[destinationIndex - 1].sequence + 1;

  //   const formData = {
  //     id: columnId,
  //     sequence
  //   };
    
  //   // Update local state to avoid lag when changing sequence and saving change
  //   await dispatch(updateColumnSequence({boardId: id, columnId, formData}));
  //   // await dispatch(updateColumnSequence({boardId: id, columnId, patchColumn}));

  //   for (let i = destinationIndex; i < sortedColumns.length; i++) {
  //     const column = sortedColumns[i];
  //     sequence += 1;
  
  //     const patchColumn = {
  //       id: column.id,
  //       sequence
  //     };
  //     await dispatch(updateColumnSequence({boardId: id, columnId, patchColumn}));
  //   };
  
  //   // refresh view on column change to update
  //   // try to fix this later
  //   //  window.location.reload();
  //   // return console.log('savingcolumn')
  // };
  
  const onDragEnd = async (placement) => {
    const { destination, source, draggableId, type } = placement;
    console.log('Drag End:', { destination, source, draggableId, type });
    // Do nothing if placement is not determinable destination.
    if (!destination) return;
    // Do nothing if card is put back into current place.
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    };
    // If card is dragged.
    if (type === 'card') {
      await saveCardSequence(destination.index, destination.droppableId, draggableId);
    };
    // If column is dragged.
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



/*
const saveCardSequence = async (destinationIndex, destinationColId, cardId) => {
    const cardsFromColumn = cards.filter(
      card => card.columnId === destinationColId && card.id !== cardId
    );
    const sortedCards = cardsFromColumn.sort((a, b) => a.sequence - b.sequence);
    let sequence = destinationIndex === 0 ? 1 : sortedCards[destinationIndex - 1].sequence + 1;
    const patchCard = {
      id: cardId,
      sequence,
      columnId: destinationColId
    };
    
    // Update local state to avoid lag when changing sequence and saving change
    // await dispatch(updateCardSequenceToLocalState(patchCard));
    // await dispatch(updateCardSequence(patchCard));
    await dispatch(updateCardSequence(patchCard));
    // await dispatch(updateCard(patchCard));
    for (let i = destinationIndex; i < sortedCards.length; i++) {
      const card = sortedCards[i];
      sequence += 1;
  
      const patchCard = {
        id: card.id,
        sequence,
        columnId: destinationColId
      };
      // await dispatch(updateCardSequenceToLocalState(patchCard));
      // await dispatch(updateCardSequence(patchCard));
      await dispatch(updateCardSequence({boardId: boardId, cardId: card.id, patchCard}));
      // await dispatch(updateCard(patchCard));
    };
    // return console.log('savingCardSequence')
  };
*/



// %%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%
// original version ???
// %%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%

/**
 * 
 * 

whenever i drag column to a new order this function activates and works along with my react toolkit column slice. I seems to work correctly but for some reason when i drag columns they revert back to their original orders despite haveing differenct sequences in redux state: 

const saveColumnSequence = async (destinationIndex, columnId) => {
    // find the dragged column
    const draggedColumn = columns.find(column => column.id === columnId);

    console.log("draggedColumn")
    console.log(draggedColumn)
    
    // remove column dragged from list
    const remainingColumns = columns.filter(column => column.id !== columnId);
    
    console.log("remainingColumns - filtered")
    console.log(remainingColumns)
    // insert the dragged column into the destination index
    remainingColumns.splice(destinationIndex, 0, draggedColumn);
    console.log("remainingColumns - after splice")
    console.log(remainingColumns)
    
    // update the sequence for each column
    const updatedColumns = remainingColumns.map((column, index) => ({
      ...column,
      sequence: index + 1
    }));

    console.log("updatedColumns")
    console.log(updatedColumns)
    
    // dispatch the update for each column
    // TODO: need to create a localStorage mamory of the column sequence for more faster update wiothout backend delay. Also i need to develop a saving data method to finalize all changes to the backend. This save method needs to be prompted to the user when they are about to refresh or leave the page.
    // for (const column of updatedColumns) {
    for (let i = 0; i < updatedColumns.length; i++) {
      console.log("___ for loop ___")
      const column = updatedColumns[i];
      console.log("column")
      console.log(column)
      console.log("column name and sequence")
      console.log(column.name + ' ' + column.sequence)

      console.log("boardId")
      console.log(boardId)
      console.log("columnId")
      console.log(column.id)
      const formData = {
        column_id: column.id,
        sequence: column.sequence
      }
      console.log("formData - aka - column.sequence")
      console.log(column.sequence)
      await dispatch(updateColumnSequenceInLocalState(formData));
      // await dispatch(updateColumnSequence({
      //   boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }
      // }));
      console.log("___ for loop end ___")
    }
      
    // const sortedColumns = filteredColumns.sort((a, b) => a.sequence - b.sequence);
      
    // let sequence = destinationIndex === 0 ? 1 : sortedColumns[destinationIndex - 1].sequence + 1;
      
    // const formData = {
      //   id: columnId,
      //   sequence
    // };
        
    // Update local state to avoid lag when changing sequence and saving change
    // await dispatch(updateColumnSequence({boardId: id, columnId, formData}));
    // await dispatch(updateColumnSequence({boardId: id, columnId, patchColumn}));
        
    // for (let i = destinationIndex; i < sortedColumns.length; i++) {
      //   const column = sortedColumns[i];
      //   sequence += 1;
        
      //   const patchColumn = {
      //     id: column.id,
      //     sequence
      //   };
      //   await dispatch(updateColumnSequence({boardId: id, columnId, patchColumn}));
    // };

    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    console.log("END OF COLUMN SEQ SAVE TO LOCAL")
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    // await dispatch(fetchColumns({ boardId: boardId }));
  };

here is my redux state for column slice:

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
      // const columnIndex = state.columns.findIndex(column => column.id === payload.id);
      // state.columns[columnIndex].sequence = payload.sequence;
      console.log("33333333-+-+-EEEEEEEE")
      console.log("updating sequence")
      console.log("payload")
      console.log(payload)
      const cardIndex = state.columns.findIndex(column => column.id === payload.column_id);
      console.log("cardIndex")
      console.log(cardIndex)
      if (cardIndex !== -1) {
        state.columns[cardIndex].sequence = payload.sequence;
        // state.columns[cardIndex].column_id = payload.column_id;
      }
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

please check for errors

 */