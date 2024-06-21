import React from 'react';
import { FaPlus } from 'react-icons/fa';
import ButtonUI from '../UI/ButtonUI';
import { useSelector } from 'react-redux';

const AddColumn = ({ addColumnToBoard }) => {
  const columnRequest = useSelector(state => state.column.isRequested);
  
  return (
    <div className="board__new-lane">
      <ButtonUI
        className="board__add-column-btn"
        variant="contained"
        onClick={(e) => addColumnToBoard(e)}
        disabled={columnRequest}
      >
        <FaPlus className='board__add-column-icon'/>
        <h3 className="board__new-header">
          {columnRequest ? `Creating Column` : `Add New Lane`}
        </h3>
      </ButtonUI>
    </div>
  )
};
export default AddColumn;