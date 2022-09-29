import React, {  useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Card } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import Column from './Column';
import AddColumn from './AddColumn';
import CardDetailModal from '../modals/CardDetailModal';
import CardUI from '../UI/CardUI';

const initialState = {
  id: '',
  title: '',
  description: ''
}

const Columns = () => {
  const dispatch = useDispatch();
  // const columns = useSelector((state) => state.columns.columns);
  // const cards = useSelector((state) => state.cards.cards);
  const [isModalOpen, setModalOpen] = useState(false);
  const [cardDetail, setCardDetail] = useState(initialState);
  // set to: isOpen, onOpen, onClose
  // const { isOpen, onOpen, onClose }= useDisclosure();
  // let [triggerCond, setTriggerCond] = useState('isOpen');

  // const showCardDetail = changeCardDetail();
  // const changeCardDetail = (cardId) => {
  //   const card = cards.filter(card => card.id === cardId);
  //   setCardDetail(card[0]);
  //   // onOpen();
  //   setTriggerCond(triggerCond = 'onOpen');
  // };

  const addColumn = async (e) => {
    const columnId = uuidv4();
    console.log("adding a new column!s");
    // await dispatch(addColumnToBoard(columnId));
    // await dispatch(fetchColumns());
  };

  // const filterCards = (columnId) => {
  //   const filteredCards = cards.filter((card) => card.columnId === columnId);

  //   return filteredCards;
  // };

  const saveCardSequence = async (destinationIndex, destinationColId, cardId) => {
    // const cardsFromColumn = cards.filter(
    //   card => card.columnId === destinationColId && card.id !== cardId
    // );
    // const sortedCards = cardsFromColumn.sort((a, b) => a.sequence - b.sequence);
    // let sequence = destinationIndex === 0 ? 1 : sortedCards[destinationIndex - 1].sequence + 1;
    // const patchCard = {
    //   id: cardId,
    //   sequence,
    //   columnId: destinationColId
    // };
    
    // Update local state to avoid lag when changing sequence and saving change
    // await dispatch(updateCardSequenceToLocalState(patchCard));
    // await dispatch(updateCardSequence(patchCard));
    // for (let i = destinationIndex; i < sortedCards.length; i++) {
    //   const card = sortedCards[i];
    //   sequence += 1;
  
    //   const patchCard = {
    //     id: card.id,
    //     sequence,
    //     columnId: destinationColId
    //   };
      // await dispatch(updateCardSequenceToLocalState(patchCard));
      // await dispatch(updateCardSequence(patchCard));
    // };
    return console.log('savingCardSequence')
  };
  const saveColumnSequence = async (destinationIndex, columnId) => {
    // remove column removed from list
    // const filteredColumns = columns.filter(column => column.id !== columnId);
  
    // const sortedColumns = filteredColumns.sort((a, b) => a.sequence - b.sequence);
  
    // let sequence = destinationIndex === 0 ? 1 : sortedColumns[destinationIndex - 1].sequence + 1;
  
    // const patchColumn = {
    //   id: columnId,
    //   sequence
    // };
    
    // Update local state to avoid lag when changing sequence and saving change
    // await dispatch(updateColumnSequenceToLocalState(patchColumn));
    // await dispatch(updateColumnSequence(patchColumn));
  
    // for (let i = destinationIndex; i < sortedColumns.length; i++) {
    //   const column = sortedColumns[i];
    //   sequence += 1;
  
    //   const patchColumn = {
    //     id: column.id,
    //     sequence
    //   };
      // await dispatch(updateColumnSequenceToLocalState(patchColumn));
      // await dispatch(updateColumnSequence(patchColumn));
    // };
  
    // refresh view on column change to update
    // try to fix this later
    // window.location.reload();
    return console.log('savingcolumn')
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
      // await saveCardSequence(destination.index, destination.droppableId, draggableId);
    };
    // If column is dragged.
    if (type === 'column') {
      await saveColumnSequence(destination.index, draggableId);
    };
  };
  return (
    <section className="board__col-container">
      <DragDropContext
        onDragEnd={onDragEnd}
      >
        <Droppable
          droppableId='all-columns'
          direction='horizontal'
          type='column'
        >
        {(provided) => (
          <div
            className="board__lanes"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {/* {columns.map((column, index) => (
              <Column
                key={column.id}
                column={column}
                id={column.id}
                index={index}
                cards={filterCards(column.id)}
                showCardDetail={showCardDetail}
              />
            ))} */}
            {/* {provided.placeholder} */}
            <Column isModalOpen={setModalOpen} />
            <Column isModalOpen={setModalOpen} />
            <AddColumn addColumn={addColumn}/>
          </div>
        )}
        </Droppable>
      </DragDropContext>
      {isModalOpen && <CardDetailModal setModalOpen={setModalOpen} card={cardDetail} />}
      {/* <div className="board">
        <AddColumn />
      </div> */}
    </section>
  )
};
export default Columns;