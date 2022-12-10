import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import store from '@/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { FaPlusCircle, FaPlusSquare, FaArrowAltCircleUp } from 'react-icons/fa';
import { logout } from "@/redux/features/auth/authSlice";
import { getTicket, rehydrate, createTicketComment } from "@/redux/features/project/projectSlice";
import { getDataSSR, getDataGSSP, getData } from "@/utils/fetchData";
import { Card, Divider, List, ListItem, ListItemIcon, 
ListItemText, Typography } from '@mui/material';
import ButtonUI from '@/components/UI/ButtonUI';
import DetailLayout from '@/components/layouts/DetailLayout';
import NewCommentModal from '@/components/modals/NewCommentModal';
import CommentsList from '@/components/lists/CommentsList';
import CommentsTextArea from '@/components/details/CommentForm';
import Description from '@/components/details/Description';
import Upload from '@/components/details/Upload';
import { getProject} from '@/redux/features/project/projectSlice';
/*
pg_dump --no-privileges --format custom --file heroku_archive \
postgres://youruserid:yourpassword@ec2-yourec2host.compute-1.amazonaws.com:5432/yourdatabaseid
*/
const Ticket = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { ticket, comments, history, loading: projectLoading } = useSelector(state => state.project);
  const { user } = useSelector(state => state.auth);
  // const [message, setMessage] = useState("");
  // const [formData, setFormData] = useState({
  //   message: "",
  //   upload: ""
  // });

  // const { message, upload } = formData;
  const [commentModal, setCommentModal] = useState(false);
  
  useEffect(() => {
    if (!token || !Cookies.get("qual__isLoggedIn")) {
      dispatch(logout());
      toast.success("Token or authorization expired.")
      return router.push("/");
    }
    // setIsLoading(false);
  }, []);
  
  useEffect(() => {
    dispatch(rehydrate(initialState.project))
  }, [dispatch, initialState])
    
  const openNewCommentModal = () => {
    setCommentModal(true);
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
          Project Details
          <div className="buttons">
            <ButtonUI
              className="btn-one"
              variant="contained"
            >
              Edit
            </ButtonUI>
            <ButtonUI
              variant="contained"
            >
              Delete
            </ButtonUI>
          </div>
        </div>
        <div className="detail__info-box right">
          # of Comments: {comments.length} / # of Memebers: 09
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
      <div className="detail__content">
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
              ticketID={ticket.id} 
              // message={message}
              // setMessage={setMessage}
              // submitMsg={submitCommentHandler}
            />
          ) : (
            null
          )}
        </section>
        <section className="right">
          <Card>
            {comments.length > 0 ? (
              <CommentsList comments={comments} />
            ) : (
              <div className="">
                no comments found...
              </div>
            )}
          </Card>
        </section>
      </div>
    </section>
  );
};
export default Ticket;
Ticket.getLayout = function getLayout(Ticket) {
  return <DetailLayout>{Ticket}</DetailLayout>
};

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
      /*
      if (user && user._id) {
        return {
          redirect: {
            destination: `/profile/${user._id.toString()}`,
            permanent: false,
          },
          props: {},
        };
      }
      */
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