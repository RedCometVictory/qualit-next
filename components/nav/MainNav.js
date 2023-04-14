import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { FaPlus, FaChevronRight } from 'react-icons/fa';
import { AiOutlineProject } from 'react-icons/ai';
import { ImTicket, ImExit, ImEnter } from 'react-icons/im';
import { MdDashboard } from 'react-icons/md';
import { logout } from '@/redux/features/auth/authSlice';
import ModeButton from '@/components/ModeButton';
import Logo from '../UI/Logo';
import { Typography } from '@mui/material';

// based on role (Admin, Project Manager, Submitter, Developer) hide links.
// swap auth links, show pending on logged in or not
const MainNav = ({openMenu, setOpenMenu}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user, loading: authLoading } = useSelector(state => state.auth);
  const [hasMounted, setHasMounted] = useState(false);

  const isAdmin = "Admin";

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) return null;

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
          <Link passHref href="/projects/new-project">
            <Typography variant="body1">
              <FaPlus />
              <div className="tooltip">
                <div className="right">
                  <div className="text-content">
                    <Typography
                      variant="h3"
                      color={'primary.tooltipText'}
                      noWrap
                    >
                      New Project
                    </Typography>
                  </div>
                </div>
              </div>
            </Typography>
          </Link>
        </div>
        <Link passHref href="/projects/new-project">
          <Typography className='nav__link' variant='h4' color={'primary.mainMenuText'}>New Project</Typography>
        </Link>
      </div>
    </li>
  );
  
  const authLinks = (<>
    <li className="nav__link-item">
      <div className="nav__link-group">
        <div className="nav__link-icon">
          <Link
            passHref
            href={"/"}
          >
            <Typography variant="body1">
              <MdDashboard />
              <div className="tooltip">
                <div className="right">
                  <div className="text-content">
                    <Typography color={'primary.tooltipText'} variant="h3">
                      My Boards
                    </Typography>
                  </div>
                </div>
              </div>
            </Typography>
          </Link>
        </div>
        <Link
          passHref
          href={"/"}
        >
          <Typography color={'primary.mainMenuText'} variant="h4" className='nav__link'>Dashboard</Typography>
        </Link>
      </div>
    </li>
    <li className="nav__link-item">
      <div className="nav__link-group">
        <div className="nav__link-icon">
          <Link
            passHref
            href={`/my/projects`}
          >
            <Typography variant="body1">
              <AiOutlineProject />
              <div className="tooltip">
                <div className="right">
                  <div className="text-content">
                    <Typography color={'primary.tooltipText'} variant="h3">My Projects</Typography>
                  </div>
                </div>
              </div>
            </Typography>
          </Link>
        </div>
        <Link
          passHref
          href={`/my/projects`}
        >
          <Typography variant='h4' color={'primary.mainMenuText'} className='nav__link'>My Projects</Typography>
        </Link>
      </div>
    </li>
    <li className="nav__link-item">
      <div className="nav__link-group">
        <div className="nav__link-icon">
          <Link
            passHref
            href={`/my/tickets`}
          >
            <Typography variant="body1">
              <ImTicket />
              <div className="tooltip">
                <div className="right">
                  <div className="text-content">
                    <Typography color={'primary.tooltipText'} variant="h3">My Tickets</Typography>
                  </div>
                </div>
              </div>
            </Typography>
          </Link>
        </div>
        <Link
          passHref
          href={`/my/tickets`}
        >
          <Typography color={'primary.mainMenuText'} variant="h4" className='nav__link'>My Tickets</Typography>
        </Link>
      </div>
    </li>
  </>);

  return (
    <header className={`nav ${openMenu ? "active" : ""}`}>
      <div className={`nav__content-group upper mobile ${openMenu ? "active" : ""}`}>
        <div className={`theme-info ${openMenu ? "active" : ""}`}>
          <ModeButton />
          {isAuthenticated && (
            <>
            <Typography
              variant='body2'
              className="nav__user"
              color={'primary.mainMenuText'}
            >
              Hello, {user?.username} 
            </Typography>
            <Typography
              variant='body2'
              className="nav__user"
              color={'primary.mainMenuText'}
            > 
              As: {user?.role}
            </Typography>
            </>
          )}
        </div>

        {authLoading && (
          <div className="">Loading auth info...</div>
        )}

        <span className={`logo-full ${openMenu ? "active" : ""}`}>
          <Logo />
        </span>
        <span className={`logo-letter ${openMenu ? "active" : ""}`}>
          <div className="nav__logo small">
            <h1>
              <Link passHref href="/" className="nav__logo-icon">
                <Typography
                  // variant='body2'
                  variant='body3'
                  color={'primary.tooltipText'}
                >
                  Q
                </Typography>
              </Link>
            </h1>
          </div>
        </span>
      </div>
      <div className="nav__content-group upper desktop">
        <ModeButton />
        {isAuthenticated && (
          <div className="nav__user">
            <span>Hello, {user?.username}</span> 
            <span>As: {user?.role}</span>
          </div>
        )}

        {authLoading && (
          <div className="">Loading auth info...</div>
        )}
        <Logo />
      </div>
      {/* <div className="nav__content-group lower"> */}
      <div className={`nav__content-group lower ${openMenu ? "active" : ""}`}>
        <nav className='nav__menu'>
          {/* <Logo /> */}
          <ul className={`nav__links ${openMenu ? "active" : ""}`}>
            {isAuthenticated && authLinks}
            {isAuthenticated && user.role === isAdmin && adminLinks}
            {isAuthenticated ? (
              <li className="nav__link-item">
                <div className="nav__link-group">
                  <div className="nav__link-icon">
                    <ImExit onClick={() => logoutHandler()} />
                    <div className="tooltip">
                    <div className="right">
                      <div className="text-content">
                        <Typography variant="h3" color={'primary.tooltipText'}>Sign Out</Typography>
                      </div>
                    </div>
                  </div>
                  </div>
                  <a
                    // passHref
                    // href="/logout"
                    className='nav__link'
                    onClick={() => logoutHandler()}
                  >
                    <Typography color={'primary.mainMenuText'} variant="h4" className='nav__link'>Sign Out</Typography>
                  </a>
                </div>
              </li>
            ) : (
              <li className="nav__link-item">
                <div className="nav__link-group">
                  <div className="nav__link-icon">
                    <Link
                      passHref
                      href="/signin"
                    >
                      <Typography variant="body1">
                        <ImEnter />
                        <div className="tooltip">
                          <div className="right">
                            <div className="text-content">
                              <Typography color={'primary.tooltipText'} variant="h3">Sign In</Typography>
                            </div>
                          </div>
                        </div>
                      </Typography>
                    </Link>
                  </div>
                  <Link
                    passHref
                    href="/signin"
                  >
                    <Typography variant="h4" color={'primary.mainMenuText'} className='nav__link'>Sign In</Typography>
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <div className="nav__menu-toggle">
        <FaChevronRight className={`chevron-btn ${openMenu ? "active" : ""}`} onClick={() => setOpenMenu()} />
      </div>
    </header>
  )
};
export default MainNav;