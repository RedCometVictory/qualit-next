import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import store from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { FaPlusCircle, FaPlusSquare, FaArrowAltCircleUp } from 'react-icons/fa';
import { logout } from "@/redux/features/auth/authSlice";
import { getTicket, rehydrate } from "@/redux/features/project/projectSlice";
// import { getDataSSR, getDataGSSP, getData } from "@/utils/fetchData";
// import { getProject } from '@/redux/features/project/projectSlice';
import { Card, Divider, List, ListItem, ListItemIcon, 
ListItemText, Typography } from '@mui/material';
import { orange } from '@mui/material/colors';
import ButtonUI from '@/components/UI/ButtonUI';
import PaperUI from '@/components/UI/PaperUI';
import DetailLayout from '@/components/layouts/DetailLayout';
import NewCommentModal from '@/components/modals/NewCommentModal';
import CommentsList from '@/components/lists/CommentsList';
// import CommentsTextArea from '@/components/details/CommentForm';
import Description from '@/components/details/Description';
// import Upload from '@/components/details/Upload';

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
    
  const openNewCommentModal = () => {
    setCommentModal(true);
  };

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  };

  // const submitCommentHandler = async (e) => {
  //   e.preventDefault();
  //   // const formData = {id: user.id, message: message};
  //   // const formData = message;

  //   console.log("submitted comment")
  //   setCommentModal(false);
  //   console.log("(((formData)))")
  //   console.log(formData);
  //   // await dispatch(createTicketComment({ticket_id: ticket.id, formData: { formData}}));
  //   await dispatch(createTicketComment({ticket_id: ticket.id, formData}));
  //   // setMessage(message = '')
  //   setFormData({message: "", upload: ""});
  // };

  return (
    <section className="ticket detail detail__container">
      {/* {commentModal && (
        <NewCommentModal setCommentModal={setCommentModal} />
      )} */}
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
            <ButtonUI
              variant="contained"
              // color='secondary'
            >
              Delete
            </ButtonUI>
          </div>
        </div>
        <div className="detail__info-box right">
          Comments: {pages} / Members: 09
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
              onClick={() => openNewCommentModal()}
            >
              <FaPlusCircle className='btn-icon'/> New Comment
            </ButtonUI>
          </div>
          {commentModal ? (
            <NewCommentModal
              setCommentModal={setCommentModal}
              // ticketID={ticket.id} 
              // message={message}
              // setMessage={setMessage}
              // submitMsg={submitCommentHandler}
            />
          ) : (
            null
          )}
        </section>
        <section className="right ticket-detail">
          <PaperUI className="right-container paper">
            {comments.length > 0 ? (
              <CommentsList
                // key={}
                comments={comments}
                loading={projectLoading}
                page={page}
                pages={pages}
              />
            ) : (
              <div className="">
                no comments found...
              </div>
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
    let ticketID = context.params.ticketId;
    // let ticketInfo;
    // TODO: validCookieAuth only ussed to dev. Remove for prod is token is all you need
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;

    // TODO: attempt to only pass token, not all cookies necessary to pass
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
        // data: "",
        // initGeneral: [],
        // initTrend: [],
        // initFollow: [],
      }
    }
  }
};
Ticket.getLayout = function getLayout(Ticket) {
  return <DetailLayout>{Ticket}</DetailLayout>
};
/*
export const getServerSideProps = async (context) => {
  try {
    const paramType = context.params.hasOwnProperty("projectId") ? 'projectId' : context.params.hasOwnProperty("ticketId") ? 'ticketId' : '';
    const detailPageType = paramType;
    // let token = context.req.cookies;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    let token = context.req.cookies.qual__token;
    let userInfo = context.req.cookies.qual__user;
    let projectInfo;
    let ticketInfo;

    if (token && detailPageType === "ticketId") {
      if (detailPageType === "projectId") {
        let projectID = context.params.projectId;
        projectInfo = await store.dispatch(getProject({project_id: projectID, cookie: validCookieAuth}));
      };
      if (detailPageType === "ticketId") {
        let ticketID = context.params.ticketId;
        ticketInfo = await store.dispatch(getTicket({ticket_id: ticketID, cookie: validCookieAuth}));
        // TODO: either commit a dispatch after a url req, thus using an action to commit the data to state, or use a dispatch to do all of the heavy lifting, making the url call and data to state, thus i will have to only pass the cookie header to the fetch call
      };

      return {
        props: {
          initialState: store.getState(),
          token: token,
        }
      }
      /
      if (user && user._id) {
        return {
          redirect: {
            destination: `/profile/${user._id.toString()}`,
            permanent: false,
          },
          props: {},
        };
      }
      /
    }
    return {
      redirect: {
        destination: "/signin",
        permanent: false
      },
      props: {
        initialState: null,
        token: "",
      }
    }
  } catch (err) {
    console.error(err);
    return {
      props: {
        token: ""
      }
    }
  }
};
*/