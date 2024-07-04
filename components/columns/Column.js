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
// from slice: delete, fetch and update columns

// column is all details of column, id is the id of the column
const Column = ({ showCardDetail, setModalOpen, column, index, id, cards }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { id: boardId } = router.query;
  const [editArea, setEditArea] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [showColMenu, setShowColMenu] = useState(false);
  const [columnName, setColumnName] = useState(column.name);
  const { board } = useSelector(state => state.board);
  const { user } = useSelector(state => state.user);
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
      // updateColumnNameHandler(e.target.value);
      updateColumnNameHandler();
    }
  };

  const addCardHandler = async (columnIdValue) => {
    // check via column id if any cards have a matching column id
    console.log("00000000000000000000000000000")
    console.log("00000000000000000000000000000")
    console.log("adding card to column")
    console.log("cards from card slice")
    console.log(cardsFromCardSlice)
    const filteredCards = cardsFromCardSlice.filter((card) => card.column_id === columnIdValue);
    console.log("filteredCards")
    console.log(filteredCards)
    
    let sequence = 1;
    
    // if cards match id, they belong to this column. Thus if any exist... change value of the sequence
    if (filteredCards.length > 0) {
      console.log("--- for loop ---")
      // so if length is 9 (then the max / last value is index [8]), the index is length of 9 - 1 = [8] as the first value is the index of 0 the last is 8 in this instance
      // each value in the array is a card object, one of the values that each object shares is "sequence". thus [].value syntax accesses the sequence property value of the object in the indicated index
      // * if there is one value in the array the max value is [0], thus length - 1 = 0. set the current sequence value (current value + 1). Here we are always editing the sequence value of the last value in the array.
      sequence = filteredCards[filteredCards.length - 1].sequence + 1;
      console.log("--- for loop end ---")
    }
    
    let formData = {
      title: "Add Title",
      description: '',
      priority: '',
      type: '',
      sequence
    };

    console.log("formData")
    console.log(formData)
    
    console.log("000000000000000*END*00000000000000")
    console.log("000000000000000*END*00009000000000")
    await dispatch(addCard({boardId, columnId: column.id, formData}));
    await dispatch(fetchCards({boardId}));
  };

  const updateColumnTitleHandler = (e) => {
    setColumnName(e.target.value);
    // only use this func if ssaving to localstorage
    // updateColumnHandler(e.target.value);
  };

  const deleteColumnHandler = async () => {
    await dispatch(deleteColumn({boardId, columnId: id})); // id of column
    await dispatch(fetchColumns({boardId}));
  };

  // use this function only if saving column name value to localstorage. I saving to backend, then disable this func
  // const updateColumnHandler = useCallback(
  //   debounce((value) => updateColumnNameHandler(value), 800),
  //   []
  // );

  const updateColumnNameHandler = async (value) => {
    const formData = {
      // columnName: value,
      // columnId: column._id
      // columnId: column._id,
      name: columnName
      // name: value
    };


    await dispatch(updateColumn({boardId, columnId: id,formData}));
  };

  const openColEditHandler = () => {
    // open input to edit col name and close the options menu
    setEditArea(true);
    // setShowColMenu(false);
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
          variant="outlined"
          required
        />
      )
    }

    return (
      <h6 {...draggableProps}>
        <div>
          <GrDrag className="column__drag-icon"/> {columnName + column.sequence}
        </div>
      </h6>
    );
  };

  const columnHeader = (dragHandleProps = null) => {
    return (<>
      {/* <h2 className="column__title">{loadColumnTitle(dragHandleProps)}</h2> */}
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
          // anchorEl={showColMenu}
          anchorEl={anchorEl}
          // open={showColMenu}
          open={Boolean(anchorEl)}
          // onClose={closeColMenuHandler}
          onClose={menuCloseHandler}
        >
          <MenuList>
            <MenuItem
              // onClick={() => setEditArea(!editArea)}
              onClick={openColEditHandler}
            >
              <FaRegEdit />
              <ListItemText inset>Edit</ListItemText>
            </MenuItem>
            {/* <MenuItem>
              <ListItemText inset>1.15</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemText inset>Double</ListItemText>
            </MenuItem>
            <MenuItem>
              <ListItemIcon>
                <Check />
              </ListItemIcon>
              Custom: 1.2
            </MenuItem> */}
            <Divider />
            <MenuItem onClick={deleteColumnHandler}>
              <AiOutlineDelete />
              <ListItemText inset>Delete</ListItemText>
            </MenuItem>
            {/* edit for more options in the future */}
            {/* <MenuItem>
              <ListItemText>Add space after paragraph</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem>
              <ListItemText>Custom spacing...</ListItemText>
            </MenuItem> */}
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
          // {...provided.dragHandleProps}
        >
          <div
            className="column__header"
          >
            {/* <h3></h3> */}
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
                  // {...provided.dragHandleProps}
                >
                  <Cards
                    key={index}
                    className="card"
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
                // color="secondary"
                variant="outlined"
                // variant="contained"
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