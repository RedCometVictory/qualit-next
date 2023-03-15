import { useState } from 'react';
import MainNav from '../nav/MainNav';
import MobileNav from '../nav/MobileNav';

const DetailLayout = ({children}) => {
  const [openAsideMenu, setOpenAsideMenu] = useState(false);
  const openMenuHandler = () => {
    setOpenAsideMenu(openAsideMenu => !openAsideMenu);
  };
  return (<>
    <main className='container'>
      <MainNav openMenu={openAsideMenu} setOpenMenu={openMenuHandler} />
      {children}
      <MobileNav openMenu={openAsideMenu} setOpenMenu={openMenuHandler} />
    </main>
  </>);
};
export default DetailLayout;