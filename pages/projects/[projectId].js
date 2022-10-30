import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import store from '@/redux/store';
import { logout } from "@/redux/features/auth/authSlice";
import { getDataGSSP, getData } from "@/utils/fetchData";
import { toast } from 'react-toastify';
import { FaPlusCircle, FaPlusSquare, FaArrowAltCircleUp } from 'react-icons/fa';
import { Card, Divider, List, ListItem, ListItemIcon, 
ListItemText, Typography } from '@mui/material';
import ButtonUI from '@/components/UI/ButtonUI';
import DetailLayout from '@/components/layouts/DetailLayout';
import NewCommentModal from '@/components/modals/NewCommentModal';
import NewTicketModal from '@/components/modals/NewTicketModal';
import MyTicketsList from '@/components/dashBoard/MyTicketsList';
import MyProjectsList from '@/components/dashBoard/MyProjectsList';
import CommentsTextArea from '@/components/details/CommentsTextArea';
import Description from '@/components/details/Description';
import Upload from '@/components/details/Upload';
import { getProject, rehydrate } from '@/redux/features/project/projectSlice';

const Project = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { project, tickets, loading: projectLoading } = useSelector(state => state.project);
  console.log("token")
  console.log(token)
  console.log("inital project details")
  console.log(initialState)
  console.log("project details")
  console.log(project)
  console.log("ticket")
  console.log(tickets)
  // const [commentModal, setCommentModal] = useState(false);
  const [ticketModal, setTicketModal] = useState(false);
  
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
    
  const createNewTicketHandler = () => {
    setTicketModal(ticketModal = true);
  };
    

  return (
    <section className="detail detail__container">
      {ticketModal && (
        <NewTicketModal setTicketModal={setTicketModal} />
      )}
      <div className="detail__header">
        <div className="detail__info-box left">
          Title of the Ticket
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
          # of Tickets: 11 / # of Memebers: 09
        </div>
      </div>
      <div className="detail__sub-header">
        <span className="title">Title</span>
        <div className="stats-container">
          <span className="stats">Priority</span>
          <span className=""> | </span>
          <span className="stats">Status</span>
        </div>
        <span className="date">
          Created On: 11/10/2022
        </span>
      </div>
      <div className="detail__content">
        <section className="left">
          Project Description:
          <Description/>
          <div className="detail__actions">
            <ButtonUI
              variant='contained'
              onClick={() => createNewTicketHandler()}
            >
              <FaPlusCircle className='btn-icon'/> New Ticket
            </ButtonUI>
          </div>
          {/* <CommentsTextArea /> */}
        </section>
        <section className="right">
          If tickets details page show comments list here, details include username, email, f_name, created_at, updated_at (for comment), and comment desc. If project details page then show a list of all tickets assigned to project.
          {/* {urlContext === "projects" ? (
          <MyProjectsList />
        ) : urlContext === "tickets" ? (
          <MyTicketsList />
        ) : (
          <div className="">
            no items found...
          </div>
        )} */}
          {/* <Upload /> */}
        </section>
      </div>
    </section>
  );
};
export default Project;
/* project ids
  phone_book_app
  3622cdf0-458a-442b-b37c-e4ceb5924bc4

  recipe_app
  5095e06a-9255-4fc7-a071-d37ab05e0f7f

  weather_app
  c41f610f-2141-4842-85f2-003c25235e49

  news_app
  8f0839be-3219-490c-b1d8-7aa58eecf6b8

  retro_game_app [has 4 tickets]
  5c675702-46b4-4c1b-8f9b-8922c4e83b8e

  restaurant_app [has 7 tickets]
  023f4147-b35e-4d3a-bd89-a2c05dc93625
*/
// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
/*
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ params }) => {
      // we can set the initial state from here
      await store.dispatch(setAuthState(false));

      console.log("State on server", store.getState());

      return {
        props: {
          authState: false,
        },
      };
    }
);
*/
// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++
// ++++++++++++++++++++++++++++++++++++++++




export const getServerSideProps = async (context) => {
  console.log("^^^^^^^^^^^^^^^^^^^")
  // console.log("context")
  // console.log(context)
  console.log("^^^^^^^^^^^^^^^^^^^")
  console.log("context.query")
  console.log(context.query)
  console.log("context.params")
  console.log(context.params)
  
  try {
    const paramType = context.params.hasOwnProperty("projectId") ? 'projectId' : context.params.hasOwnProperty("ticketId") ? 'ticketId' : '';
    const detailPageType = paramType;
    // let token = context.req;
    let token = context.req.cookies;
    // let token = context.req.cookies.qual__token;
    let userInfo = context.req.cookies.qual__user;
    let projectInfo;
    let ticketInfo;
    
    // let loadFeedBtn = false;
    // let keyword = context.query.keyword || '';
    // let category = context.query.category || '';
    // let tag = context.query.tag || '';
    // let page = context.query.page || 1;
    // let pageNumber = context.query.pageNumber || 1;
    // let offsetItems = context.query.itemsPerPage || 12;
    // let initGeneralFeed;

    // if (keyword || tag || category) {
    //   loadFeedBtn = true;
    // };
    // if (category === "All") {
    //   category = "";
    //   loadFeedBtn = false;
    // };
    console.log("token")
    console.log(token)
    console.log("detailPageType")
    console.log(detailPageType)

    if (token && (detailPageType == "projectId" || detailPageType === "ticketId")) {
      if (detailPageType === "projectId") {
        console.log("searching via project id")
        let projectID = context.params.projectId;
        console.log("projectID")
        console.log(projectID)
        let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
        console.log("~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~")
        console.log("validCookieAuth")
        console.log(validCookieAuth)
        console.log("~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~")
        projectInfo = await store.dispatch(getProject({project_id: projectID, cookie: validCookieAuth}));
        // projectInfo = await getData(`/projects/${context.params.projectId}`)
        // projectInfo = await getDataGSSP(`/projects/${context.params.projectId}`, context.req ? { cookie: context.req.headers.cookie } : undefined)
        // await dispatch(get thedate);
        console.log("projectInfo")
        console.log(projectInfo)
        console.log("######################")
        console.log("get state")
        console.log(store.getState())
      };
      if (detailPageType === "ticketId") {
        console.log("searchign via ticket id")
        // ticketInfo = await getData(`/tickets/${context.params.ticketId}`)
        ticketInfo = await getDataGSSP(`/tickets/${context.params.ticketId}`, context.req ? { cookie: context.req.headers.cookie } : undefined)
        console.log("ticketInfo")
        console.log(ticketInfo)
        // TODO: either commit a dispatch after a url req, thus using an action to commit the data to state, or use a dispatch to do all of the heavy lifting, making the url call and data to state, thus i will have to only pass the cookie header to the fetch call
      };
      // initGeneralFeed = await getData(`/posts?keyword=${keyword}&category=${category}&tag=${tag}&page=${page}&pageNumber=${pageNumber}`, context.req ? { cookie: context.req.headers.cookie } : undefined);
      
      // const initTrendingFeed = await getData(`/posts/trending`, context.req ? { cookie: context.req.headers.cookie } : undefined);

      // const initFollow = await getData(`/user/follow/status`, context.req ? { cookie: context.req.headers.cookie } : undefined);
      console.log("OO||OO}|} GSSP {|{OO||OO")
      console.log("projectInfoData")
      console.log(projectInfo)
      console.log("------------------------")
      let finalData = store.getState();
      let finalAnswer = finalData.project;
      console.log("finalAnswer")
      console.log(finalAnswer)

      console.log("----------FINISH FOR PROPS--------------")
      return {
        props: {
          initialState: store.getState(),
          // initialData: finalAnswer,
          // initialData: projectInfo.data,
          // initialData: store.getState(),
          // ticketInfo: ticketInfo ? ticketInfo.data : [],
          // initGeneral: initGeneralFeed.data,
          // initTrend: initTrendingFeed.data.defaultTrends,
          // initFollow: initFollow.data.followers,
          token: token,
          // feedBtn: loadFeedBtn
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
        // data: "",
        // initGeneral: [],
        // initTrend: [],
        // initFollow: [],
        token: "",
        // feedBtn: ""
      }
    }
  } catch (err) {
    console.error(err);
    return {
      props: {
        // data: "",
        // initGeneral: [],
        // initTrend: [],
        // initFollow: [],
        token: ""
      }
    }
  }
};

















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
}