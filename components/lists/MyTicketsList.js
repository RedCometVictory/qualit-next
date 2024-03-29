import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDispatch } from "react-redux";
import { Grid, Typography, Divider, List, ListItem, ListItemIcon, ListItemText, Select, MenuItem } from "@mui/material";
import { ImTicket } from 'react-icons/im';
import ButtonUI from '../UI/ButtonUI';
import Paginate from "../nav/Paginate";

const MyTicketsList = ({tickets, page, pages}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  let projectId = router.query.projectId;
  let [orderBy, setOrderBy] = useState(true);
  let [currentPage, setCurrentPage] = useState(page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const paginatingTickets = async () => {
    return await dispatch(paginateTickets({project_id: projectId, pageNumber: currentPage, itemsPerPage, orderBy}));
  };

  const orderByChange = (value) => {
    // setIsLoading(true);
    if (!value) setOrderBy(orderBy = false);
    if (value) setOrderBy(orderBy = true);
    paginatingTickets();
  };

  const itemCountChange = (e) => {
    // setIsLoading(true);
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

  const ListItemDetail = ({ticket}) => {
    return (
      <div className='dash__list-details'>
        <Typography
          sx={{ display: 'inline', fontSize: '0.775rem' }}
          variant="h6"
          component="span"
          className='sub-header'
        >
          <Link
            passHref
            href={`/tickets/${ticket.id}`}
          >
            {ticket.id}
          </Link>
        </Typography>
        <span className="detail-label">
         [ status | priority | type ]
        </span>
        <span className="">
          {ticket.status} | {ticket.priority} | {ticket.type}
        </span>
        <span className="">{ticket.created_at}</span>
      </div>
    )
  };

  const TicketList = () => {
    return (
      <Grid className="catalog__list" item xs={12} md={6}>
        <List dense={true} >
          {tickets.map((ticket, index) => (<>
            <ListItem
              className={`catalog__list-item ${projectId ? 'tickets-list' : 'dashboard'}`}
              key={index}
            >
              <ListItemIcon>
                <ImTicket />
              </ListItemIcon>
              <ListItemText
                primary={
                  <span className='header'>
                    <Link
                      passHref
                      href={`/tickets/${ticket.id}`}
                    >
                      {ticket.title}
                    </Link>
                  </span>
                }
                secondary={<ListItemDetail ticket={ticket}/>}
              >
              </ListItemText>
            </ListItem>
            <Divider className='catalog__divider divider' variant='inset' component="li"/>
          </>))}
        </List>
      </Grid>
    )
  };

  return (
    <div className={`catalog ${projectId ? 'proj-detail' : 'dashboard'}`}>
      {projectId ? (<>
        <div className="catalog__option-container">
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
            <div className="catalog__order-by">
              <span className="items">
                <div className="">
                  Order By: {" "}
                </div>
                <div className="order-by-options">
                <ButtonUI
                  className={`option ${orderBy ? 'active' : ''}`}
                  variant="outlined"
                  sx={{ color: 'primary.main' }}
                  onClick={() => orderByChange(true)}
                  >
                    New
                  </ButtonUI>
                  <ButtonUI
                    className={`option ${!orderBy ? 'active' : ''}`}
                    variant="outlined"
                    sx={{ color: 'primary.main' }}
                    onClick={() => orderByChange(false)}
                  >
                    Old
                  </ButtonUI>
                </div>
              </span>
            </div>
          </div>
          <div className="option-group two">
            {/* <div className="">Tickets: {pages || 0}</div> */}
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
     </>) : (
        null
      )}
      <TicketList />
    </div>
  );
};
export default MyTicketsList;