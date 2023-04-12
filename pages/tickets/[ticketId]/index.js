import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import store from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaPlusCircle, FaRegEdit } from 'react-icons/fa';
import { logout } from "@/redux/features/auth/authSlice";
import { getTicket, rehydrate } from "@/redux/features/project/projectSlice";
import ButtonUI from '@/components/UI/ButtonUI';
import PaperUI from '@/components/UI/PaperUI';
import DetailLayout from '@/components/layouts/DetailLayout';
import NewCommentModal from '@/components/modals/NewCommentModal';
import CommentsList from '@/components/lists/CommentsList';
import Description from '@/components/details/Description';

const Ticket = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { ticket, comments, history, loading: projectLoading, page, pages } = useSelector(state => state.project);
  const { user } = useSelector(state => state.auth);
  const [commentModal, setCommentModal] = useState(false);
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
    console.log("adding a new note to list")
    // setCommentModal(true);
  };
  const openNewCommentModal = () => {
    setCommentModal(true);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) return null;

  return (
    <section className="ticket detail detail__container">
      <div className="detail__header">
        <div className="detail__info-box left">
          Ticket Details
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
          Comments: {pages} / Members: ?
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
          {commentModal ? (
            <NewCommentModal
              setCommentModal={setCommentModal}
            />
          ) : (
            null
          )}
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