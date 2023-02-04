import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import store from '@/redux/store';
import { logout } from "@/redux/features/auth/authSlice";
import { getDataGSSP, getData } from "@/utils/fetchData";
import { toast } from 'react-toastify';
import { FaPlusCircle, FaRegEdit, FaArrowAltCircleUp } from 'react-icons/fa';
import { Card, Divider, List, ListItem, ListItemIcon, 
ListItemText, Typography } from '@mui/material';
import ButtonUI from '@/components/UI/ButtonUI';
import DetailLayout from '@/components/layouts/DetailLayout';
import NewCommentModal from '@/components/modals/NewCommentModal';
import NewTicketModal from '@/components/modals/NewTicketModal';
import MyTicketsList from '@/components/lists/MyTicketsList';
import MyProjectsList from '@/components/lists/MyProjectsList';
import CommentsTextArea from '@/components/details/CommentForm';
import Description from '@/components/details/Description';
import Upload from '@/components/details/Upload';
import { getProject, rehydrate } from '@/redux/features/project/projectSlice';

const Project = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { project, tickets, loading: projectLoading } = useSelector(state => state.project); // ---
  const [ticketModal, setTicketModal] = useState(false);
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
  
  // todo - seems to fix hydration error
  if (!hasMounted) {
    return null;
  };

  const openNewTicketModal = () => {
    setTicketModal(ticketModal = true);
  };

  const openDescriptionModal = () => {
    console.log("editing description of porject")
  }

  return (
    <section className="detail detail__container">
      {ticketModal && (
        <NewTicketModal setTicketModal={setTicketModal} />
      )}
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
          # of Tickets: {tickets.length} / # of Memebers: 09
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
      <div className="detail__content">
        <section className="left">
          <Description description={project.description} />
          <div className="detail__actions">
            <ButtonUI
              variant='contained'
              onClick={() => openDescriptionModal()}
            >
              <FaRegEdit className='btn-icon'/> Edit Description
            </ButtonUI>
            <ButtonUI
              variant='contained'
              onClick={() => openNewTicketModal()}
            >
              <FaPlusCircle className='btn-icon'/> New Ticket
            </ButtonUI>
          </div>
        </section>
        <section className="right">
          <Card className="list-header">
            <Typography
              variant="h6"
              component="h6"
            >
              Project Tickets
            </Typography>
          </Card>
          <Card className="detail__items-list">
            {tickets.length > 0 ? (
              <MyTicketsList tickets={tickets} />
            ) : (
              <div className="detail__description">
                no tickets found...
              </div>
            )}
          </Card>
        </section>
      </div>
    </section>
  );
};
export default Project;
// TODO: this gssp works. May want to refactor to work only for priject details
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token;
    
    token ? token : null;
    console.log("token")
    console.log(token)
    console.log(null)
    if (!token) {
      return {
        redirect: {
          // todo: use urls to init toast on signin page - on signin page search for param, if found init toast
          destination: `/signin?session_expired=true`,
          permanent: false,
        },
        props: {},
      };
    };
    
    let userInfo = context.req.cookies.qual__user;
    let projectID = context.params.projectId;
    let projectInfo;
    // TODO: validCookieAuth only ussed to dev. Remove for prod is token is all you need
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;

    projectInfo = await store.dispatch(getProject({project_id: projectID, cookie: validCookieAuth}));

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
        // data: "",
        // initGeneral: [],
        // initTrend: [],
        // initFollow: [],
      }
    }
  }
};





// ORIGINAL VERSION BEFORE REFACTOR:
// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
// export const getServerSideProps = async (context) => {
//   console.log("^^^^^^^^^^^^^^^^^^^")
//   // console.log("context")
//   // console.log(context)
//   console.log("^^^^^^^^^^^^^^^^^^^")
//   console.log("context.query")
//   console.log(context.query)
//   console.log("context.params")
//   console.log(context.params)
  
//   try {
//     const paramType = context.params.hasOwnProperty("projectId") ? 'projectId' : context.params.hasOwnProperty("ticketId") ? 'ticketId' : '';
//     const detailPageType = paramType;
//     // let token = context.req;
//     // let token = context.req.cookies;
//     let token = context.req.cookies.qual__token;
//     let userInfo = context.req.cookies.qual__user;
//     let projectInfo;
//     let ticketInfo;
    
//     // let loadFeedBtn = false;
//     // let keyword = context.query.keyword || '';
//     // let category = context.query.category || '';
//     // let tag = context.query.tag || '';
//     // let page = context.query.page || 1;
//     // let pageNumber = context.query.pageNumber || 1;
//     // let offsetItems = context.query.itemsPerPage || 12;
//     // let initGeneralFeed;

//     // if (keyword || tag || category) {
//     //   loadFeedBtn = true;
//     // };
//     // if (category === "All") {
//     //   category = "";
//     //   loadFeedBtn = false;
//     // };
//     console.log("token")
//     console.log(token)
//     console.log("detailPageType")
//     console.log(detailPageType)

//     if (token && (detailPageType == "projectId" || detailPageType === "ticketId")) {
//       if (detailPageType === "projectId") {
//         console.log("searching via project id")
//         let projectID = context.params.projectId;
//         console.log("projectID")
//         console.log(projectID)
//         let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
//         console.log("~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~")
//         console.log("validCookieAuth")
//         console.log(validCookieAuth)
//         console.log("~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~")
//         projectInfo = await store.dispatch(getProject({project_id: projectID, cookie: validCookieAuth}));
//         // projectInfo = await getData(`/projects/${context.params.projectId}`)
//         // projectInfo = await getDataGSSP(`/projects/${context.params.projectId}`, context.req ? { cookie: context.req.headers.cookie } : undefined)
//         // await dispatch(get thedate);
//         console.log("projectInfo")
//         console.log(projectInfo)
//         console.log("######################")
//         console.log("get state")
//         console.log(store.getState())
//       };
//       if (detailPageType === "ticketId") {
//         console.log("searchign via ticket id")
//         // ticketInfo = await getData(`/tickets/${context.params.ticketId}`)
//         ticketInfo = await getDataGSSP(`/tickets/${context.params.ticketId}`, context.req ? { cookie: context.req.headers.cookie } : undefined)
//         console.log("ticketInfo")
//         console.log(ticketInfo)
//         // TODO: either commit a dispatch after a url req, thus using an action to commit the data to state, or use a dispatch to do all of the heavy lifting, making the url call and data to state, thus i will have to only pass the cookie header to the fetch call
//       };
//       // initGeneralFeed = await getData(`/posts?keyword=${keyword}&category=${category}&tag=${tag}&page=${page}&pageNumber=${pageNumber}`, context.req ? { cookie: context.req.headers.cookie } : undefined);
      
//       // const initTrendingFeed = await getData(`/posts/trending`, context.req ? { cookie: context.req.headers.cookie } : undefined);

//       // const initFollow = await getData(`/user/follow/status`, context.req ? { cookie: context.req.headers.cookie } : undefined);
//       console.log("OO||OO}|} GSSP {|{OO||OO")
//       console.log("projectInfoData")
//       console.log(projectInfo)
//       console.log("------------------------")
//       let finalData = store.getState();
//       let finalAnswer = finalData.project;
//       console.log("finalAnswer")
//       console.log(finalAnswer)

//       console.log("----------FINISH FOR PROPS--------------")
//       return {
//         props: {
//           initialState: store.getState(),
//           // initialData: finalAnswer,
//           // initialData: projectInfo.data,
//           // initialData: store.getState(),
//           // ticketInfo: ticketInfo ? ticketInfo.data : [],
//           // initGeneral: initGeneralFeed.data,
//           // initTrend: initTrendingFeed.data.defaultTrends,
//           // initFollow: initFollow.data.followers,
//           token: token,
//           // feedBtn: loadFeedBtn
//         }
//       }
//       /*
//       if (user && user._id) {
//         return {
//           redirect: {
//             destination: `/profile/${user._id.toString()}`,
//             permanent: false,
//           },
//           props: {},
//         };
//       }
//       */
//     }
//     return {
//       redirect: {
//         destination: "/signin",
//         permanent: false
//       },
//       props: {
//         // data: "",
//         // initGeneral: [],
//         // initTrend: [],
//         // initFollow: [],
//         token: "",
//         // feedBtn: ""
//       }
//     }
//   } catch (err) {
//     console.error(err);
//     return {
//       props: {
//         // data: "",
//         // initGeneral: [],
//         // initTrend: [],
//         // initFollow: [],
//         token: ""
//       }
//     }
//   }
// };

















// export const getServerSideProps = async (context) => {
//   console.log("^^^^^^^^^^^^^^^^^^^")
//   // console.log("context")
//   // console.log(context)
//   console.log("^^^^^^^^^^^^^^^^^^^")
//   console.log("context.query")
//   console.log(context.query)
//   console.log("context.params")
//   console.log(context.params)
//   try {
//     const paramType = context.params.hasOwnProperty("projectId") ? 'projectId' : context.params.hasOwnProperty("ticketId") ? 'ticketId' : '';
//     const detailPageType = paramType;
//     // let token = context.req;
//     let token = context.req.cookies;
//     // let token = context.req.cookies.qual__token;
//     let userInfo = context.req.cookies.qual__user;
//     let projectInfo;
//     let ticketInfo;
    
//     // let loadFeedBtn = false;
//     // let keyword = context.query.keyword || '';
//     // let category = context.query.category || '';
//     // let tag = context.query.tag || '';
//     // let page = context.query.page || 1;
//     // let pageNumber = context.query.pageNumber || 1;
//     // let offsetItems = context.query.itemsPerPage || 12;
//     // let initGeneralFeed;

//     // if (keyword || tag || category) {
//     //   loadFeedBtn = true;
//     // };
//     // if (category === "All") {
//     //   category = "";
//     //   loadFeedBtn = false;
//     // };
//     console.log("token")
//     console.log(token)
//     console.log("detailPageType")
//     console.log(detailPageType)

//     if (token && (detailPageType == "projectId" || detailPageType === "ticketId")) {
//       if (detailPageType === "projectId") {
//         console.log("searching via project id")
//         // projectInfo = await getData(`/projects/${context.params.projectId}`)
//         projectInfo = await getDataGSSP(`/projects/${context.params.projectId}`, context.req ? { cookie: context.req.headers.cookie } : undefined)
//         console.log("projectInfo")
//         console.log(projectInfo)
//       };
//       if (detailPageType === "ticketId") {
//         console.log("searchign via ticket id")
//         // ticketInfo = await getData(`/tickets/${context.params.ticketId}`)
//         ticketInfo = await getDataGSSP(`/tickets/${context.params.ticketId}`, context.req ? { cookie: context.req.headers.cookie } : undefined)
//         console.log("ticketInfo")
//         console.log(ticketInfo)

//       };
//       // initGeneralFeed = await getData(`/posts?keyword=${keyword}&category=${category}&tag=${tag}&page=${page}&pageNumber=${pageNumber}`, context.req ? { cookie: context.req.headers.cookie } : undefined);
      
//       // const initTrendingFeed = await getData(`/posts/trending`, context.req ? { cookie: context.req.headers.cookie } : undefined);

//       // const initFollow = await getData(`/user/follow/status`, context.req ? { cookie: context.req.headers.cookie } : undefined);

//       return {
//         props: {
//           initialData: projectInfo.data,
//           // ticketInfo: ticketInfo ? ticketInfo.data : [],
//           // initGeneral: initGeneralFeed.data,
//           // initTrend: initTrendingFeed.data.defaultTrends,
//           // initFollow: initFollow.data.followers,
//           token: token,
//           // feedBtn: loadFeedBtn
//         }
//       }
//       /*
//       if (user && user._id) {
//         return {
//           redirect: {
//             destination: `/profile/${user._id.toString()}`,
//             permanent: false,
//           },
//           props: {},
//         };
//       }
//       */
//     }
//     return {
//       redirect: {
//         destination: "/signin",
//         permanent: false
//       },
//       props: {
//         // data: "",
//         // initGeneral: [],
//         // initTrend: [],
//         // initFollow: [],
//         token: "",
//         // feedBtn: ""
//       }
//     }
//   } catch (err) {
//     console.error(err);
//     return {
//       props: {
//         // data: "",
//         // initGeneral: [],
//         // initTrend: [],
//         // initFollow: [],
//         token: ""
//       }
//     }
//   }
// };

Project.getLayout = function getLayout(Project) {
  return <DetailLayout>{Project}</DetailLayout>
};