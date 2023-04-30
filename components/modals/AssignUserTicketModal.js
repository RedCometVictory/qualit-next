import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegWindowClose } from "react-icons/fa";
import { TiUser } from "react-icons/ti";
import { Typography, ListItem, ListItemText, ListItemIcon } from "@mui/material";
import { getUsersAdmin } from "@/redux/features/user/userSlice";
import { updateDevAssignedTicket } from "@/redux/features/project/projectSlice";
import ButtonUI from "../UI/ButtonUI";
import PaperUI from "../UI/PaperUI";

const AssignUserTicketModal = ({ticketId, projectId, setAssignModal}) => {
  const dispatch = useDispatch();
  const { assignedUsers } = useSelector(state => state.user);
  const [developer, setDeveloper] = useState('');


  useEffect(() => {
    if (!assignedUsers || assignedUsers.length === 0) dispatch(getUsersAdmin({projectId}));
  }, []);

  const closeModalHandler = () => {
    setAssignModal(false);
  };

  const devAssignmentHandler = (value) => {
    setDeveloper(developer = value);
  };
  
  const assignNewDevHandler = () => {
    dispatch(updateDevAssignedTicket({ticketId, developer}));
    closeModalHandler();
  }

  const assignedProjectDevelopers = assignedUsers.filter(item => item.role === "Developer");

  return (
    <PaperUI className="modal paper ticket" elevation={3} variant="elevation">
      <div className="modal__header">
        <h3 className="title">Manage Assigned User</h3>
        <div className="close" onClick={closeModalHandler}><FaRegWindowClose/></div>
      </div>
      <div className="modal__content ticket-assign">
        <span className="desc">Assign a new developer to this ticket. Developer is a member of this project.</span>
        <section className="modal__users items">
          <PaperUI className="paper users-list">
            {assignedProjectDevelopers.map((dev, index) => (
              <ListItem
                className={`users-list-item`}
                key={dev.id}
              >
                <ListItemIcon>
                  <TiUser />
                  <span className="">
                    <span className="">[D]</span>
                  </span>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <span className='user-name'>
                      <Typography
                        variant='body2'
                        className={`${dev.id === developer ? 'active' : ''}`}
                        onClick={e => devAssignmentHandler(dev.id)}
                      >
                        {`${dev.l_name}, ${dev.f_name}`}
                      </Typography>
                    </span>
                  }
                >
                </ListItemText>
              </ListItem>
            ))}
          </PaperUI>
          <div className="modal__actions">
            <ButtonUI
              variant="outlined"
              onClick={e => assignNewDevHandler(e)}
              disabled={!developer}
              sx={{ color: 'primary.main' }}
            >
              Submit
            </ButtonUI>
          </div>
        </section>
      </div>
      <div className="modal__footer"></div>
    </PaperUI>
  )
};
export default AssignUserTicketModal;