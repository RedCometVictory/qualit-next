import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TiUser } from "react-icons/ti";
import { Box, Drawer, Divider, Input, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { getUsersAdmin } from '@/redux/features/user/userSlice';
import ButtonUI from '../UI/ButtonUI';
import PaperUI from '../UI/PaperUI';
import Spinner from '../Spinner';

const UsersList = ({projectId, openModal, assignedUsers, unassignedUsers}) => {
  const dispatch = useDispatch();

  // const { assignedUsers, unassignedUsers } = useSelector(state => state.user);

  useEffect(() => {
    console.log("finding users")
    dispatch(getUsersAdmin({projectId}));
  }, []);

  return (
    <section detail__users container>
      <PaperUI className="paper header-container">
        <Typography variant="h3" className='header'>
          Assigned Personnel
        </Typography>
      </PaperUI>
      <PaperUI className="paper list-container">
        <Typography variant="body2" className='list sub-header'>
          Users assigned to this project.
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
                      // passHref
                      // href={`/users/${assigned.id}`}
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
        <ButtonUI
          variant="outlined"
          sx={{ color: 'primary.main' }}
          onClick={e => openModal(e)}
        >
          Manage Personnel
        </ButtonUI>
      </PaperUI>
    </section>
  )
};
export default UsersList;