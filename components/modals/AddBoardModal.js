import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { TextareaAutosize } from "@mui/material";
import { createBoard } from '@/redux/features/board/boardSlice';
import PaperUI from '../UI/PaperUI';
import ButtonUI from "../UI/ButtonUI";

const AddBoardModal = ({setAddBoardModal}) => {
  // let router = useRouter();
  // let ticketID = router.query.ticketId;
  const dispatch = useDispatch();
  const [isSubmitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "" });
  
  const { name } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModalHandler = () => {
    setAddBoardModal(false);
  };

  const submitNewBoardHandler = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("88888 formData 88888")
    console.log(formData)
    await dispatch(createBoard(formData));
    setSubmitted(false);
    setAddBoardModal(false);
  };

  return (
    <PaperUI className="modal comment">
      <div className="modal__header">
        <h3 className="title">
          Create Board
        </h3>
      </div>
      <div className="modal__content comment">
        <form onSubmit={submitNewBoardHandler}>
          <PaperUI className="text-area-paper">
            <TextareaAutosize
              className='text-area'
              maxRows={6}
              minRows={3}
              placeholder="Give name to board."
              name="name"
              value={name}
              maxLength={320}
              onChange={onChange}
              style={{ width: `100%`, resize: `none`, backgroundColor: `var(--primary-color)`, border: `1px solid rgba(255, 255, 255, 0.12)`, borderRadius: `4px`, color: `var(--body-text)`, fontFamily: 'inherit', padding: `0.75rem 0.75rem`, outline: `none` }}
              required
            />
          </PaperUI>
          <div className="modal__actions comment">
            <div className="action-btns comment">
              <ButtonUI variant="contained" type="submit">
                {isSubmitted ? "Submitted" : "Submit"}
              </ButtonUI>
              <ButtonUI
                variant="outlined"
                // sx={{ color: 'primary.contrastText' }}
                sx={{ color: 'primary.main' }}
                onClick={() => closeModalHandler()}
              >
                Cancel
              </ButtonUI>
            </div>
          </div>
        </form>
      </div>
      <div className="modal__footer"></div>
    </PaperUI>
  )
};
export default AddBoardModal;