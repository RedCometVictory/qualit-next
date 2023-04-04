import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { BsSearch } from "react-icons/bs";
import store from '@/redux/store';
import { logout } from "@/redux/features/auth/authSlice";
import { getTickets, paginateMyTickets, rehydrate } from '@/redux/features/project/projectSlice';
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

const MyTickets = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tickets, page, pages, loading: projectLoading } = useSelector(state => state.project); // ---
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
    console.log("SSSSSSSSSSSSSSSSSSSSSSSSSSSSSS")
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
    dispatch(paginateMyTickets({keyword, status, priority, type, pageNumber: currentPage, itemsPerPage, orderBy, orderChoice}));
  };

  const updateText = (e) => {
    setKeyword(e.target.value);
    console.log(keyword)
  };

  const resetInput = (e) => {
    e.preventdefault();
    setKeyword(keyword = "");
  };

  // const iconSearchHandler = (e) => {
  //   // if (e.key === "Enter") {
  //   //   setIsLoading(true);
  //   //   e.preventDefault();
  //     if (keyword.length > 0) {
  //       setKeyword(keyword = e.target.value);
  //       // resetInput(e);
  //       paginatingTickets();
  //     } else {
  //       return;
  //     }
  //   }
  //   // setKeyword(keyword = e.target.value);
  //   // paginatingTickets();
  // };
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
        // resetInput(e);
        paginatingTickets();
      } else {
        // resets tickets
        paginatingTickets();
      }
    }
    // setKeyword(keyword = e.target.value);
    // paginatingTickets();
  };
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
    setIsLoading(true);
    if (!value) setOrderBy(orderBy = false);
    if (value) setOrderBy(orderBy = true);
    paginatingTickets();
  };

  const orderChoiceChange = (e) => {
    setIsLoading(true);
    setOrderChoice(orderChoice = e.target.value);
    paginatingTickets();
  };

  const itemCountChange = (e) => {
    setIsLoading(true);
    // todo: errs when changing from high item count to lower item count
    if (e.target.value > itemsPerPage) {
      setCurrentPage(currentPage = currentPage - 1);
    }
    if (currentPage === 0) setCurrentPage(1);
    setItemsPerPage(itemsPerPage = Number(e.target.value)); // 12 or 20, dropdown
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
          <h3>My Tickets</h3>
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
              <Select
                className='select-menu'
                name="orderChoice"
                value={orderChoice}
                onChange={e => orderChoiceChange(e)}
                labelId="item-label"
                size='small'
              >
                <MenuItem value={'date'}>Created</MenuItem>
                <MenuItem value={'deadline'}>Deadline</MenuItem>
              </Select>
            </span>
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
                  // inputProps={
                  //   <FaSearch />
                      // <SearchIcon />
                  // }
                />
                <div className="search-confirm-btn">
                  <button className="search-btn">
                    <BsSearch
                      className='btn-glass'                    
                      // onClick={e => keywordSearchHandler(e)}
                    />
                    {/* <FaSearch /> */}
                    {/* <SearchIcon /> */}
                  </button>
                </div>
              </div>
            </span>
          </div>
          <div className='option-group two'>
            <span className="items">
              <FormControl
                className="form-control"
                sx={{ m: 1, minWidth: 120 }}
                size='small'
              >
                <InputLabel
                  className='input-label'
                  id="demo-controlled-open-select-status-label"
                >
                  Status
                </InputLabel>
                <Select
                  className='select-menu'
                  name="status"
                  id="demo-controlled-open-select-status"
                  label="status"
                  value={status}
                  onChange={e => statusChange(e)}
                  labelId="item-label"
                >
                  <MenuItem value={''} defaultChecked defaultValue={true}>None</MenuItem>
                  <MenuItem value={'New'}>New</MenuItem>
                  <MenuItem value={'Open'}>Open</MenuItem>
                  <MenuItem value={'On Hold'}>On Hold</MenuItem>
                  <MenuItem value={'In Progress'}>In Progress</MenuItem>
                  <MenuItem value={'Closed'}>Closed</MenuItem>
                  <MenuItem value={'Unconfirmed'}>Unconfirmed</MenuItem>
                </Select>
              </FormControl>
            </span>            
            <span className="items">
              <FormControl
                className='form-control'
                sx={{ m: 1, minWidth: 120 }}
                size='small'
              >
                <InputLabel
                  className="input-label"
                  id="demo-controlled-open-select-priority-label"
                >
                  Priority
                </InputLabel>
                <Select
                  className='select-menu'
                  name="priority"
                  label="priority"
                  id="demo-controlled-open-select-priority"
                  value={priority}
                  onChange={e => priorityChange(e)}
                  labelId="item-label"
                >
                  <MenuItem value={''} defaultChecked defaultValue={true}>None</MenuItem>
                  <MenuItem value={'Urgent'}>Urgent</MenuItem>
                  <MenuItem value={'High'}>High</MenuItem>
                  <MenuItem value={'Medium'}>Medium</MenuItem>
                  <MenuItem value={'Low'}>Low</MenuItem>
                </Select>
              </FormControl>
            </span>
            <span className="items">
              <FormControl
                className='form-control'
                sx={{ m: 1, minWidth: 120 }}
                size='small'
              >
                <InputLabel
                  className='input-label'
                  id="demo-controlled-open-select-type-label"
                >
                  Type
                </InputLabel>
                <Select
                  className='select-menu'
                  name="type"
                  label="type"
                  id="demo-controlled-open-select-type"
                  value={type}
                  onChange={e => typeChange(e)}
                  labelId="item-label"
                >
                  <MenuItem value={''} defaultChecked defaultValue={true}>None</MenuItem>
                  <MenuItem value={'Bug'}>Bug</MenuItem>
                  <MenuItem value={'Breaking Change'}>Breaking Change</MenuItem>
                  <MenuItem value={'Discussion'}>Discussion</MenuItem>
                  <MenuItem value={'Error'}>Error</MenuItem>
                  <MenuItem value={'Enhancement'}>Enhancement</MenuItem>
                  <MenuItem value={'Feature Request'}>Feature Request</MenuItem>
                  <MenuItem value={'Needs Investigation'}>Needs Investigation</MenuItem>
                  <MenuItem value={'Question'}>Question</MenuItem>
                  <MenuItem value={'Release'}>Release</MenuItem>
                  <MenuItem value={'Regression'}>Regression</MenuItem>
                  <MenuItem value={'Security'}>Security</MenuItem>
                  <MenuItem value={'Misc'}>Misc</MenuItem>
                </Select>
              </FormControl>
            </span>
            <div className="item-count">Tickets: {pages}</div>          
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
        <section className="detail__roster-header my-ticket">
          <h4>Title</h4>
          <h4>Submitter</h4>
          <h4>Status</h4>
          <h4>Priority</h4>
          <h4>Type</h4>
          <h4>Deadline</h4>
          <h4>Created On</h4>
          <h4>Options</h4>
        </section>
        <section className="detail__roster">
          {tickets.map((ticket, index) => (
            <PaperUI className="detail__roster-row my-ticket" key={ticket.id}>            
              <div className="detail__roster-item-group">
                <div className="detail__roster-item">
                  {ticket.title}
                </div>
              </div>
              <div className="detail__roster-item-group">
                <div className="detail__roster-item">
                  {ticket.submitter}
                </div>
              </div>
              <div className="detail__roster-item-group">
                <div className="detail__roster-item">
                  {ticket.status}
                </div>
              </div>
              <div className="detail__roster-item-group">
                <div className="detail__roster-item">
                  {ticket.priority}
                </div>
              </div>
              <div className="detail__roster-item-group">
                <div className="detail__roster-item">
                  {ticket.type}
                </div>
              </div>
              <div className="detail__roster-item-group">
                <div className="detail__roster-item">
                  {ticket.deadline}
                </div>
              </div>
              <div className="detail__roster-item-group">
                <div className="detail__roster-item">
                  {ticket.created_at}
                </div>
              </div>
              <div className="detail__roster-item-group">
                <div className="detail__roster-item">
                  <Typography
                    className="option-link"
                    variant='body2'
                  >
                    <Link
                      href={`/tickets/${ticket.id}`}
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
                      href={`/tickets/${ticket.id}`}
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
    </section>
  );
};
export default MyTickets;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token;
    token ? token : null;
    if (!token) {
      context.res.setHeader(
        "Set-Cookie", [
          `qual__isLoggedIn=deleted; Max-Age=0`,
          // `qual__=deleted; Max-Age=0`
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
    
    // TODO: may remove/use userInfo
    let userInfo = context.req.cookies.qual__user;
    // let ticketID = context.params.ticketId;
    let ticketInfo;
    // TODO: validCookieAuth only ussed to dev. Remove for prod is token is all you need
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;

    // TODO: attempt to only pass token, not all cookies necessary to pass
    ticketInfo = await store.dispatch(getTickets({keyword: '', status: '', priority: '', type: '', submitter: '', pageNumber: 1, itemsPerPage: 20, orderBy: true, orderChoice: 'date', cookie: validCookieAuth}));

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
MyTickets.getLayout = function getLayout(MyTickets) {
  return <DetailLayout>{MyTickets}</DetailLayout>
};