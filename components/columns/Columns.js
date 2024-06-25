import React, { useState } from 'react';
import { useRouter } from 'next/router';
// import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useDispatch, useSelector } from 'react-redux';
import { fetchColumns, addColumn, updateColumnSequence } from '@/redux/features/column/columnSlice';
import { updateCardSequence } from '@/redux/features/card/cardSlice';
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
  const [cardDetail, setCardDetail] = useState(initialCardState);

  const showCardDetail = (cardId) => {
    const card = cards.filter(card => card.id === cardId);
    setCardDetail(card[0]);
    setModalOpen(true); // ? card modal
  };

  const addColumnToBoard = async (e) => {
    const columnId = uuidv4();
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

  const saveColumnSequence = async (destinationIndex, columnId) => {
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
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
    // TODO: dispatch the update for each column (may move this to the backend, tghe switching of the column sequences that is, so the api does not have to fire off mmultiple times... saving time and money)
    // for (const column of updatedColumns) {
    for (let i = 0; i < updatedColumns.length; i++) {
      console.log("___ for loop ___")
      const column = updatedColumns[i];
      console.log("column")
      console.log(column)

      console.log("boardId")
      console.log(boardId)
      console.log("columnId")
      console.log(column.id)
      console.log("formData - aka - column.sequence")
      console.log(column.sequence)
      await dispatch(updateColumnSequence({
        boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }
      }));
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
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    await dispatch(fetchColumns({ boardId: boardId }));
  };

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


  // {isModalOpen && <CardDetailModal setModalOpen={setModalOpen} card={cardDetail} />}
  // {/* <div className="board">
  //   <AddColumn />
  // </div> */}
  // <Column isModalOpen={setModalOpen} />
  // <Column isModalOpen={setModalOpen} />

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