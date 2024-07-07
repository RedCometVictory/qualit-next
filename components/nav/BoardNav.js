import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useLocation } from "react-router-dom";
import { useRouter } from 'next/router';
import { FaChevronCircleLeft } from 'react-icons/fa';
import ButtonUI from "../UI/ButtonUI";
import SideMenu from '../SideMenu';
import { unsplashTheme } from '@/redux/features/theme/themeSlice';
import { sendStatusCode } from 'next/dist/server/api-utils';

const BoardNav = ({buttonText, setButtonText}) => {
  const dispatch = useDispatch();
  const { asPath, pathname, query } = useRouter();
  const { board } = useSelector(state => state.board);
  const { drawer } = useSelector(state => state.theme);

  let splitPath = asPath.split('/');
  // remove strings that return false (meaning they are empty)
  splitPath = splitPath.filter(e => e);
  let paramPath = splitPath[1];

  splitPath = splitPath[1].charAt(0).toUpperCase() + splitPath[1].slice(1);

  const [expanded, setExpanded] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // this is to expand the unsplash side menu used for selecting new background themes
  const toggleDrawer = (value) => {
    setExpanded(!expanded);
    // dispatch(unsplashTheme(value));
  };

  return (<>
    <section className="boardNav">
      <div className="boardNav__pathname">
        <h2>
          {splitPath.length >= 1 ? (
            `${splitPath} - ${board.name}`
          ) : (
            <>Unknown Title of Board</>
          )}
        </h2>
      </div>
      <header className="boardNav__header">
        <ButtonUI
          className='boardNav__btn'
          // href={`${paramPath === 'boards' ? '/my/boards/new-board' : '/m/profile'}`}
          variant='contained'
        >
          {'Save'}
        </ButtonUI>
        <FaChevronCircleLeft
          aria-expanded={expanded}
          aria-label="show-more"
          onClick={(e) => toggleDrawer(e)}
          className={`boardNav__btn chev-icon ${expanded ? `icon-rotate` : ``}`}
        />
      </header>
    </section>
  </>)
};
export default BoardNav;