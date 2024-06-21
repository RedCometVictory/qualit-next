import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Card } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { fetchColumns, addColumn, updateColumn, updateColumnSequence } from '@/redux/features/column/columnSlice';
import { updateCard, updateCardSequence } from '@/redux/features/card/cardSlice';
import { v4 as uuidv4 } from 'uuid';
import Column from './Column';
import AddColumn from './AddColumn';
import CardDetailModal from '../modals/CardDetailModal';
import CardUI from '../UI/CardUI';

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
  const { id } = router.query;
  const columns = useSelector((state) => state.column.columns);
  const cards = useSelector((state) => state.card.cards);
  const [isModalOpen, setModalOpen] = useState(false);
  const [cardDetail, setCardDetail] = useState(initialCardState);
  // set to: isOpen, onOpen, onClose
  // const { isOpen, onOpen, onClose }= useDisclosure();
  // let [triggerCond, setTriggerCond] = useState('isOpen');

  // const showCardDetail = changeCardDetail();
  // ? may change to showCardDetail
  const showCardDetail = (cardId) => {
    const card = cards.filter(card => card.id === cardId);
    setCardDetail(card[0]);
    setModalOpen(true); // ? card modal
    // onOpen(); // isOpen, onOpen, onClose
  };

  const addColumnToBoard = async (e) => {
    const columnId = uuidv4();
    // TODO set the creation of the column purely to the backend, then refetch all columns (data) or via redux add the new column to front end state
    console.log("adding a new column!s");
    // await dispatch(addColumn(columnId));
    await dispatch(addColumn(id));
    await dispatch(fetchColumns({boardId: id}));
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
      await dispatch(updateCardSequence({boardId: id, cardId: card.id, patchCard}));
      // await dispatch(updateCard(patchCard));
    };
    // return console.log('savingCardSequence')
  };

  const saveColumnSequence = async (destinationIndex, columnId) => {
    // remove column removed from list
    const filteredColumns = columns.filter(column => column.id !== columnId);
  
    const sortedColumns = filteredColumns.sort((a, b) => a.sequence - b.sequence);

    let sequence = destinationIndex === 0 ? 1 : sortedColumns[destinationIndex - 1].sequence + 1;
  
    const patchColumn = {
      id: columnId,
      sequence
    };
    
    // Update local state to avoid lag when changing sequence and saving change
    await dispatch(updateColumnSequence({boardId: id, columnId, patchColumn}));
    // await dispatch(updateColumn(patchColumn));
    // await dispatch(updateColumnSequenceToLocalState(patchColumn));
    // await dispatch(updateColumnSequence(patchColumn));
  
    for (let i = destinationIndex; i < sortedColumns.length; i++) {
      const column = sortedColumns[i];
      sequence += 1;
  
      const patchColumn = {
        id: column.id,
        sequence
      };
      await dispatch(updateColumnSequence({boardId: id, columnId, patchColumn}));
      // await dispatch(updateColumn(patchColumn));
      // await dispatch(updateColumnSequenceToLocalState(patchColumn));
      // await dispatch(updateColumnSequence(patchColumn));
    };
  
    // refresh view on column change to update
    // try to fix this later
    window.location.reload();
    // return console.log('savingcolumn')
  };
  
  const onDragEnd = async (placement) => {
    const { destination, source, draggableId, type } = placement;
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