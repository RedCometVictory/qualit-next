import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { paginateTicketComments } from '@/redux/features/project/projectSlice';
import { Grid, Typography, List, ListItem, ListItemIcon, ListItemText, Select, MenuItem } from "@mui/material";
import { FaComment, FaRegWindowClose } from 'react-icons/fa';
import ButtonUI from '../UI/ButtonUI';
import PaperUI from '../UI/PaperUI';
import Paginate from '../nav/Paginate';

const CommentsList = ({comments, loading, page, pages, userRole}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  let ticketId = router.query.ticketId;
  const { user } = useSelector(state => state.auth);
  let [orderBy, setOrderBy] = useState(true);
  let [currentPage, setCurrentPage] = useState(page || 1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const paginatingComments = async () => {
    return await dispatch(paginateTicketComments({ticket_id: ticketId, pageNumber: currentPage, itemsPerPage, orderBy}));
  };

  const orderByChange = (value) => {
    // setIsLoading(true);
    if (!value) setOrderBy(orderBy = false);
    if (value) setOrderBy(orderBy = true);
    paginatingComments();
  };
  
  const itemCountChange = (e) => {
    let newCount = e.target.value;
    if (newCount > itemsPerPage) {
      setCurrentPage(currentPage = 1);
    }
    if (currentPage === 0 || currentPage < 0) setCurrentPage(1);
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
        className='catalog__list-details'
        sx={{ display: 'inline', fontSize: '0.775rem' }}
        variant="h6"
        component="span"
      >
        {comment.created_at}
      </Typography>
    </>)
  };

  const deleteTicketCommentHandler = (ticketId, commentId) => {
    dispatch(deleteTicketComment({ticketId, commentId}));
  };

  const CommentList = () => {
    return (
      <Grid className="catalog__list-container" item xs={12} md={6}>
        <List
          className="catalog__list"
          dense={true}
          // sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
        >
          {comments.map((comment, index) => (
            <div key={comment.id} className="catalog__comment">
              <PaperUI className="paper">
                <ListItem className='catalog__list-item'>
                  <div className="catalog__main-item-content">
                    <ListItemIcon className='list-item-icon'>
                      <FaComment />
                    </ListItemIcon>
                    <div className="catalog__comments-desc">
                      <div className='catalog__message'>{comment.message}</div>
                      <ListItemText
                        primary={
                          <>
                            {comment.f_name} {comment.l_name} - {comment.role}
                          </>
                        }
                        secondary={<ListItemDetail comment={comment}/>}
                      />
                    </div>
                    {user?.id === comment.user_id || userRole === "Admin" ? (
                      <FaRegWindowClose 
                        className='item-icon'
                        onClick={() => deleteTicketCommentHandler(ticketId, comment.id)}
                      />
                    ) : (null)}
                  </div>
                  {comment.file_name.length === 0 ? (
                    null
                  ) : comment.file_mimetype !== "application/pdf" ? (
                    <div className="catalog__image-container">
                      <Image
                        className={"catalog__image"}
                        src={comment.file_url}
                        alt="comment file or image"
                        layout="fill"
                      />
                    </div>
                  ) : (
                    <div className="catalog__image-container pdf">
                      <a
                        download
                        href={comment.file_url}
                        className=""
                      >
                        <ButtonUI
                          variant="outlined"
                          sx={{ color: 'primary.main' }}
                        >
                          View PDF
                        </ButtonUI>
                      </a>
                      <Typography
                        className="pdf-name"
                        variant='body1'
                        noWrap
                      >
                        {comment.file_name}
                      </Typography>
                    </div>
                  )}
                </ListItem>
              </PaperUI>
            </div>
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
          </div>
          <div className='option-group two'>
            {/* <div className="">Comments: {pages}</div> */}
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