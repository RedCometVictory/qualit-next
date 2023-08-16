import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from 'react';
import {useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { BsSearch } from "react-icons/bs";
import store from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import { getUsersListAdmin, rehydrate } from "@/redux/features/user/userSlice";
import { Typography, TextField, Select, MenuItem } from '@mui/material';
import PaperUI from '@/components/UI/PaperUI';
import ButtonUI from '@/components/UI/ButtonUI';
import Paginate from '@/components/nav/Paginate';
import DetailLayout from '@/components/layouts/DetailLayout';

const UsersList = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { users, page, pages, loading: userLoading } = useSelector(state => state.user);
  const [keyword, setKeyword] = useState(initialState.keyword || '');
  let [orderBy, setOrderBy] = useState(true);
  let [currentPage, setCurrentPage] = useState(page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!token || !Cookies.get("qual__isLoggedIn")) {
      dispatch(logout());
      toast.success("Token or authorization expired.")
      return router.push("/");
    }
  }, []);
  
  useEffect(() => {
    dispatch(rehydrate(initialState.user))
  }, [dispatch, initialState])

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const paginatingUsers = () => {
    dispatch(getUsersListAdmin({keyword, pageNumber: currentPage, itemsPerPage, orderBy}));
  };

  const updateText = (e) => {
    setKeyword(e.target.value);
    console.log(keyword)
  };

  const resetInput = (e) => {
    e.preventdefault();
    setKeyword(keyword = "");
  };

  const keywordSearchHandler = (e) => {
    if (e.key === "Enter") {
      setIsLoading(true);
      e.preventDefault();
      if (keyword.length > 0) {
        setKeyword(keyword = e.target.value);
        // resetInput(e);
        paginatingUsers();
      } else {
        paginatingUsers();
      }
    }
  }

  const orderByChange = (value) => {
    // setIsLoading(true);
    if (!value) setOrderBy(orderBy = false);
    if (value) setOrderBy(orderBy = true);
    paginatingUsers();
  };

  const itemCountChange = (e) => {
    // setIsLoading(true);
    if (e.target.value > itemsPerPage) {
      setCurrentPage(currentPage = 1);
    }
    if (currentPage === 0 || currentPage < 0) setCurrentPage(1);
    setItemsPerPage(Number(e.target.value)); // 12 or 20, dropdown
    paginatingUsers();
  };

  const pageChange = (chosenPage) => {
    setCurrentPage(currentPage = chosenPage);
    paginatingUsers();
  };

  return (
    <section className='ticket detail detail__container'>
      <div className="detail__header">
        <div className="detail__info-box left">
          <Typography variant="h2">Users List</Typography>
          <div className="buttons">
            <Link
              href={`/my/account`}
              passHref
            >
              <ButtonUI
                className="btn-one"
                variant="contained"
                color="primary"
              >
                My Account
              </ButtonUI>
            </Link>
          </div>
        </div>
        <div className="detail__info-box right">
        </div>
      </div>
      <div className="detail__content my-content">
        <div className="detail__option-container">
          <div className="option-group one">
            <span className="items">
              <div className="">
                Items on Page: {" "}
              </div>
              <Select
                className='select-menu'
                name="itemCount"
                value={itemsPerPage}
                onChange={e => itemCountChange(e)}
                labelId="item-label"
                size='small'
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </span>
            <div className="detail__order-by items">
              <span className="items">
                <div className="">
                  Order By: {" "}
                </div>
                <div className="order-by-options">
                  <ButtonUI
                    variant="outlined"
                    sx={{ color: 'primary.main' }}
                    className={`option ${orderBy ? 'active' : ''}`}
                    onClick={() => orderByChange(true)}
                  >
                    New
                  </ButtonUI>
                  <ButtonUI
                    variant="outlined"
                    sx={{ color: 'primary.main' }}
                    className={`option ${!orderBy ? 'active' : ''}`}
                    onClick={() => orderByChange(false)}
                  >
                    Old
                  </ButtonUI>
                </div>
              </span>
            </div>
            <span className="items">
              <div className="search-input-group">
                <TextField
                  type="text"
                  className="search-input"
                  label="search for user..."
                  // placeholder="search title..."
                  value={keyword}
                  onChange={e => updateText(e)}
                  onKeyDown={e => keywordSearchHandler(e)}
                  size="small"
                  id="outlined-search-label"
                />
                <div className="search-confirm-btn">
                  <button className="search-btn">
                    <BsSearch
                      className='btn-glass'
                      // onClick={e => keywordSearchHandler(e)}
                    />
                  </button>
                </div>
              </div>
            </span>
          </div>
          <div className='option-group two'>
            <div className="item-count my-projects-list">Users: {pages}</div>          
          </div>
          <div className="option-group three">
            <Paginate
              itemCountChange={itemCountChange}
              pageChange={pageChange}
              currentPage={currentPage}
              totalCount={pages}
              itemsPerPageCount={itemsPerPage}
              // pageSizeCount={5}
            />
          </div>
        </div>
        <div className="detail__roster-slide">
          <section className="detail__roster-header users-list">
            <h4>Full Name</h4>
            <h4>Username</h4>
            <h4>E-mail</h4>
            <h4>Role</h4>
            <h4>Created On</h4>
          </section>
          <section className="detail__roster">
            {users.map((user, index) => (
              <PaperUI className="detail__roster-row users-list" key={user.id}>            
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    <span className="item">
                      {/* <Link></Link> */}
                      {user.f_name}{" "}{user.l_name}
                    </span>
                  </div>
                </div>
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    <span className="item">
                      {user.username}
                    </span>
                  </div>
                </div>
                {/* <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    <a
                      className='github-icon'
                      href={"#"}
                    >
                    </a>
                  </div>
                </div> */}
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    <span className="item email">
                      {user.email}
                    </span>
                  </div>
                </div>
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    <span className="item">
                      {user.role}
                    </span>
                  </div>
                </div>
                {/* <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    {project.ticket_count}
                  </div>
                </div> */}
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    <span className="item">
                      {user.created_at}
                    </span>
                  </div>
                </div>
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    {/* <Typography
                      className="option-link"
                      variant='body2'
                    >
                      <Link
                        href={`/#`}
                        passHref
                      >
                        Edit
                      </Link>
                    </Typography> */}
                    <Typography
                      className="option-link"
                      variant='body2'
                    >
                      <Link
                        href={`/users/${user.id}/view`}
                        passHref
                      >
                        View
                      </Link>
                    </Typography>
                  </div>
                </div>
              </PaperUI>
            ))}
            <div className="bottom-padding"></div>
          </section>
        </div>
      </div>
    </section>
  )
};
export default UsersList;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token;
    token ? token : null;
    if (!token) {
      context.res.setHeader(
        "Set-Cookie", [
          `qual__isLoggedIn=deleted; Max-Age=0`,
          // `qual__user=deleted; Max-Age=0`
        ]
      )

      return {
        redirect: {
          destination: `/signin?session_expired=true`,
          permanent: false,
        },
        props: {},
      };
    };
    // let userInfo = context.req.cookies.qual__user;
    // let ticketID = context.params.ticketId;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    await store.dispatch(getUsersListAdmin({keyword: '', pageNumber: 1, itemsPerPage: 20, orderBy: true, cookie: validCookieAuth}));

    return {
      props: {
        initialState: store.getState(),
        token
      }
    }
  } catch (err) {
    console.error(err);
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      },
      props: {
        token: ""
      }
    }
  }
};
UsersList.getLayout = function getLayout(UsersList) {
  return <DetailLayout>{UsersList}</DetailLayout>
};