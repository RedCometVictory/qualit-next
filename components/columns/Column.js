import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
// import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { CardActions, Divider, Menu, MenuItem, MenuList, ListItemText, TextField } from '@mui/material';
import { FaPlus, FaRegEdit } from 'react-icons/fa';
import { AiOutlineDelete } from 'react-icons/ai';
import { GrDrag } from 'react-icons/gr';
import { fetchColumns, updateColumn, deleteColumn } from '@/redux/features/column/columnSlice';
import { fetchCards, addCard } from '@/redux/features/card/cardSlice';
import ButtonUI from '../UI/ButtonUI';
import Cards from '../cards/Cards';

// column is all details of column, id is the id of the column
const Column = ({ showCardDetail, setModalOpen, column, index, id, cards }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: boardId } = router.query;
  const [editArea, setEditArea] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showColMenu, setShowColMenu] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const { cards: cardsFromCardSlice, isRequested: cardRequest } = useSelector(state => state.card);

  const sortedCards = cards.sort(
    (cardA, cardB) => cardA.sequence - cardB.sequence
  );

  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      setEditArea(false);
      updateColumnNameHandler(e.target.value);
      // updateColumnHandler();
    }
  };

  const addCardHandler = async (columnIdValue) => {
    // check via column id if any cards have a matching column id
    const filteredCards = cardsFromCardSlice.filter((card) => card.column_id === columnIdValue);
    
    let sequence = 1;
    
    // if cards match id, they belong to this column. Thus if any exist... change value of the sequence
    if (filteredCards.length > 0) {
      sequence = filteredCards[filteredCards.length - 1].sequence + 1;
    }
    
    let formData = {
      title: "Add Title",
      description: '',
      priority: '',
      type: '',
      sequence
    };

    await dispatch(addCard({boardId, columnId: column.id, formData}));
    await dispatch(fetchCards({boardId}));
  };

  const updateColumnTitleHandler = (e) => {
    setColumnName(e.target.value);
  };

  const deleteColumnHandler = async () => {
    await dispatch(deleteColumn({boardId, columnId: id})); // id of column
    await dispatch(fetchColumns({boardId}));
  };

  const updateColumnHandler = useCallback(
    debounce((value) => updateColumnNameHandler(value), 800),
    []
  );

  const updateColumnNameHandler = async (value) => {
    const formData = { name: value };
    await dispatch(updateColumn({boardId, columnId: id, formData}));
  };

  const openColEditHandler = () => {
    // open input to edit col name and close the options menu
    setEditArea(true);
    menuCloseHandler();
  };

  const menuClickHandler = (e) => {
    if (e.currentTarget.value === 'Cancel') {
      setEditArea(false);
      setShowColMenu(false);
      return;
    }
    setShowColMenu(true); // show options menu
    setAnchorEl(e.currentTarget); // anchor menu below button
  };

  const menuCloseHandler = () => {
    setAnchorEl(null);
    setShowColMenu(false);
  };

  // const closeColMenuHandler = () => {
  //   setShowColMenu(false);
  // };

  const loadColumnTitle = (draggableProps) => {
    if (editArea) {
      return (
        <TextField
          className='column__title--form'
          value={columnName}
          onChange={updateColumnTitleHandler}
          // onBlur={() => setEditArea(false)}
          onKeyDown={handleKeyDown}
          sx={{
            alignContent: `center`
          }}
          inputProps={{ maxLength: 18 }}
          variant="outlined"
          required
        />
      )
    }

    return (
      <h6 {...draggableProps}>
        <div>
          {/* <GrDrag className="column__drag-icon"/> {columnName + column.sequence} */}
          <GrDrag className="column__drag-icon"/> {columnName}
        </div>
      </h6>
    );
  };

  const columnHeader = (dragHandleProps = null) => {
    return (<>
      <div className="column__menu">
        <ButtonUI
          variant={"contained"}
          value={editArea ? `Cancel` : `Option`}
          onClick={menuClickHandler}
        >
          {editArea ? `Cancel` : `Option`}
        </ButtonUI>
        <Menu
          className={'column__options-menu'}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={menuCloseHandler}
        >
          <MenuList>
            <MenuItem
              onClick={openColEditHandler}
            >
              <FaRegEdit />
              <ListItemText inset>Edit</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={deleteColumnHandler}>
              <AiOutlineDelete />
              <ListItemText inset>Delete</ListItemText>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    </>);
  };

  return (
    <Draggable draggableId={column.id} index={index} key={column.id}>
      {(provided) => (
        <div className="column__container"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div
            className="column__header"
          >
            <div className="column__header-menu">
              <h2 className="column__title">{loadColumnTitle(provided.dragHandleProps)}</h2>
              {columnHeader()}
            </div>
          </div>
          <div className="column__lane-content">
            <Droppable droppableId={column.id} type="card">
              {(provided) => (
                <div
                  className="column__lane-scroll"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <Cards
                    key={index}
                    variant=''
                    raised='true'
                    cards={sortedCards}
                    showCardDetail={showCardDetail}
                    setModalOpen={setModalOpen}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
          <CardActions className='column__add-card-btn-section'>
              <ButtonUI
                className={"column__add-card-btn"}
                color="primary"
                variant="outlined"
                disabled={cardRequest}
                isLoading={cardRequest}
                onClick={() => addCardHandler(column.id)}
              >
                <FaPlus className='board__add-column-icon'/> Add New Card
              </ButtonUI>
            </CardActions>
        </div>
      )}
    </Draggable>
  )
};
export default Column;