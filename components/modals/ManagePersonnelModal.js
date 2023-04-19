import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaRegWindowClose } from "react-icons/fa";
import { TiUser } from "react-icons/ti";
import Spinner from "../Spinner";
import { updateAssignmentListsAdmin, updateUnassignmentListsAdmin } from "@/redux/features/user/userSlice";
import { ListItem, ListItemText, ListItemIcon, Typography } from "@mui/material";
import ButtonUI from "../UI/ButtonUI";
import PaperUI from "../UI/PaperUI";

const ManagePersonnelModal = ({projectId, setManagePersonnelModal, assignedUsers, unassignedUsers}) => {
  const dispatch = useDispatch();
  // const [selectedUser, setSelectedUser] = useState("");
  const [selectedUser, setSelectedUser] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  // const [assignedArr, setAssignedArr] = useState(assignedUsers);
  // const [unassignedArr, setUnassignedArr] = useState(unassignedUsers);
  
  // let assignedArr;
  // let unassignedArr;
  // let assignedArr = assignedUsers;
  // let unassignedArr = unassignedUsers;

  // useEffect(() => {
  //   assignedArr = assignedUsers;
  //   unassignedArr = unassignedUsers;
  // }, [dispatch]);

  const closeModalHandler = () => {
    setManagePersonnelModal(false);
  };

  const selectUserHandler = (value) => {
    let userArr;
    if (selectedUser.find(indx => indx === value)) {
      let userArr = selectedUser.filter(indx => indx !== value);
      // setSelectedUser(selectedUser => selectedUser = userArr);
      setSelectedUser(selectedUser = userArr);
      return;
    };
    // setSelectedUser(selectedUser => [...selectedUser, value]);
    setSelectedUser(selectedUser = [...selectedUser, value]);
  };

  const assigningUserToProjectHandler = () => {
    if (selectedUser === [] || !selectedUser) return;
    setLoadingUsers(true);
    // filter through unassigned personnel array using selected user value, if match found remove match from unassigned personnel array and then place that filtered value into the assigned user array - using dispatches
    let assignedArr = assignedUsers;
    let unassignedArr = unassignedUsers;

    console.log("selectedUser")
    console.log(selectedUser)
    console.log("assignedArr")
    console.log(assignedArr)
    console.log("unassignedArr")
    console.log(unassignedArr)
    
    let updatedUnassignedArr;
    let updatedAssignedArr;
    updatedAssignedArr = unassignedArr.filter(indx => selectedUser.includes(indx.id));
    updatedUnassignedArr = unassignedArr.filter(indx => !selectedUser.includes(indx.id));
    console.log("---------- after filter ----------")
    console.log("updatedAssignedArr")
    console.log(updatedAssignedArr)
    console.log("updatedunassignedArr")
    console.log(updatedUnassignedArr)
    dispatch(updateAssignmentListsAdmin({projectId, updatedAssignedArr, updatedUnassignedArr}));
    setLoadingUsers(false);
    assignedArr = undefined;
    unassignedArr = undefined;
    updatedUnassignedArr = undefined;
    updatedAssignedArr = undefined;
    setSelectedUser(selectedUser = []);
  };

  const unassigningUserFromProjectHandler = () => {
    if (selectedUser === [] || !selectedUser) return;
    setLoadingUsers(false);
    let assignedArr = assignedUsers;
    let unassignedArr = unassignedUsers;

    console.log("selectedUser")
    console.log(selectedUser)
    console.log("assignedArr")
    console.log(assignedArr)
    console.log("unassignedArr")
    console.log(unassignedArr)
    
    let updatedUnassignedArr;
    let updatedAssignedArr;
    updatedAssignedArr = assignedArr.filter(indx => !selectedUser.includes(indx.id));
    updatedUnassignedArr = assignedArr.filter(indx => selectedUser.includes(indx.id));
    console.log("---------- after filter ----------")
    console.log("updatedAssignedArr")
    console.log(updatedAssignedArr)
    console.log("updatedunassignedArr")
    console.log(updatedUnassignedArr)
    dispatch(updateUnassignmentListsAdmin({projectId, updatedAssignedArr, updatedUnassignedArr}));
    setLoadingUsers(false);
    assignedArr = undefined;
    unassignedArr = undefined;
    updatedUnassignedArr = undefined;
    updatedAssignedArr = undefined;
    setSelectedUser(selectedUser = []);
  };
  console.log("+++++++++++++++++++++++++")
  console.log("+++++++++++++++++++++++++")
  console.log("+++++++++++++++++++++++++")
  // console.log("assignedArr")
  // console.log(assignedArr)
  // console.log("unassignedArr")
  // console.log(unassignedArr)

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
          <ButtonUI variant="contained" >Save Changes</ButtonUI>
        </div>
      </div>
      <div className="modal__footer"></div>
    </PaperUI>
  </>)
};
export default ManagePersonnelModal;

//   const AssignedList = () => {
//     return (<>
//       <section className="modal__users">
//         <PaperUI className="paper users-list">
//           {assignedUsers.map((assigned, index) => (
//             <ListItem
//               className={`users-list-item`}
//               key={index}
//             >
//               <ListItemIcon>
//                 <TiUser />
//               </ListItemIcon>
//               <ListItemText
//                 primary={
//                   <span className='user-name'>
//                     <Typography
//                       variant='body2'
//                       // passHref
//                       // href={`/users/${assigned.id}`}
//                       onClick={e => selectUserHandler(unassigned.id)}
//                     >
//                       {`${assigned.l_name}, ${assigned.f_name}`}
//                     </Typography>
//                   </span>
//                 }
//               >
//               </ListItemText>
//             </ListItem>
//           ))}
//         </PaperUI>
//       </section>
//     </>)
//   };

//   const UnassignedList = () => {
//     return (<>
//       <section className="modal__users">
//         <PaperUI className="paper users-list">
//           {unassignedUsers.map((unassigned, index) => (
//             <ListItem
//               className={`users-list-item`}
//               key={index}
//             >
//               <ListItemIcon>
//                 <TiUser />
//               </ListItemIcon>
//               <ListItemText
//                 primary={
//                   <span className='user-name'>
//                     <Typography
//                       variant='body2'
//                       // passHref
//                       // href={`/users/${unassigned.id}`}
//                       // className={`option ${orderBy ? 'active' : ''}`}
//                       // className={`${unassignedArr.filter(indx => indx.id === selectedUser) ? 'active' : ''}`}
//                       // className={`${unassigned.id === selectedUser ? 'active' : ''}`}
//                       className={`${selectedUser.find(item => item === unassigned.id) ? 'active' : ''}`}
//                       onClick={e => selectUserHandler(unassigned.id)}
//                     >
//                       {`${unassigned.l_name}, ${unassigned.f_name}`}
//                     </Typography>
//                   </span>
//                 }
//               >
//               </ListItemText>
//             </ListItem>
//           ))}
//         </PaperUI>
//       </section>
//     </>)
//   };  

//   return (<>
//     <PaperUI className="modal paper ticket" elevation={3} variant="elevation">
//       <div className="modal__header">
//         <h3 className="title">Manage Personnel Assignments</h3>
//         <div className="close" onClick={closeModalHandler}><FaRegWindowClose/></div>
//       </div>
//       <div className="modal__content">
//       <Typography variant="body2" className="modal__user sub-desc">
//         Click on a name to select then choose to assign / unassign from this Project. Then save your changes by choosing &quot;Save&quot;.
//       </Typography>
//         <Typography variant="body1" className="modal__users list-header">
//           <Typography variant="h4" className="">Assigned Personnel</Typography>
//           <Typography variant="h4" className="">Unassigned Personnel</Typography>
//         </Typography>
//         <section className="modal__users lists-container">
//           <AssignedList />
//           <UnassignedList />
//         </section>
//         <div className="modal__users btn-container">
//           <ButtonUI
//             variant="outlined"
//             sx={{ color: 'primary.main' }}
//             onClick={e => unassigningUserFromProjectHandler()}
//           >
//             Unassign
//           </ButtonUI>
//           <ButtonUI
//             variant="outlined"
//             sx={{ color: 'primary.main' }}
//             onClick={e => assigningUserToProjectHandler()}
//           >
//             Assign
//           </ButtonUI>
//         </div>
//         <div className="modal__users btn-container">
//           <ButtonUI variant="contained" >Save Changes</ButtonUI>
//         </div>
//       </div>
//       <div className="modal__footer"></div>
//     </PaperUI>
//   </>)
// };