import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store from '@/redux/store';
import { logout } from "@/redux/features/auth/authSlice";
import { toast } from 'react-toastify';
import { FaPlusCircle } from 'react-icons/fa';
import { Typography } from '@mui/material';
import ButtonUI from '@/components/UI/ButtonUI';
import DetailLayout from '@/components/layouts/DetailLayout';
import NewTicketModal from '@/components/modals/NewTicketModal';
import ManagePersonnelModal from '@/components/modals/ManagePersonnelModal';
import MyTicketsList from '@/components/lists/MyTicketsList';
import UsersList from '@/components/lists/UsersList';
import Description from '@/components/details/Description';
import { getProject, rehydrate } from '@/redux/features/project/projectSlice';
import PaperUI from '@/components/UI/PaperUI';

const Project = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { project, tickets, loading: projectLoading } = useSelector(state => state.project); // ---
  const { assignedUsers, unassignedUsers } = useSelector(state => state.user);
  const [ticketModal, setTicketModal] = useState(false);
  const [managePersonnelModal, setManagePersonnelModal] = useState(false);
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

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  // seems to fix hydration error
  if (!hasMounted) {
    return null;
  };

  const openNewTicketModal = () => {
    setTicketModal(ticketModal = true);
  };

  const openManagePersonnelModal = () => {
    setManagePersonnelModal(managePersonnelModal => managePersonnelModal = true);
  };

  // const openDescriptionModal = () => {
  //   console.log("editing description of porject")
  // }

  return (
    <section className="detail detail__container">
      {ticketModal && (
        <NewTicketModal projectId={project.id} setTicketModal={setTicketModal} />
      )}
      {managePersonnelModal && (
        <ManagePersonnelModal projectId={project.id} setManagePersonnelModal={setManagePersonnelModal} assignedUsers={assignedUsers} unassignedUsers={unassignedUsers}/>
      )}
      <div className="detail__header">
        <div className="detail__info-box left">
          <Typography variant="h2">Project Details</Typography>
          <div className="buttons">
            <Link
              href={`/projects/${project.id}/edit`}
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
                // href={`/projects/${project.id}/delete`}
                href={`/projects/${project.id}/edit`}
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
          Tickets: {tickets.length} / Members: {assignedUsers.length}
        </div>
      </div>
      <div className="detail__sub-header">
        <span className="title">{project.title}</span>
        <div className="stats-container">
          <span>{project.id}</span>
        </div>
        <span className="date">
          Created On: {project.created_at}
        </span>
      </div>
      <div className="detail__content detail-page project-page">
        <section className="left">
          <Description description={project.description} />
          <div className="detail__actions">
            {/* <ButtonUI
              variant='contained'
              onClick={() => openDescriptionModal()}
            >
              <FaRegEdit className='btn-icon'/> Edit Description
            </ButtonUI> */}
            <ButtonUI
              variant='contained'
              onClick={() => openNewTicketModal()}
            >
              <FaPlusCircle className='btn-icon'/> New Ticket
            </ButtonUI>
          </div>
          {user.role === "Admin" && isAuthenticated ? (
            <div className="detail__users section">
              <UsersList projectId={project.id} openModal={openManagePersonnelModal} assignedUsers={assignedUsers} unassignedUsers={unassignedUsers}/>
            </div>
          ) : (
            null
          )}
        </section>
        <section className="right project-detail">
          <PaperUI className="list-header paper">
            <Typography variant="h3">
              Project Tickets
            </Typography>
          </PaperUI>
          <PaperUI className="detail__items-list paper">
            {tickets.length > 0 ? (
              <MyTicketsList tickets={tickets} />
            ) : (
              <PaperUI className="detail__description paper">
                no tickets found...
              </PaperUI>
            )}
          </PaperUI>
        </section>
      </div>
    </section>
  );
};
export default Project;
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
          // url to init toast on signin page - on signin page search for param, if found init toast
          destination: `/signin?session_expired=true`,
          permanent: false,
        },
        props: {},
      };
    };
    
    // let userInfo = context.req.cookies.qual__user;
    let projectID = context.params.projectId;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    await store.dispatch(getProject({project_id: projectID, cookie: validCookieAuth}));

    return {
      props: {
        initialState: store.getState(),
        token: token
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
Project.getLayout = function getLayout(Project) {
  return <DetailLayout>{Project}</DetailLayout>
};