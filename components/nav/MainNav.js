import { useState } from 'react';
import Link from 'next/link';
// import { Link, useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineProject } from 'react-icons/ai';
import { ImTicket, ImExit, ImEnter } from 'react-icons/im';
import { MdDashboard } from 'react-icons/md';
// import { useSelector, useDispatch } from 'react-redux';

import ModeButton from '@/components/ModeButton';
// import ThemePicker from '@/components/theme/ThemePicker';

import Logo from '../UI/Logo';
// TODO:
// Get role from redux state
// based on role (Admin, Project Manager, Submitter, Developer) hide links.
// swap auth links, show pending on logged in or not
const MainNav = () => {
  // const navigate = useNavigate();
  // TODO: retrive the value via redux state, the theme value is derived from the meta component
  // const [theme, setTheme]:string = useState('light');
  const isAuthenticated = true;
  // const isAuthenticated = false;
  const status = {
    roleOne: 'Admin',
    roleTwo: 'Project Manager',
    roleThree: 'Developer'
  }
  let admin = status.roleOne;
  // let admin = status.roleThree;
  let role = "Admin";

  const adminLinks = (
    <li className="nav__link-item">
      <div className="nav__link-group">
        <div className="nav__link-icon">
          <FaPlus />
        </div>
        <Link passHref href="/new-project" className='nav__link'>
          New Project
        </Link>
      </div>
    </li>
  );
  
  const authLinks = (<>
    <li className="nav__link-item">
      <div className="nav__link-group">
        <div className="nav__link-icon">
          <MdDashboard />
        </div>
        <Link
          passHref
          href={"/"}
          className='nav__link'
        >
          <a>Dashboard</a>
        </Link>
      </div>
    </li>
    <li className="nav__link-item">
      <div className="nav__link-group">
        <div className="nav__link-icon">
          <AiOutlineProject />
        </div>
        <Link
          passHref
          href="/my-projects"
          className='nav__link'
        >
          My Projects
        </Link>
      </div>
    </li>
    <li className="nav__link-item">
      <div className="nav__link-group">
        <div className="nav__link-icon">
          <ImTicket />
        </div>
        <Link passHref href="/my-tickets" className='nav__link'>
          My Tickets
        </Link>
      </div>
    </li>
  </>);

  return (
    <header className="nav">
      {/* <ThemePicker /> */}
      <ModeButton />
      <nav className='nav__menu'>
        <Logo />
        <ul className="nav__links">
          {isAuthenticated && authLinks}
          {isAuthenticated && role === admin && adminLinks}
          {isAuthenticated ? (
            <li className="nav__link-item">
              <div className="nav__link-group">
                <div className="nav__link-icon">
                  <ImExit />
                </div>
                <Link
                  passHref
                  href="/logout"
                  className='nav__link'
                >
                  Sign Out
                </Link>
              </div>
            </li>
          ) : (
            <li className="nav__link-item">
              <div className="nav__link-group">
                <div className="nav__link-icon">
                  <ImEnter />
                </div>
                <Link
                  passHref
                  href="/sign-in"
                  className='nav__link'
                >
                  Sign In
                </Link>
              </div>
            </li>
          )}
        </ul>
      </nav>
    </header>
  )
}
export default MainNav;