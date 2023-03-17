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

// TODO:
// Get role from redux state
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
          <Link passHref href="/new-project">
            <>
              <FaPlus />
              <div class="tooltip">
                <div class="right">
                  <div class="text-content">
                    <h3>New Project</h3>
                  </div>
                </div>
              </div>
            </>
          </Link>
        </div>
        <Link passHref href="/new-project">
          <span className='nav__link'>New Project</span>
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
            <>
              <MdDashboard />
              <div class="tooltip">
                <div class="right">
                  <div class="text-content">
                    <h3>My Boards</h3>
                  </div>
                </div>
              </div>
            </>
          </Link>
        </div>
        <Link
          passHref
          href={"/"}
        >
          <a className='nav__link'>Dashboard</a>
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
            <>
              <AiOutlineProject />
              <div class="tooltip">
                <div class="right">
                  <div class="text-content">
                    <h3>My Projects</h3>
                  </div>
                </div>
              </div>
            </>
          </Link>
        </div>
        <Link
          passHref
          href={`/my/projects`}
        >
          <span className='nav__link'>My Projects</span>
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
            <>
              <ImTicket />
              <div class="tooltip">
                <div class="right">
                  <div class="text-content">
                    <h3>My Tickets</h3>
                  </div>
                </div>
              </div>
            </>
          </Link>
        </div>
        <Link
          passHref
          href={`/my/tickets`}
        >
          <span className='nav__link'>My Tickets</span>
        </Link>
      </div>
    </li>
  </>);

  return (
    <header className={`nav ${openMenu ? "active" : ""}`}>
      <div className={`nav__content-group upper mobile ${openMenu ? "active" : ""}`}>
        <div className={`theme-info ${openMenu ? "active" : ""}`}>
          <ModeButton />
          {user !== null && (
            <div className="nav__user">
              <span>Hello, {user?.username}</span> 
              <span>As: {user?.role}</span>
            </div>
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
                <a>Q</a>
              </Link>
            </h1>
          </div>
        </span>
      </div>
      <div className="nav__content-group upper desktop">
        <ModeButton />
        {user !== null && (
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
                    <ImExit />
                    <div class="tooltip">
                    <div class="right">
                      <div class="text-content">
                        <h3>Sign Out</h3>
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
                    <span className='nav__link'>Sign Out</span>
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
                    <>
                    <ImEnter />
                    <div class="tooltip">
                      <div class="right">
                        <div class="text-content">
                          <h3>Sign In</h3>
                        </div>
                      </div>
                    </div>
                    </>
                    </Link>
                  </div>
                  <Link
                    passHref
                    href="/signin"
                  >
                    <span className='nav__link'>Sign In</span>
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