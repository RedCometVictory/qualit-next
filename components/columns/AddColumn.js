import React from 'react';
import { FaPlus } from 'react-icons/fa';
import ButtonUI from '../UI/ButtonUI';

const AddColumn = ({ addColumn }) => {
  return (
    <div className="board__new-lane">
      <ButtonUI
        className="board__add-column-btn"
        variant="contained"
        onClick={(e) => addColumn(e)}
      >
        <FaPlus className='icon'/>
        <h3 className="board__new-header">
          Add New Lane
        </h3>
      </ButtonUI>
    </div>
  )
};
export default AddColumn;