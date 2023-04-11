import { FaRegWindowClose } from "react-icons/fa";
import TicketForm from "../details/TicketForm";
import PaperUI from "../UI/PaperUI";

const NewTicketModal = ({setTicketModal}) => {
  const closeModalHandler = () => {
    setTicketModal(false);
  };
  return (<>
    <PaperUI className="modal paper ticket" elevation={3} variant="elevation">
      <div className="modal__header">
        <h3 className="title">New Ticket</h3>
        <div className="close" onClick={closeModalHandler}><FaRegWindowClose/></div>
      </div>
      <div className="modal__content">
        <TicketForm />
      </div>
      <div className="modal__footer"></div>
    </PaperUI>
  </>)
};
export default NewTicketModal;