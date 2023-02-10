import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineProject } from 'react-icons/ai';
import { ImTicket, ImExit, ImEnter } from 'react-icons/im';
import { MdDashboard } from 'react-icons/md';
import { logout } from '@/redux/features/auth/authSlice';
import ModeButton from '@/components/ModeButton';
import Logo from '../UI/Logo';
// import ThemePicker from '@/components/theme/ThemePicker';

// TODO:
// Get role from redux state
// based on role (Admin, Project Manager, Submitter, Developer) hide links.
// swap auth links, show pending on logged in or not
const MainNav = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading: authLoading } = useSelector(state => state.auth);
  const [hasMounted, setHasMounted] = useState(false);
  const status = {
    roleOne: 'Admin',
    roleTwo: 'Project Manager',
    roleThree: 'Developer'
  }
  let admin = status.roleOne;
  // let admin = status.roleThree;
  let role = "Admin";

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }

  const logoutHandler = async () => {
    try {
      dispatch(logout());
      toast.success("Logged out.");
      router.push('/');
    } catch (err) {
      console.error(err);
      toast.error("Failed to logout.")
    }
  };

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
          href={`/my/projects`}
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
        <Link
          passHref
          href={`/my/tickets`}
          className='nav__link'
        >
          My Tickets
        </Link>
      </div>
    </li>
  </>);

  return (
    <header className="nav">
      <ModeButton />
      {user !== null && (
        <div className="nav__user">
          <span>Signed In: </span>
          <span>{user?.username} | {user?.role}</span> 
        </div>
      )}

      {authLoading && (
        <div className="">Loading auth info...</div>
      )}

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
                <a
                  // passHref
                  // href="/logout"
                  className='nav__link'
                  onClick={() => logoutHandler()}
                >
                  Sign Out
                </a>
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
                  href="/signin"
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