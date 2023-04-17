import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Typography } from '@mui/material';
import { getUsersAdmin } from '@/redux/features/user/userSlice';
import PaperUI from '../UI/PaperUI';
import Spinner from '../Spinner';

const UsersList = ({projectId}) => {
  const dispatch = useDispatch();

  useEffect(() => {
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
          
        </Typography>
        <PaperUI className="paper users-list">

        </PaperUI>
      </PaperUI>
    </section>
  )
};
export default UsersList;