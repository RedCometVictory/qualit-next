import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from "react-router-dom";
import { useRouter } from 'next/router';
import { FaChevronCircleLeft } from 'react-icons/fa';
// import { IconButton, styled } from "@mui/material";
import ButtonUI from "../UI/ButtonUI";
// import SideMenu from './SideMenu';
// import { getBoard } from '@/redux/features/board/boardSlice';
import { unsplashTheme } from '@/redux/features/theme/themeSlice';

const MiniNav = ({setAddBoardModal}) => {
  const { asPath, pathname, query } = useRouter();
  const { board } = useSelector(state => state.board);
  let splitPath = asPath.split('/');
  // remove strings that return false (meaning they are empty)
  splitPath = splitPath.filter(e => e);
  let paramPath = splitPath[1];
  splitPath = splitPath[1].charAt(0).toUpperCase() + splitPath[1].slice(1);

  const [expanded, setExpanded] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const dispatch = useDispatch();
  // const { drawer } = useSelector(state => state.theme);

  // const { pathname } = useLocation();
  // const pathName = true;
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }
  const openCreateBoardModal = () => {
    setAddBoardModal(true);
  };
  const toggleDrawer = (value) => {
    setExpanded(!expanded);
    dispatch(unsplashTheme(value));
  };

  return (
    <section className="miniNav">
      <div className="miniNav__pathname">
        <h2>
          {splitPath.length >= 1 ? (
            splitPath
          ) : (
            <>Unknown Title of Board</>
          )}
        </h2>
      </div>
      <header className="miniNav__header">
        <ButtonUI
          className='miniNav__btn'
          // href={`${paramPath === 'boards' ? '/my/boards/new-board' : '/m/profile'}`}
          variant='contained'
          onClick={() => openCreateBoardModal()}
        >
          {paramPath === 'boards' ? 'Create Board' : 'Profile'}
        </ButtonUI>
        {/* <ButtonUI
          className='miniNav__btn'
          href={`${paramPath === 'profile' ? '/' : '/m/profile'}`}
          variant='contained'
        >
          {paramPath === 'profile' ? 'Home' : 'Profile'}
        </ButtonUI> */}
        {/* <ButtonUI
          className='miniNav__btn'
          href={`${paramPath === 'boards' ? '/my/boards/new-board' : '/m/profile'}`}
          variant='contained'
        >
          {paramPath === 'boards' ? 'Create Board' : 'Profile'}
        </ButtonUI>
        <ButtonUI
          className='miniNav__btn'
          href={`${paramPath === 'boards' ? '/' : '/my/boards'}`}
          variant='contained'
        >
          {paramPath === "boards" ? 'Dashboard' : 'Boards'}
        </ButtonUI> */}
        <FaChevronCircleLeft
          aria-expanded={expanded}
          aria-label="show-more"
          onClick={() => toggleDrawer(true)}
          className="miniNav__btn chev-icon"
        />
      </header>
    </section>
  )
};
export default MiniNav;