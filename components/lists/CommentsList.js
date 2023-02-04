import { useId, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { paginateTicketComments } from '@/redux/features/project/projectSlice';
import { Grid, Typography, Demo, Divider, List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Card, Select, MenuItem, InputLabel } from "@mui/material";
import { FaComment } from 'react-icons/fa';
import Paginate from '../nav/Paginate';

const CommentsList = ({comments, loading, page, pages}) => {
  const id = useId();
  const dispatch = useDispatch();
  const router = useRouter();
  let ticketId = router.query.ticketId;
  let [orderBy, setOrderBy] = useState(true);
  let [currentPage, setCurrentPage] = useState(page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const paginatingComments = async () => {
    return await dispatch(paginateTicketComments({ticket_id: ticketId, pageNumber: currentPage, itemsPerPage, orderBy}));
  };

  const orderByChange = (value) => {
    setIsLoading(true);
    if (!value) setOrderBy(orderBy = false);
    if (value) setOrderBy(orderBy = true);
    paginatingComments();
  };
  
  const itemCountChange = (e) => {
    setIsLoading(true);
    // todo: errs when changing from high item count to lower item count
    if (e.target.value > itemsPerPage) {
      setCurrentPage(currentPage = currentPage - 1);
    }
    if (currentPage === 0) setCurrentPage(1);
    setItemsPerPage(itemsPerPage = Number(e.target.value)); // 12 or 20, dropdown
    paginatingComments();
  };
  
  const pageChange = (chosenPage) => {
    setCurrentPage(currentPage = chosenPage);
    paginatingComments();
  };

  const ListItemDetail = ({comment}) => {
    return (<>
      <Typography
        className='dash__list-details'
        sx={{ display: 'inline', fontSize: '0.775rem' }}
        variant="h6"
        component="span"
      >
        {comment.f_name} {comment.l_name}
        {/* <Link
          passHref
          href={`/tickets/${comment.user_id}`}
        >
          {comment.f_name}{" "}{comment.l_name}
        </Link> */}
      </Typography>
      <Card>
        {!comment.file_name ? (
          <Typography>No image...</Typography>
        ) : (
          <>
          {/* comment,file_mimetype will dictate if using <Image> or swapping out the html for supporting pssdf file viewing or pdf template image to be shown along with a download link tot the file itself or a redirect to view and c=download the pdf in a new tab */}
            {comment.file_name && (
              <div className="">
                <Image
                  className={"image"}
                  src={comment.file_url}
                  alt="comment file or image"
                  layout="fill"
                />
              </div>
            )}
          </>
        )}
      </Card>
        {/* <span className="detail-label">
         [ username ]
        </span>
        <span className="">
          {comment.username}
        </span> */}
        {/* <span className="">{comment.created_at}</span> */}
        {/* <span>{comment.updated_at}</span> */}
        {/* <Link
          passHref
          href={`/tickets/${comment.ticket_id}`}
        >
          {comment.description}
        </Link> */}
    </>)
  };

  const CommentList = () => {
    return (
      <Grid className="catalog__list" item xs={12} md={6}>
        <List
          className="catalog__list-item"
          dense={true}
          // sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {comments.map((comment, index) => (
            <Card key={comment.id}>
              {/* <div className='catalog__message'>{comment.message}</div> */}
            {/* <Link
              passHref
              href={`/tickets/${comment.ticket_id}`}
            > */}
            {/* </Link> */}
              <ListItem
                // alignItems='flex-start'
              >
                <ListItemIcon>
                  <FaComment />
                </ListItemIcon>
                <div className="catalog__comments-desc">
                  <div className='catalog__message'>{comment.message}</div>
                  <ListItemText
                    primary={comment.id}
                    secondary={<ListItemDetail comment={comment}/>}
                  />
                </div>
              </ListItem>
              {/* <div>
                {comment.description}
              </div> */}
              <Divider variant='inset' component="li"/>
            </Card>
          ))}
        </List>
      </Grid>
    )
  };
  
  return (<>
    <div className='catalog'>
      {ticketId ? (<>
        <div className="catalog__option-container">
          <div className="option-group one">
            <span className="items">
              <div className="">
                Items on Page: {" "}
              </div>
              {/* <select name="itemCount" value={itemsPerPage} onChange={e => itemCountChange(e)}>
                <option value="20">20</option>
                <option value="50">50</option>
              </select> */}
              {/* <InputLabel id="item-label">Items</InputLabel> */}
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
                  <span
                    className={`option ${orderBy ? 'active' : ''}`}
                    onClick={() => orderByChange(true)}
                  >
                    New
                  </span>
                  <span
                    className={`option ${!orderBy ? 'active' : ''}`}
                    onClick={() => orderByChange(false)}
                  >
                    Old
                  </span>
                </div>
              </span>
            </div>
          </div>
          <div className='option-group two'>
            <div className="">Comments: {pages}</div>          
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
      <CommentList />
    </div>
  </>)
};
export default CommentsList;