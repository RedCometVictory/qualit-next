import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from "react-router-dom";
import { useRouter } from 'next/router';
import { FaChevronCircleLeft } from 'react-icons/fa';
// import { IconButton, styled } from "@mui/material";
import ButtonUI from "../UI/ButtonUI";
// import SideMenu from './SideMenu';
import { unsplashTheme } from '@/redux/features/theme/themeSlice';

const MiniNav = () => {
  const { asPath, pathname, query } = useRouter();
  console.log("asPath");
  console.log(asPath);
  let splitPath = asPath.split('/');
  // remove strings that return false (meaning they are empty)
  splitPath = splitPath.filter(e => e);
  let paramPath = splitPath[1];
  console.log("----------")
  console.log(splitPath);
  splitPath = splitPath[1].charAt(0).toUpperCase() + splitPath[1].slice(1);
  
  console.log("----------")
  console.log(splitPath);
  console.log("********")
  console.log(paramPath)
  console.log("----------")
  console.log("pathname");
  console.log(pathname);
  // pathname.
  console.log("query");
  console.log(query);
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
    
  const toggleDrawer = (value) => {
    setExpanded(!expanded);
    dispatch(unsplashTheme(value));
  };
  
  return (
    <section className="miniNav">
      <div className="miniNav__pathname">
        <h2>{splitPath}</h2>
      </div>
      <header className="miniNav__header">
        <ButtonUI
          className='miniNav__btn'
          href={`${paramPath === 'profile' ? '/' : '/m/profile'}`}
          variant='contained'
        >
          {paramPath === 'profile' ? 'Home' : 'Profile'}
        </ButtonUI>
        <ButtonUI
          className='miniNav__btn'
          href={`${paramPath === 'boards' ? '/' : '/m/boards'}`}
          variant='contained'
        >
          {paramPath === "boards" ? 'Home' : 'Boards'}
        </ButtonUI>
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