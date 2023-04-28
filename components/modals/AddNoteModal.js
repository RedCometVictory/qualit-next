import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { FaFileUpload } from "react-icons/fa";
import { TextareaAutosize } from "@mui/material";
import { createTicketNote} from '@/redux/features/project/projectSlice';
import PaperUI from '../UI/PaperUI';
import ButtonUI from "../UI/ButtonUI";

const AddNoteModal = ({setAddNoteModal}) => {
  let router = useRouter();
  let ticketID = router.query.ticketId;
  const dispatch = useDispatch();
  const [isSubmitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ note: "" });
  
  const { note } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const closeModalHandler = () => {
    setAddNoteModal(false);
  };

  const submitNewNoteHandler = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    console.log("note")
    console.log(note)
    await dispatch(createTicketNote({ticket_id: ticketID, formData}));
    setSubmitted(false);
    setAddNoteModal(false);
  };

  return (
    <PaperUI className="modal comment">
      <div className="modal__header">
        <h3 className="title">
          Add Note
        </h3>
      </div>
      <div className="modal__content comment">
        <form onSubmit={submitNewNoteHandler}>
          <PaperUI className="text-area-paper">
            <TextareaAutosize
              className='text-area'
              maxRows={6}
              minRows={3}
              placeholder="Add note."
              name="note"
              value={note}
              onChange={onChange}
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
export default AddNoteModal;