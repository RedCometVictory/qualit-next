import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import store from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import { getUserProfile, rehydrate } from "@/redux/features/user/userSlice";
import { Divider, Typography } from "@mui/material";
import DetailLayout from "@/components/layouts/DetailLayout";
import ButtonUI from "@/components/UI/ButtonUI";
import PaperUI from "@/components/UI/PaperUI";

const UserView = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector(state => state.user);
  const { detail, tickets, projects } = user;
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
    dispatch(rehydrate(initialState.user))
  }, [dispatch, initialState]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const UserStatsBox = ({title, value}) => {
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
  
  const ProjectsList = ({id, title, status, owner}) => {
    return (
      <div className="status-column user-proj-item">
        <PaperUI
          className="detail__description paper user-proj-list"
        >
          <Typography variant="h4">
            <Link
              href={`/projects/${id}`}
              passHref
            >
              {title}
            </Link>
          </Typography>
          <Divider />
          <div className="proj-box">
            <Typography variant="body1">{status ? status : "N/A"}</Typography>
            <Typography variant="body1">{"N/A"}</Typography>
            {/* <Typography variant="body1">{owner ? owner : "N/A"}</Typography> */}
          </div>
          <div className="proj-box">
            {/* <Typography variant="body1">{status ? status : "N/A"}</Typography> */}
            <Typography variant="body1">Owner: </Typography>
            <Typography variant="body1">{owner ? owner : "N/A"}</Typography>
          </div>
        </PaperUI>
      </div>
    )
  };

  // return (
  //   <section className="ticket detail detail__container">User Details</section>
  // )
  return (
    <section className="ticket detail detail__container">
      <div className="detail__header">
        <div className="detail__info-box left">
          <Typography variant="h2">User Details</Typography>
          <div className="buttons">
            <Link
              href={`/users/${user.id}/edit`}
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
            <Link
              // href={`/tickets/${ticket.id}/edit`}
              href={`/users`}
              passHref
            >
              <ButtonUI
                className="btn-one"
                variant="contained"
                color="primary"
              >
                User List
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
          {/* Comments: {pages} */}
        </div>
      </div>
      <div className="detail__sub-header">
        {/* <span className="title">{ticket.title}</span> */}
        <div className="stats-container">
          <span>{detail.id}</span>
        </div>
        <span className="date">
          Joined On: {detail.created_at}
        </span>
      </div>
      <div className="detail__content detail-page ticket-page">
        <section className="left">
          {/* <PaperUI
            className="detail__description user-detail paper"
          >
            {"description us weo wecinwpei eowepcion piecn woeicnwoeic ecinoweic oiiecn owjecnowien oicnoc a s oapc"}
          </PaperUI> */}
          <div className="detail__status-container">
            <div className="status-group one">
              <UserStatsBox title={"FullName:"} value={`${detail.f_name} ${detail.l_name}`}/>
              <UserStatsBox title={"UserName:"} value={detail.username}/>
            </div>
            <div className="status-group two">
              <UserStatsBox title={"E-mail:"} value={detail.email}/>
              <UserStatsBox title={"Role:"} value={detail.role}/>
            </div>
          </div>
          {/* <div className="detail__actions">
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
          </div> */}
          
          {/* {addNoteModal ? (
            <AddNoteModal setAddNoteModal={setAddNoteModal} />
          ) : (
            null
          )}
          {commentModal ? (
            <NewCommentModal setCommentModal={setCommentModal} />
          ) : (
            null
          )} */}

          <PaperUI className="detail__notes list-devs paper">
            <Typography variant='h3' className='sub-header'>
              Assigned Tickets
            </Typography>
            <div className="notes-username">
              {/* <span className="username">{ticket.assignedUser}</span> */}
              {/* <FaUserEdit className='edit-icon' onClick={() => editAssignedUserHandler()}/> */}
            </div>
          </PaperUI>
          <PaperUI className="detail__notes list-container paper">
            <Typography variant="h3" className="sub-header">Ticket Notes</Typography>
            <div className="notes-list">
              {tickets.length > 0 ? (<>
                {tickets.map((ticket, index) => (
                  <div className="list-item" key={index}>
                    <PaperUI className="item paper" >
                      <Typography variant='h4'>
                      <Link
                        href={`/tickets/${ticket.id}`}
                        passHref
                      >
                        {ticket.title}
                      </Link>
                      </Typography>
                      <Typography variant="body1">
                        <Typography variant="body1">{`Status: ${ticket.status}`}</Typography>
                        <Typography variant="body1">{`Priority: ${ticket.priority}`}</Typography>
                      </Typography>
                    </PaperUI>
                  </div>
                ))}</>
              ) : (
                <Typography variant="body2" className='statement'>No assigned tickets...</Typography>
              )}
            </div>
          </PaperUI>
        </section>
        <section className="right ticket-detail">
          <PaperUI className="right-container paper user-proj-list">
            {projects.length > 0 ? (<>
              {projects.map((project, index) => (
                <div className="" key={index}>
                  <ProjectsList
                    // key={index}
                    id={project?.id}
                    title={project?.title}
                    status={project?.status}
                    owner={`${project?.f_name} ${project?.l_name}`}
                  />
                </div>
              ))}
            </>) : (
              <PaperUI className="detail__description paper">
                no projects found...
              </PaperUI>
            )}
          </PaperUI>
        </section>
      </div>
    </section>
  )
};
export default UserView;
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
    let userId = context.params.userId;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    await store.dispatch(getUserProfile({user_id: userId, cookie: validCookieAuth}));

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
UserView.getLayout = function getLayout(UserView) {
  return <DetailLayout>{UserView}</DetailLayout>
};