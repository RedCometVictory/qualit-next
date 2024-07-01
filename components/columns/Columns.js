import React, { useEffect, useState } from 'react';
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

    // ! title: 1, seq: 1
    let sequence = destinationIndex === 0 ? 1 : sortedCards[destinationIndex - 1].sequence + 1;
    // const formData = {
    //   id: cardId,
    //   sequence,
    //   columnId: destinationColId
    // };
    
    console.log("sequence")
    console.log(sequence)
    console.log("------------------")
    console.log("sortedCards again...")
    console.log(sortedCards)
    // ! title: 1, seq: 2
    
    // Update local state to avoid lag when changing sequence and saving change
    // await dispatch(updateCardSequence({boardId, cardId: cardId, formData}));

    const formData = {
      id: cardId,
      sequence,
      columnId: destinationColId
    };
    console.log("formData")
    console.log(formData)
    console.log("updating the dragged card's sequence?")
    await dispatch(updateCardSequence({boardId: boardId, cardId: cardId, formData}));



    for (let i = destinationIndex; i < sortedCards.length; i++) {
      const card = sortedCards[i];
      sequence += 1;
      // ! title: 1, seq: 3
      
      const formData = {
        id: card.id,
        sequence,
        columnId: destinationColId
      };
      console.log("formData - vai form loop")
      console.log(formData)
      await dispatch(updateCardSequence({boardId: boardId, cardId: card.id, formData}));
    };
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    // -------------------------------------------------
    // find the dragged column
    // const draggedColumn = columns.find(column => column.id === columnId);    
    // remove column dragged from list
    // const remainingColumns = columns.filter(column => column.id !== columnId);
    // insert the dragged column into the destination index
    // remainingColumns.splice(destinationIndex, 0, draggedColumn);
    // update the sequence for each column
    // const updatedColumns = remainingColumns.map((column, index) => ({
      // ...column,
      // sequence: index + 1
    // }));
    // dispatch the update for each column
    // TODO: need to create a localStorage mamory of the column sequence for more faster update wiothout backend delay. Also i need to develop a saving data method to finalize all changes to the backend. This save method needs to be prompted to the user when they are about to refresh or leave the page.
    // for (const column of updatedColumns) {
    // for (let i = 0; i < updatedColumns.length; i++) {
      // console.log("___ for loop ___")
      // const column = updatedColumns[i];
      // console.log("column")
      // console.log(column)

      // console.log("boardId")
      // console.log(boardId)
    
      // await dispatch(updateColumnSequence({
        // boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }
      // }));
      // console.log("___ for loop end ___")
    // }
  };

  const saveColumnSequence = async (destinationIndex, columnId) => {
    // find the dragged column
    const draggedColumn = columns.find(column => column.id === columnId);

    // console.log("draggedColumn")
    // console.log(draggedColumn)
    
    // remove column dragged from list
    const remainingColumns = columns.filter(column => column.id !== columnId);
    
    // console.log("remainingColumns - filtered")
    // console.log(remainingColumns)
    // insert the dragged column into the destination index
    remainingColumns.splice(destinationIndex, 0, draggedColumn);
    // console.log("remainingColumns - after splice")
    // console.log(remainingColumns)
    
    // update the sequence for each column
    const updatedColumns = remainingColumns.map((column, index) => ({
      ...column,
      sequence: index + 1
    }));

    // console.log("updatedColumns")
    // console.log(updatedColumns)
    
    // dispatch the update for each column
    // TODO: need to create a localStorage mamory of the column sequence for more faster update wiothout backend delay. Also i need to develop a saving data method to finalize all changes to the backend. This save method needs to be prompted to the user when they are about to refresh or leave the page.
    // for (const column of updatedColumns) {
    for (let i = 0; i < updatedColumns.length; i++) {
      // console.log("___ for loop ___")
      const column = updatedColumns[i];
      // console.log("column")
      // console.log(column)

      // console.log("boardId")
      // console.log(boardId)
      // console.log("columnId")
      // console.log(column.id)
      // console.log("formData - aka - column.sequence")
      // console.log(column.sequence)
      await dispatch(updateColumnSequence({
        boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }
      }));
      // console.log("___ for loop end ___")
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
            
    // console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
    // console.log("XLXLXLXLXLXLXLXLXLXLXLXLXLXLXL")
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