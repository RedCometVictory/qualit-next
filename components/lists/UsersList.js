import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { TiUser } from "react-icons/ti";
import { Box, Drawer, Divider, Input, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { getUsersAdmin } from '@/redux/features/user/userSlice';
import PaperUI from '../UI/PaperUI';
import Spinner from '../Spinner';

const UsersList = ({projectId}) => {
  const dispatch = useDispatch();
  // const users = useSelector(state => state.user);
  // console.log("0000000000000000users000000000000000000")
  // console.log(users)
  const { assignedUsers, unassignedUsers } = useSelector(state => state.user);
  console.log(assignedUsers)
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
        <Typography variant="body2" className='list'>
          Hello
        </Typography>
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
                      passHref
                      href={`/users/${assigned.id}`}
                    >
                      {`${assigned.f_name} ${assigned.l_name}`}
                    </Typography>
                  </span>
                }
                // secondary={<ListItemDetail ticket={ticket}/>}
              >
              </ListItemText>
            </ListItem>
          ))}
        </PaperUI>
      </PaperUI>
    </section>
  )
};
export default UsersList;