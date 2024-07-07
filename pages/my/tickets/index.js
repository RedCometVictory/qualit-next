import { useRouter } from 'next/router';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BsSearch } from "react-icons/bs";
import store from '@/redux/store';
import { getDataSSR } from '@/utils/fetchData';
import { getTickets, paginateMyTickets, rehydrate } from '@/redux/features/project/projectSlice';
import DetailLayout from "@/components/layouts/DetailLayout";
import { Typography, FormControl, TextField, InputLabel, Select, MenuItem } from '@mui/material';
import PaperUI from '@/components/UI/PaperUI';
import ButtonUI from "@/components/UI/ButtonUI";
import Paginate from '@/components/nav/Paginate';

const MyTickets = ({initialState, token, roleResult}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { tickets, page, pages, loading: projectLoading } = useSelector(state => state.project); // ---
  const [keyword, setKeyword] = useState(initialState.keyword || '');
  const [status, setStatus] = useState(initialState.status || '');
  const [priority, setPriority] = useState(initialState.priority || '');
  const [type, setType] = useState(initialState.type || '');
  const [orderChoice, setOrderChoice] = useState(initialState.orderChoice || 'date');
  let [orderBy, setOrderBy] = useState(true);
  let [currentPage, setCurrentPage] = useState(page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(rehydrate(initialState.project))
  }, [dispatch, initialState])

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  // seems to fix hydration error
  if (!hasMounted) return null;

  const paginatingTickets = () => {
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
    setOrderChoice(orderChoice = e.target.value);
    paginatingTickets();
  };

  const itemCountChange = (e) => {
    if (e.target.value > itemsPerPage) {
      setCurrentPage(currentPage = 1);
    }
    if (currentPage === 0 || currentPage < 0) setCurrentPage(1);
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
          <Typography variant="h2">My Tickets</Typography>
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
        <div className="detail__roster-slide">
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
                    {ticket.f_name && ticket.l_name ? `${ticket.f_name} ${ticket.l_name}` : "N/A"}
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
                  {roleResult === "Admin" || roleResult === "Project Manager" ? (
                    <Typography
                      className="option-link"
                      variant='body2'
                    >
                      <Link
                        href={`/tickets/${ticket.id}/edit`}
                        passHref
                      >
                        Edit
                      </Link>
                    </Typography>
                  ) : (
                    null
                  )}
                    <Typography
                      className="option-link"
                      variant='body2'
                    >
                      <Link
                        href={`/tickets/${ticket.id}`}
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
  );
};
export default MyTickets;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token || null;
    if (!token) {
      return {
        redirect: {
          destination: `/signin?session_expired=true`,
          permanent: false,
        },
        props: {},
      };
    };

    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    let userRole = await getDataSSR(`/auth/checkAuth`, validCookieAuth);
    let roleResult = userRole?.data?.role;

    await store.dispatch(getTickets({keyword: '', status: '', priority: '', type: '', submitter: '', pageNumber: 1, itemsPerPage: 20, orderBy: true, orderChoice: 'date', cookie: validCookieAuth}));

    return {
      props: {
        initialState: store.getState(),
        token,
        roleResult
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