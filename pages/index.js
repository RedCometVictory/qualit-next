import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { getDashboardInfo } from '@/redux/features/project/projectSlice';
import MainLayout from "@/components/layouts/MainLayout";
import PaperUI from '@/components/UI/PaperUI';
import ButtonUI from '@/components/UI/ButtonUI';
import { Typography } from "@mui/material";
import BarChart from '@/components/dashBoard/BarChart';
import PieChart from '@/components/dashBoard/PieChart';
import MyProjectsList from '@/components/lists/MyProjectsList';
import MyTicketsList from '@/components/lists/MyTicketsList';
import authIsExpired from '@/utils/verifAuth';

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const effectRan = useRef(false);
  const { isAuthenticated, user, loading: authLoading } = useSelector(state => state.auth);
  const { projects, tickets, loading: projectLoading } = useSelector(state => state.project);
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getDashboardInfo());
    }
    console.log("****projData****")
    console.log(tickets)
    console.log(projects)
    console.log("-=-=-=-=-=-=-=-=-=-")
    // console.log(authLoading)
    console.log(projectLoading)
    console.log("-=-=-=-=-=-=-=-=-=-")

    console.log("****projData**END**")
    // if (effectRan.current === true || process.env.NEXT_PUBLIC_NODE_ENV !== 'development') {
    // //   console.log('effectRan-inner')
    // //   console.log(effectRan)
    // // };
    // // return () => {
    // //   console.log('unmounted')
    // //   effectRan.current = true;
    // //   console.log('effectRan-02')
    // //   console.log(effectRan)
    // // };
    // }
  }, [dispatch]);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) {
    return null;
  }
  
  // TODO: filter through tickets array for values of the diff status types and priority types, split the resulting values into priorityStats and typeStats and push the ticket array itself into the "My tickets comp"
  let ticketStatusCount = {
    statusNew: 0,
    statusOpen: 0,
    statusOnHold: 0,
    statusInProgress: 0,
    statusClosed: 0,
    statusUnconfirmed: 0,
  };
  let ticketPriorityCount = {
    priorityUrgent: 0,
    priorityHigh: 0,
    priorityMedium: 0,
    priorityLow: 0,
    priorityNone: 0,
  };
  if (tickets && tickets.length > 0) {
    ticketStatusCount.statusNew = tickets.filter(indx => indx.status === "New").length;
    ticketStatusCount.statusOpen = tickets.filter(indx => indx.status === "Open").length;
    ticketStatusCount.statusOnHold = tickets.filter(indx => indx.status === "On Hold").length;
    ticketStatusCount.statusInProgress = tickets.filter(indx => indx.status === "In Progress").length;
    ticketStatusCount.statusClosed = tickets.filter(indx => indx.status === "Closed").length;
    ticketStatusCount.statusUnconfirmed = tickets.filter(indx => indx.status === "Unconfirmed").length;
    ticketPriorityCount.priorityUrgent = tickets.filter(indx => indx.priority === "Urgent").length;
    ticketPriorityCount.priorityHigh = tickets.filter(indx => indx.priority === "High").length;
    ticketPriorityCount.priorityMedium = tickets.filter(indx => indx.priority === "Medium").length;
    ticketPriorityCount.priorityLow = tickets.filter(indx => indx.priority === "Low").length;
    ticketPriorityCount.priorityNone = tickets.filter(indx => indx.priority === "None").length;
  };
  console.log("*****TICKET STATUS COUNT*****")
  console.log(ticketStatusCount)
  console.log("*****TICKET PRIORITY COUNT*****")
  console.log(ticketPriorityCount)

  return !isAuthenticated ? (
    <section className="dash unauth">
      <div className="dash__unauth">
        <h3>Please Sign In.</h3>
        <div className="dash__unauth-btns">
          <ButtonUI
            className="dash__unauth-btn"
            variant="contained"
            href="/signin"
          >
            Sign In  
          </ButtonUI>
          <ButtonUI
            className="dash__unauth-btn"
            sx={{ color: 'secondary.main' }}
            variant='outlined'
            href="/signup"
          >
            Sign Up
          </ButtonUI>
        </div>
      </div>
    </section>
  ) : (
    <section className="dash">
      <div className="dash__content">
        <div className="dash__mobile-padding top"></div>
        <PaperUI
          className="dash__card"
          // raised
          // variant={'outlined'}
          // square
          // elevation={0}
        >
          <div className="dash__heading-sec">
            <div className="dash__header">
              <Typography variant='h3'>Tickets by Priority</Typography>
            </div>
          </div>
          <div className="dash__detail">
            {projectLoading ? (
              <div className="empty">Loading...</div> 
            ) : (
              <PieChart priorityCount={ticketPriorityCount} />
            )}
          </div>
        </PaperUI>
        <PaperUI
          className="dash__card"
          // variant={'elevation'}
          // square
          // elevation={0}
        >
          <div className="dash__heading-sec">
            <div className="dash__header">
              <Typography variant='h3'>My Tickets</Typography>
            </div>
          </div>
          <div className="dash__detail">
            <div className="dash__list list">
              {projectLoading ? (
                <div className="empty">Loading...</div>
              ) : tickets.length > 0 ? (
                <MyTicketsList tickets={tickets} />
              ) : (
                <div className="empty">Not currently assigned any tickets.</div>
              )}
            </div>
          </div>
        </PaperUI>
        <PaperUI
          className="dash__card"
          // variant={'outlined'}
          // square
          // elevation={20}
        >
          <div className="dash__heading-sec">
            <div className="dash__header">
              <Typography variant='h3'>My Projects</Typography>
            </div>
          </div>
          <div className="dash__detail">
            <div className="dash__list list">
              {projectLoading ? (
                <div className="empty">Loading...</div>
              ) : projects.length > 0 ? (
                <MyProjectsList projects={projects} />
              ) : (
                <div className="empty">No projects currently exist.</div>
              )}
            </div>
          </div>
        </PaperUI>
        <PaperUI
          className="dash__card"
          // variant={'elevation'}
          // square
          // elevation={0}
        >
          <div className="dash__heading-sec">
            <div className="dash__header">
              <Typography variant='h3'>Tickets by Status</Typography>
            </div>
          </div>
          <div className="dash__detail">
            <div className="dash__list">
              {projectLoading ? (
                <div className="empty">Loading...</div> 
              ) : (
                <BarChart statusCount={ticketStatusCount} />
              )}
            </div>
          </div>
        </PaperUI>
        <div className="dash__mobile-padding bottom"></div>
      </div>
    </section>
  )
};
export default Home;
export const getServerSideProps = async (context) => { 
  try {
    // let cookies = new Cookie()
    let token = context.req.cookies.qual__token;
    token ? token : null;
    console.log("token")
    console.log(token)
    console.log("+++ context +++")
    console.log(context)
    console.log("+++ end +++")
    if (!token) {
      // await authIsExpired();
      console.log("session expired")
      // cookie.set("qual__isLoggedIn")
      context.res.setHeader(
        "Set-Cookie", [
          `qual__isLoggedIn=deleted; Max-Age=0`,
          // `qual__user=deleted; Max-Age=0`
        ]
      )
      // context.res
      // res.setHeader(
      //   "Set-Cookie", [
      //     cookie.serialize("qual__token", jwtAccessToken, cookieOptions),
      //     cookie.serialize("qual__isLoggedIn", true, {path: "/"})
      //   ]
      // );
      // Cookies.remove("qual__isLoggedIn");
      // Cookies.set("qual__isLoggedIn", "false");
      // localStorage.removeItem("qual__user");
      return {
        redirect: {
          destination: `/signin`,
          permanent: false,
        },
        props: {
          // authIsExpired: "Session expired. Please login."
        },
      };
    };

    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    console.log("~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~")
    console.log("validCookieAuth")
    console.log(validCookieAuth)
    console.log("~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~|~")

    return {
      props: {
        // initialState: store.getState(),
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
Home.getLayout = function getLayout(Home) {
  return <MainLayout>{Home}</MainLayout>;
};