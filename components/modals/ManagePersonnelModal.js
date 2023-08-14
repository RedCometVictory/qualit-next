import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaRegWindowClose } from "react-icons/fa";
import { TiUser } from "react-icons/ti";
import Spinner from "../Spinner";
import { updateAssignmentListsAdmin, updateUnassignmentListsAdmin, updateAndSaveProjectPersonnelList } from "@/redux/features/user/userSlice";
import { ListItem, ListItemText, ListItemIcon, Typography } from "@mui/material";
import ButtonUI from "../UI/ButtonUI";
import PaperUI from "../UI/PaperUI";

const ManagePersonnelModal = ({projectId, setManagePersonnelModal, assignedUsers, unassignedUsers}) => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userListChanged, setUserListChanged] = useState(true);

  const closeModalHandler = () => {
    setManagePersonnelModal(false);
  };

  const selectUserHandler = (value) => {
    if (selectedUser.find(indx => indx === value)) {
      let userArr = selectedUser.filter(indx => indx !== value);
      setSelectedUser(selectedUser = userArr);
      return;
    };
    setSelectedUser(selectedUser = [...selectedUser, value]);
  };

  const assigningUserToProjectHandler = () => {
    if (selectedUser.length === 0 || !selectedUser) return;
    setLoadingUsers(true);
    let unassignedArr = unassignedUsers;
    let updatedUnassignedArr;
    let updatedAssignedArr;

    updatedAssignedArr = unassignedArr.filter(indx => selectedUser.includes(indx.id));
    updatedUnassignedArr = unassignedArr.filter(indx => !selectedUser.includes(indx.id));

    dispatch(updateAssignmentListsAdmin({projectId, updatedAssignedArr, updatedUnassignedArr}));

    setUserListChanged(userListChanged = false);
    setLoadingUsers(false);

    unassignedArr = undefined;
    updatedUnassignedArr = undefined;
    updatedAssignedArr = undefined;
    setSelectedUser(selectedUser = []);
  };

  const unassigningUserFromProjectHandler = () => {
    if (selectedUser.length === 0 || !selectedUser) return;
    setLoadingUsers(false);
    let assignedArr = assignedUsers;

    let updatedUnassignedArr;
    let updatedAssignedArr;
    updatedAssignedArr = assignedArr.filter(indx => !selectedUser.includes(indx.id));
    updatedUnassignedArr = assignedArr.filter(indx => selectedUser.includes(indx.id));

    dispatch(updateUnassignmentListsAdmin({projectId, updatedAssignedArr, updatedUnassignedArr}));
    setUserListChanged(userListChanged = false);
    setLoadingUsers(false);
    assignedArr = undefined;
    updatedUnassignedArr = undefined;
    updatedAssignedArr = undefined;
    setSelectedUser(selectedUser = []);
  };

  const updateAndSavePersonnelHandler = (e) => {
    dispatch(updateAndSaveProjectPersonnelList({projectId, assignedUsers, unassignedUsers}));
    setUserListChanged(userListChanged = true);
    closeModalHandler();
  };

  const AssignedList = () => {
    return (<>
      <section className="modal__users">
        <Typography variant="body1" className="modal__users list-header">
          <Typography variant="h4" className="">Assigned Personnel</Typography>
        </Typography>
        <PaperUI className="paper users-list">
          {assignedUsers.map((assigned, index) => (
            <ListItem
              className={`users-list-item`}
              key={index}
            >
              <ListItemIcon>
                <TiUser />
                <span className="">
                  {assigned.role === "Admin" ? (
                    <span className="">[A]</span>
                  ) : assigned.role === "Project Manager" ? (
                    <span className="">[PM]</span>
                  ) : (
                    <span className="">[D]</span>
                  )}
                </span>
              </ListItemIcon>
              <ListItemText
                primary={
                  <span className='user-name'>
                    <Typography
                      variant='body2'
                      className={`${selectedUser.find(item => item === assigned.id) ? 'active' : ''}`}
                      onClick={e => selectUserHandler(assigned.id)}
                    >
                      {`${assigned.l_name}, ${assigned.f_name}`}
                    </Typography>
                  </span>
                }
              >
              </ListItemText>
            </ListItem>
          ))}
        </PaperUI>
        <div className="modal__users btn-container">
          <ButtonUI
            className="btn-assign"
            variant="outlined"
            sx={{ color: 'primary.main' }}
            onClick={e => assigningUserToProjectHandler()}
          >
            Assign
          </ButtonUI>
        </div>
      </section>
    </>)
  };

  const UnassignedList = () => {
    return (<>
      <section className="modal__users">
        <Typography variant="body1" className="modal__users list-header">
          {/* <Typography variant="h4" className="">Assigned Personnel</Typography> */}
          <Typography variant="h4" className="">Unassigned Personnel</Typography>
        </Typography>
        <PaperUI className="paper users-list">
          {unassignedUsers.map((unassigned, index) => (
            <ListItem
              className={`users-list-item`}
              key={index}
            >
              <ListItemIcon>
                <TiUser />
                <span className="">
                  {unassigned.role === "Admin" ? (
                    <span className="">[A]</span>
                  ) : unassigned.role === "Project Manager" ? (
                    <span className="">[PM]</span>
                  ) : (
                    <span className="">[D]</span>
                  )}
                </span>
              </ListItemIcon>
              <ListItemText
                primary={
                  <span className='user-name'>
                    <Typography
                      variant='body2'
                      className={`${selectedUser.find(item => item === unassigned.id) ? 'active' : ''}`}
                      onClick={e => selectUserHandler(unassigned.id)}
                    >
                      {`${unassigned.l_name}, ${unassigned.f_name}`}
                    </Typography>
                  </span>
                }
              >
              </ListItemText>
            </ListItem>
          ))}
        </PaperUI>
        <div className="modal__users btn-container">
          <ButtonUI
            className="btn-unassign"
            variant="outlined"
            sx={{ color: 'primary.main' }}
            onClick={e => unassigningUserFromProjectHandler()}
          >
            Unassign
          </ButtonUI>
        </div>
      </section>
    </>)
  };  

  return (<>
    <PaperUI className="modal paper ticket" elevation={3} variant="elevation">
      <div className="modal__header">
        <h3 className="title">Manage Personnel Assignments</h3>
        <div className="close" onClick={closeModalHandler}><FaRegWindowClose/></div>
      </div>
      <div className="modal__content">
      <Typography variant="body2" className="modal__user sub-desc">
        Click on a name to select then choose to assign / unassign from this Project. Then save your changes by choosing &quot;Save&quot;.
      </Typography>
        {/* <Typography variant="body1" className="modal__users list-header">
          <Typography variant="h4" className="">Assigned Personnel</Typography>
          <Typography variant="h4" className="">Unassigned Personnel</Typography>
        </Typography> */}
        <section className="modal__users lists-container">
          {loadingUsers ? (
            <Spinner/>
          ) : (<>
            <AssignedList />
            <UnassignedList />
          </>)}
        </section>
        {/* <div className="modal__users btn-container">
          <ButtonUI
            variant="outlined"
            sx={{ color: 'primary.main' }}
            onClick={e => unassigningUserFromProjectHandler()}
          >
            Unassign
          </ButtonUI>
          <ButtonUI
            variant="outlined"
            sx={{ color: 'primary.main' }}
            onClick={e => assigningUserToProjectHandler()}
          >
            Assign
          </ButtonUI>
        </div> */}
        <div className="modal__users btn-container">
          <ButtonUI
            variant="contained"
            disabled={userListChanged}
            onClick={e => updateAndSavePersonnelHandler(e)}
          >
            Save Changes
          </ButtonUI>
        </div>
      </div>
      <div className="modal__footer"></div>
    </PaperUI>
  </>)
};
export default ManagePersonnelModal;





/* ORIGINAL
import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaRegWindowClose } from "react-icons/fa";
import { TiUser } from "react-icons/ti";
import Spinner from "../Spinner";
import { updateAssignmentListsAdmin, updateUnassignmentListsAdmin, updateAndSaveProjectPersonnelList } from "@/redux/features/user/userSlice";
import { ListItem, ListItemText, ListItemIcon, Typography } from "@mui/material";
import ButtonUI from "../UI/ButtonUI";
import PaperUI from "../UI/PaperUI";

const ManagePersonnelModal = ({projectId, setManagePersonnelModal, assignedUsers, unassignedUsers}) => {
  const dispatch = useDispatch();
  const [selectedUser, setSelectedUser] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userListChanged, setUserListChanged] = useState(true);

  const closeModalHandler = () => {
    setManagePersonnelModal(false);
  };

  const selectUserHandler = (value) => {
    if (selectedUser.find(indx => indx === value)) {
      let userArr = selectedUser.filter(indx => indx !== value);
      setSelectedUser(selectedUser = userArr);
      return;
    };
    setSelectedUser(selectedUser = [...selectedUser, value]);
  };

  const assigningUserToProjectHandler = () => {
    if (selectedUser.length === 0 || !selectedUser) return;
    setLoadingUsers(true);
    let unassignedArr = unassignedUsers;
    let updatedUnassignedArr;
    let updatedAssignedArr;

    updatedAssignedArr = unassignedArr.filter(indx => selectedUser.includes(indx.id));
    updatedUnassignedArr = unassignedArr.filter(indx => !selectedUser.includes(indx.id));

    dispatch(updateAssignmentListsAdmin({projectId, updatedAssignedArr, updatedUnassignedArr}));

    setUserListChanged(userListChanged = false);
    setLoadingUsers(false);

    unassignedArr = undefined;
    updatedUnassignedArr = undefined;
    updatedAssignedArr = undefined;
    setSelectedUser(selectedUser = []);
  };

  const unassigningUserFromProjectHandler = () => {
    if (selectedUser.length === 0 || !selectedUser) return;
    setLoadingUsers(false);
    let assignedArr = assignedUsers;

    let updatedUnassignedArr;
    let updatedAssignedArr;
    updatedAssignedArr = assignedArr.filter(indx => !selectedUser.includes(indx.id));
    updatedUnassignedArr = assignedArr.filter(indx => selectedUser.includes(indx.id));

    dispatch(updateUnassignmentListsAdmin({projectId, updatedAssignedArr, updatedUnassignedArr}));
    setUserListChanged(userListChanged = false);
    setLoadingUsers(false);
    assignedArr = undefined;
    updatedUnassignedArr = undefined;
    updatedAssignedArr = undefined;
    setSelectedUser(selectedUser = []);
  };

  const updateAndSavePersonnelHandler = (e) => {
    dispatch(updateAndSaveProjectPersonnelList({projectId, assignedUsers, unassignedUsers}));
    setUserListChanged(userListChanged = true);
    closeModalHandler();
  };

  const AssignedList = () => {
    return (<>
      <section className="modal__users">
        <PaperUI className="paper users-list">
          {assignedUsers.map((assigned, index) => (
            <ListItem
              className={`users-list-item`}
              key={index}
            >
              <ListItemIcon>
                <TiUser />
                <span className="">
                  {assigned.role === "Admin" ? (
                    <span className="">[A]</span>
                  ) : assigned.role === "Project Manager" ? (
                    <span className="">[PM]</span>
                  ) : (
                    <span className="">[D]</span>
                  )}
                </span>
              </ListItemIcon>
              <ListItemText
                primary={
                  <span className='user-name'>
                    <Typography
                      variant='body2'
                      className={`${selectedUser.find(item => item === assigned.id) ? 'active' : ''}`}
                      onClick={e => selectUserHandler(assigned.id)}
                    >
                      {`${assigned.l_name}, ${assigned.f_name}`}
                    </Typography>
                  </span>
                }
              >
              </ListItemText>
            </ListItem>
          ))}
        </PaperUI>
      </section>
    </>)
  };

  const UnassignedList = () => {
    return (<>
      <section className="modal__users">
        <PaperUI className="paper users-list">
          {unassignedUsers.map((unassigned, index) => (
            <ListItem
              className={`users-list-item`}
              key={index}
            >
              <ListItemIcon>
                <TiUser />
                <span className="">
                  {unassigned.role === "Admin" ? (
                    <span className="">[A]</span>
                  ) : unassigned.role === "Project Manager" ? (
                    <span className="">[PM]</span>
                  ) : (
                    <span className="">[D]</span>
                  )}
                </span>
              </ListItemIcon>
              <ListItemText
                primary={
                  <span className='user-name'>
                    <Typography
                      variant='body2'
                      className={`${selectedUser.find(item => item === unassigned.id) ? 'active' : ''}`}
                      onClick={e => selectUserHandler(unassigned.id)}
                    >
                      {`${unassigned.l_name}, ${unassigned.f_name}`}
                    </Typography>
                  </span>
                }
              >
              </ListItemText>
            </ListItem>
          ))}
        </PaperUI>
      </section>
    </>)
  };  

  return (<>
    <PaperUI className="modal paper ticket" elevation={3} variant="elevation">
      <div className="modal__header">
        <h3 className="title">Manage Personnel Assignments</h3>
        <div className="close" onClick={closeModalHandler}><FaRegWindowClose/></div>
      </div>
      <div className="modal__content">
      <Typography variant="body2" className="modal__user sub-desc">
        Click on a name to select then choose to assign / unassign from this Project. Then save your changes by choosing &quot;Save&quot;.
      </Typography>
        <Typography variant="body1" className="modal__users list-header">
          <Typography variant="h4" className="">Assigned Personnel</Typography>
          <Typography variant="h4" className="">Unassigned Personnel</Typography>
        </Typography>
        <section className="modal__users lists-container">
          {loadingUsers ? (
            <Spinner/>
          ) : (<>
            <AssignedList />
            <UnassignedList />
          </>)}
        </section>
        <div className="modal__users btn-container">
          <ButtonUI
            variant="outlined"
            sx={{ color: 'primary.main' }}
            onClick={e => unassigningUserFromProjectHandler()}
          >
            Unassign
          </ButtonUI>
          <ButtonUI
            variant="outlined"
            sx={{ color: 'primary.main' }}
            onClick={e => assigningUserToProjectHandler()}
          >
            Assign
          </ButtonUI>
        </div>
        <div className="modal__users btn-container">
          <ButtonUI
            variant="contained"
            disabled={userListChanged}
            onClick={e => updateAndSavePersonnelHandler(e)}
          >
            Save Changes
          </ButtonUI>
        </div>
      </div>
      <div className="modal__footer"></div>
    </PaperUI>
  </>)
};
export default ManagePersonnelModal;
*/