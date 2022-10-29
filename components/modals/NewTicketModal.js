import { FaRegWindowClose } from "react-icons/fa";
import TicketForm from "../details/TicketForm";

const NewTicketModal = ({setTicketModal}) => {
  const closeModalHandler = () => {
    setTicketModal(false);
  };
  return (
    <div className="modal">
      <div className="modal__header">
        <h3 className="title">New Ticket</h3>
        <div className="close" onClick={closeModalHandler}><FaRegWindowClose/></div>
      </div>
      <div className="modal__content">
        <TicketForm />
      </div>
      <div className="modal__footer"></div>
    </div>
  )
};
export default NewTicketModal;