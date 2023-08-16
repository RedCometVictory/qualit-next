import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import store from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaRegWindowClose, FaUserEdit } from "react-icons/fa";
import { FaPlusCircle, FaRegEdit } from 'react-icons/fa';
import { Divider, Typography } from '@mui/material';
import { logout } from "@/redux/features/auth/authSlice";
import { getTicket, deleteTicketNote, rehydrate } from "@/redux/features/project/projectSlice";
import ButtonUI from '@/components/UI/ButtonUI';
import PaperUI from '@/components/UI/PaperUI';
import DetailLayout from '@/components/layouts/DetailLayout';
import AddNoteModal from '@/components/modals/AddNoteModal';
import NewCommentModal from '@/components/modals/NewCommentModal';
import AssignUserTicketModal from '@/components/modals/AssignUserTicketModal';
import CommentsList from '@/components/lists/CommentsList';
import Description from '@/components/details/Description';

const Ticket = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { ticket, notes, comments, history, loading: projectLoading, page, pages } = useSelector(state => state.project);
  const { user } = useSelector(state => state.auth);
  const [addNoteModal, setAddNoteModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

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
    
  const openNoteModal = () => {
    setAddNoteModal(true);
  };
  const openNewCommentModal = () => {
    setCommentModal(true);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) return null;

  const deleteNoteHandler = (ticket_id, note_id) => {
    // dispatch, can only delete if admin or owner of note
    dispatch(deleteTicketNote({ticket_id, note_id}));
  };

  const editAssignedUserHandler = () => {
    setAssignModal(assignModal = true);
  };

  const TicketStatsBox = ({title, value}) => {
    return (
      <div className="status-column">
        <PaperUI
          className="detail__description paper"
        >
          <Typography variant="h4">{title}</Typography>
          <Divider />
          <Typography variant="body1">{value ? value : "N/A"}</Typography>
        </PaperUI>
      </div>
    )
  };

  return (
    <section className="ticket detail detail__container">
      {assignModal && (user.role === "Admin" || user.role === "Project Manager") ? (
        <AssignUserTicketModal ticketId={ticket.id} projectId={ticket.project_id} setAssignModal={setAssignModal} />
      ) : (
        null
      )}
      <div className="detail__header">
        <div className="detail__info-box left">
          <Typography variant="h2">Ticket Details</Typography>
          <div className="buttons">
            <Link
              href={`/tickets/${ticket.id}/edit`}
              passHref
            >
              <ButtonUI
                className="btn-one"
                variant="contained"
                color="primary"
              >
                Edit
              </ButtonUI>
            </Link>
            {/* {user?.role === "Admin" ? (
              <Link
                // href={`/tickets/${ticket.id}/delete`}
                href={`/tickets/${ticket.id}/edit`}
                passHref
              >
                <ButtonUI
                  variant="contained"
                  color="primary"
                >
                  Delete
                </ButtonUI>
              </Link>
            ) : (
              null
            )} */}
          </div>
        </div>
        <div className="detail__info-box right">
          Comments: {pages}
        </div>
      </div>
      <div className="detail__sub-header">
        <span className="title">{ticket.title}</span>
        <div className="stats-container">
          <span>{ticket.id}</span>
          {/* <span className="stats">Priority</span>
          <span className=""> | </span>
          <span className="stats">Status</span> */}
        </div>
        <span className="date">
          Created On: {ticket.created_at}
        </span>
      </div>
      <div className="detail__content detail-page ticket-page">
        <section className="left">
          <Description description={ticket.description} />
          <div className="detail__status-container">
            <div className="status-group one">
              <TicketStatsBox title={"Status:"} value={ticket.status}/>
              <TicketStatsBox title={"Priority:"} value={ticket.priority}/>
            </div>
            <div className="status-group two">
              <TicketStatsBox title={"Type:"} value={ticket.type}/>
              <TicketStatsBox title={"Submitter:"} value={ticket.submitter}/>
            </div>
            <div className="status-group three">
              <TicketStatsBox title={"Deadline:"} value={ticket.deadline}/>
              <TicketStatsBox title={"Last Updated On:"} value={ticket.updated_at}/>
            </div>
          </div>
          <div className="detail__actions">
            <ButtonUI
              variant='contained'
              onClick={() => openNoteModal()}
            >
              <FaRegEdit className='btn-icon'/> Add Note
            </ButtonUI>
            <ButtonUI
              variant='contained'
              onClick={() => openNewCommentModal()}
            >
              <FaPlusCircle className='btn-icon'/> New Comment
            </ButtonUI>
          </div>
          {addNoteModal ? (
            <AddNoteModal setAddNoteModal={setAddNoteModal} />
          ) : (
            null
          )}
          {commentModal ? (
            <NewCommentModal setCommentModal={setCommentModal} />
          ) : (
            null
          )}
          <PaperUI className="detail__notes list-devs paper">
            <Typography variant='h3' className='sub-header'>
              Assigned Developer
            </Typography>
            <div className="notes-username">
              <span className="username">{ticket.assignedUser}</span>
              <FaUserEdit className='edit-icon' onClick={() => editAssignedUserHandler()}/>
            </div>
          </PaperUI>
          <PaperUI className="detail__notes list-container paper">
            <Typography variant="h3" className="sub-header">Ticket Notes</Typography>
            <div className="notes-list">
              {notes.length > 0 ? (<>
                {notes.map((item, index) => (
                  <div className="list-item" key={index}>
                    <PaperUI className="item paper" >
                      <Typography variant='body2'>{item.note}</Typography>
                        {user.id === item.user_id || user.role === "Admin" ? (
                          <FaRegWindowClose className='item-icon' onClick={() => deleteNoteHandler(ticket.id, item.id)}/>
                        ) : (
                          null
                        )}
                    </PaperUI>
                  </div>
                ))}</>
              ) : (
                <Typography variant="body2" className='statement'>No notes available...</Typography>
              )}
            </div>
          </PaperUI>
        </section>
        <section className="right ticket-detail">
          <PaperUI className="right-container paper">
            {comments.length > 0 ? (
              <CommentsList
                comments={comments}
                loading={projectLoading}
                page={page}
                pages={pages}
              />
            ) : (
              <PaperUI className="detail__description paper">
                no comments found...
              </PaperUI>
            )}
          </PaperUI>
        </section>
      </div>
    </section>
  );
};
export default Ticket;
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
    let ticketID = context.params.ticketId;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    await store.dispatch(getTicket({ticket_id: ticketID, cookie: validCookieAuth}));

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
Ticket.getLayout = function getLayout(Ticket) {
  return <DetailLayout>{Ticket}</DetailLayout>
};