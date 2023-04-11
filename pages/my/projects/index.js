import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaPlusCircle, FaRegEdit, FaArrowAltCircleUp, FaGithub } from 'react-icons/fa';
import { FaSearch } from 'react-icons/fa';
import store from '@/redux/store';
import { getDataGSSP, getData } from "@/utils/fetchData";
import { logout } from "@/redux/features/auth/authSlice";
import { getProjects, rehydrate } from '@/redux/features/project/projectSlice';
import DetailLayout from "@/components/layouts/DetailLayout";
import { Card, Divider, List, ListItem, ListItemIcon, ListItemText, Typography, FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import PaperUI from '@/components/UI/PaperUI';
import ButtonUI from "@/components/UI/ButtonUI";
import Paginate from '@/components/nav/Paginate';


  // current page = page number
  // let [orderBy, setOrderBy] = useState(true);
  // let [currentPage, setCurrentPage] = useState(page || 1);
  // const [itemsPerPage, setItemsPerPage] = useState(20);

// const orderByChange = (value) => {
//   setIsLoading(true);
//   if (!value) setFormData(orderBy = false);
//   if (value) setFormData(orderBy = true);
//   paginatingComments();
// };

// const itemCountChange = (e) => {
//   setIsLoading(true);
//   // todo: errs when changing from high item count to lower item count
//   if (e.target.value > itemsPerPage) {
//     setFormData(pageNumber = pageNumber - 1);
//   }
//   if (pageNumber === 0) setFormData(pageNumber = 1);
//   setFormData(itemsPerPage = Number(e.target.value)); // 12 or 20, dropdown
//   paginatingComments();
// };

// const pageChange = (chosenPage) => {
//   // setCurrentPage(currentPage = chosenPage);
//   setFormData(pageNumber = chosenPage);
//   paginatingComments();
// };


// const initialState = {
//   keyword: '', status: '', priority: '', type: '', submitter: '', pageNumber: 1, itemsPerPage: 20, orderBy: true, orderChoice: 'date'
// };

const MyProjects = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { projects, page, pages, loading: projectLoading } = useSelector(state => state.project); // ---
  const [keyword, setKeyword] = useState(initialState.keyword || '');
  const [status, setStatus] = useState(initialState.status || '');
  const [priority, setPriority] = useState(initialState.priority || '');
  const [type, setType] = useState(initialState.type || '');
  // const [submitter, setSubmitter] = useState(initialState.submitter || '');  // disable for now
  const [orderChoice, setOrderChoice] = useState(initialState.orderChoice || 'date');
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
  
  // todo - seems to fix hydration error
  if (!hasMounted) {
    return null;
  };

  const paginatingTickets = () => {
    console.log("paginating tickets list")
    console.log("keyword")
    console.log(keyword)
    console.log("status")
    console.log(status)
    console.log("priority")
    console.log(priority)
    console.log("type")
    console.log(type)
    console.log("currentPage")
    console.log(currentPage)
    console.log("itemsPerPage")
    console.log(itemsPerPage)
    console.log("orderBY")
    console.log(orderBy)
    console.log("orderChoice")
    console.log(orderChoice)
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
    console.log("XXXXXXXXXXXXXXXXXXXXXX")
    console.log("searching via keyword")
    console.log(e.key)
    if (e.key === "Enter") {
      console.log("e.target.value")
      console.log(e.target.value)
      setIsLoading(true);
      e.preventDefault();
      if (keyword.length > 0) {
        setKeyword(keyword = e.target.value);
        paginatingTickets();
      } else {
        paginatingTickets();
      }
    }
  }
  const statusChange = (e) => {
    setIsLoading(true);
    setStatus(status = e.target.value);
    paginatingTickets();
  };
  const priorityChange = (e) => {
    setIsLoading(true);
    setPriority(priority = e.target.value);
    paginatingTickets();
  };
  const typeChange = (e) => {
    setIsLoading(true);
    setType(type = e.target.value);
    paginatingTickets();
  };

  const orderByChange = (value) => {
    // setIsLoading(true);
    if (!value) setOrderBy(orderBy = false);
    if (value) setOrderBy(orderBy = true);
    paginatingTickets();
  };

  const orderChoiceChange = (e) => {
    // setIsLoading(true);
    setOrderChoice(orderChoice = e.target.value);
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
          {/* <div className="buttons">
            <ButtonUI
              className="btn-one"
              variant="contained"
              // color="secondary"
            >
              Edit
            </ButtonUI>
            <ButtonUI
              variant="contained"
              // color="secondary"
            >
              Delete
            </ButtonUI>
          </div> */}
        </div>
        <div className="detail__info-box right">
          {/* # of Comments: {comments.length} / # of Memebers: 09 */}
        </div>
      </div>
      {/* <div className="detail__sub-header">
        <span className="title">{ticket.title}</span>
        <div className="stats-container">
          <span>{ticket.id}</span>
          <span className="stats">Priority</span>
          <span className=""> | </span>
          <span className="stats">Status</span>
        </div>
        <span className="date">
          Created On: {ticket.created_at}
        </span>
      </div> */}
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
                {/* <div className="search-confirm-btn">
                  <button className="search-btn">
                    <FaSearch />
                  </button>
                </div> */}
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
    console.log("token")
    console.log(token)
    console.log(null)
    if (!token) {
      console.log("session expired")
      // Cookies.remove("qual__isLoggedIn");
      context.res.setHeader(
        "Set-Cookie", [
          `qual__isLoggedIn=deleted; Max-Age=0`,
          // `qual__=deleted; Max-Age=0`
        ]
      )
      // localStorage.removeItem("qual__user");
      return {
        redirect: {
          destination: `/signin?session_expired=true`,
          permanent: false,
        },
        props: {},
      };
    };
    
    // TODO: may remove/use userInfo
    let userInfo = context.req.cookies.qual__user;
    // let ticketID = context.params.ticketId;
    // let projectInfo;
    // TODO: validCookieAuth only ussed to dev. Remove for prod is token is all you need
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;

    // TODO: attempt to only pass token, not all cookies necessary to pass
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