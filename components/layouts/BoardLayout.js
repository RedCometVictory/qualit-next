// import MainNav from '../nav/MainNav';
// import MiniNav from '../nav/MiniNav';

// const BoardLayout = ({children}) => {
//   return (
//     <main className='container'>
//       <MainNav />
//       <div className="routes routes__container">
//         <MiniNav />
//         {children}
//       </div>
//     </main>
//   );
// };
// export default BoardLayout;

import { useState } from 'react';
import MainNav from '../nav/MainNav';
import MobileNav from '../nav/MobileNav';
import MiniNav from '../nav/MiniNav';

const BoardLayout = ({children}) => {
  const [openAsideMenu, setOpenAsideMenu] = useState(false);
  const openMenuHandler = () => {
    setOpenAsideMenu(openAsideMenu => !openAsideMenu);
  };
  return (<>
    <main className='container'>
      <MainNav openMenu={openAsideMenu} setOpenMenu={openMenuHandler} />
      <div className="routes routes__container">
        <MiniNav />
        {children}
      </div>
      <MobileNav openMenu={openAsideMenu} setOpenMenu={openMenuHandler} />
    </main>
  </>);
};
export default BoardLayout;