import React, { useState } from 'react';
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
    // const card = cards.filter(card => card.id === cardId);
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
    // find the dragged column
    const draggedColumn = columns.find(column => column.id === columnId);

    // remove column dragged from list
    const remainingColumns = columns.filter(column => column.id !== columnId);

    // insert the dragged column into the destination index
    remainingColumns.splice(destinationIndex, 0, draggedColumn);
    
    // update the sequence for each column
    const updatedColumns = remainingColumns.map((column, index) => ({
      ...column,
      sequence: index + 1
    }));

    for (let i = 0; i < updatedColumns.length; i++) {
      const column = updatedColumns[i];

      const formData = {
        column_id: column.id,
        sequence: column.sequence
      }
      await dispatch(updateColumnSequenceInLocalState(formData));
    }

    const updateColumnsPromise = updatedColumns.map(column => {
      return dispatch(updateColumnSequence({boardId: boardId, columnId: column.id, formData: { sequence: column.sequence }}));
    });

    await Promise.all(updateColumnsPromise);
    await dispatch(fetchColumns({ boardId: boardId }));
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