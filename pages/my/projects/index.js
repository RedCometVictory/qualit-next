import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaGithub } from 'react-icons/fa';
import { BsSearch } from "react-icons/bs";
import store from '@/redux/store';
import { logout } from "@/redux/features/auth/authSlice";
import { getProjects, rehydrate } from '@/redux/features/project/projectSlice';
import DetailLayout from "@/components/layouts/DetailLayout";
import { Typography, TextField, Select, MenuItem } from '@mui/material';
import PaperUI from '@/components/UI/PaperUI';
import ButtonUI from "@/components/UI/ButtonUI";
import Paginate from '@/components/nav/Paginate';

const MyProjects = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { projects, page, pages, loading: projectLoading } = useSelector(state => state.project); // ---
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
    dispatch(rehydrate(initialState.project))
  }, [dispatch, initialState])

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const paginatingTickets = () => {
    dispatch(getProjects({keyword, pageNumber: currentPage, itemsPerPage, orderBy}));
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
        paginatingTickets();
      } else {
        paginatingTickets();
      }
    }
  }

  const orderByChange = (value) => {
    // setIsLoading(true);
    if (!value) setOrderBy(orderBy = false);
    if (value) setOrderBy(orderBy = true);
    paginatingTickets();
  };

  const itemCountChange = (e) => {
    // setIsLoading(true);
    // todo: errs when changing from high item count to lower item count
    if (e.target.value > itemsPerPage) {
      setCurrentPage(currentPage = 1);
    }
    if (currentPage === 0 || currentPage < 0) setCurrentPage(1);
    setItemsPerPage(Number(e.target.value)); // 12 or 20, dropdown
    paginatingTickets();
  };

  const pageChange = (chosenPage) => {
    setCurrentPage(currentPage = chosenPage);
    paginatingTickets();
  };

  return (
    <section className="ticket detail detail__container">
      <div className="detail__header">
        <div className="detail__info-box left">
          <h3>My Projects</h3>
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
                  label="search title..."
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
            <div className="item-count">Comments: {pages}</div>          
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
          <section className="detail__roster-header my-ticket">
            <h4>Title</h4>
            {/* <h4>Description</h4> */}
            <h4>Github</h4>
            <h4>Owner</h4>
            <h4>Website</h4>
            <h4>Tickets</h4>
            <h4>Created On</h4>
            <h4>Options</h4>
          </section>
          <section className="detail__roster">
            {projects.map((project, index) => (
              <PaperUI className="detail__roster-row my-ticket" key={project.id}>            
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    {project.title}
                  </div>
                </div>
                {/* <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    {project.description}
                  </div>
                </div> */}
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    <a
                      className='github-icon'
                      href={project.github_url}
                    >
                      <FaGithub />
                    </a>
                  </div>
                </div>
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    <span className="full-name">
                      {project.f_name}{" "}{project.l_name}
                    </span>
                  </div>
                </div>
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    {project.site_url}
                  </div>
                </div>
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    {project.ticket_count}
                  </div>
                </div>
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    {project.created_at}
                  </div>
                </div>
                <div className="detail__roster-item-group">
                  <div className="detail__roster-item">
                    <Typography
                      className="option-link"
                      variant='body2'
                    >
                      <Link
                        href={`/projects/${project.id}/edit`}
                        passHref
                      >
                        Edit / Assign
                      </Link>
                    </Typography>
                    <Typography
                      className="option-link"
                      variant='body2'
                    >
                      <Link
                        href={`/projects/${project.id}`}
                        passHref
                      >
                        View Details
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
  );
};
export default MyProjects;
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
    await store.dispatch(getProjects({keyword: '', pageNumber: 1, itemsPerPage: 20, orderBy: true, cookie: validCookieAuth}));

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
MyProjects.getLayout = function getLayout(MyProjects) {
  return <DetailLayout>{MyProjects}</DetailLayout>
};