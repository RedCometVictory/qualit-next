import { useEffect, useRef, useState } from  'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from "next/router";
import { getDashboardInfo } from '@/redux/features/project/projectSlice';
import MainLayout from "@/components/layouts/MainLayout";
import CardUI from '@/components/UI/CardUI';
import ButtonUI from '@/components/UI/ButtonUI';
import { Card, Input, InputLabel, FormGroup, CardContent, Typography } from "@mui/material";
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
    <section className="dash">
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
        <Card
          className="dash__card"
          // raised
        >
          <div className="dash__heading-sec">
            <div className="dash__header">
              <Typography variant='h6' component='h1'>Tickets by Priority</Typography>
            </div>
          </div>
          <div className="dash__detail">
            {projectLoading ? (
              <div className="empty">Loading...</div> 
            ) : (
              <PieChart priorityCount={ticketPriorityCount} />
            )}
          </div>
        </Card>
        <Card className="dash__card">
          <div className="dash__heading-sec">
            <div className="dash__header">
              <Typography variant='h6' component='h1'>My Tickets</Typography>
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
        </Card>
        <Card className="dash__card">
          <div className="dash__heading-sec">
            <div className="dash__header">
              <Typography variant='h6' component='h1'>My Projects</Typography>
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
        </Card>
        <Card className="dash__card">
          <div className="dash__heading-sec">
            <div className="dash__header">
              <Typography variant='h6' component='h1'>Tickets by Status</Typography>
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
        </Card>
        <div className="dash__mobile-padding bottom"></div>
      </div>
    </section>
  )
};
export default Home;

/*
Can use url to pass data or cookies to pass data between components


Cookies, yes using cookies can solve this problem. Let's just jump into the code now.

export const getServerSideProps = async ({ params, query, req, res }: any) => {return {redirect: {permanent: false,destination: redirectionPath,
message: 'Hello',},};};

Now from the above example, I want to pass the message to the redirected page, but the problem is you won’t receive the message on the next page.
So now we will add cookies.
Before that, you need to install a module.

npm i cookies

Now you can use this module to add/get data to/from cookies.


export const getServerSideProps = async ({ params, query, req, res }: any) => {const cookies = new Cookies(req, res);const redirectionPath = `/same-page?eventId=${differentId}`;const responseMessage = "Hello second page";cookies.set('message', responseMessage, {httpOnly: true,});return {redirect: {permanent: false,destination: redirectionPath,},};};

Now you have added message data to cookies and you can get this data on the second page from cookies, how? here is a snippet

Second pageexport const getServerSideProps = async ({ params, query, req, res }: any) => {const cookies = new Cookies(req, res);const message = cookies.get('message');// use this message to perform some operation// let's say you want to delete this after one use, means that after second page loads one the data should be removed and on reload we should not get the message from cookies.// code to remove the data from cookies, and this will make sure after first load your message is removed from the cookiesif (message) {
// this will remove the property from the cookiescookies.set('message');}};

And that's how you play around with data on the server-side using cookies.

I hope this would have helped someone, as I was also searching for the solution to this problem a few weeks ago.

Keep learning and Growing.
*/

export const getServerSideProps = async (context) => { 
  try {
    let token = context.req.cookies.qual__token;
    token ? token : null;
    console.log("token")
    console.log(token)
    if (!token) {
      // await authIsExpired();
      console.log("session expired")
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
}

// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'

// export default function Home() {
//   return (
//     <div className={styles.container}>
//       <Head>
//         <title>Create Next App</title>
//         <meta name="description" content="Generated by create next app" />
//         <link rel="icon" href="/favicon.ico" />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.title}>
//           Welcome to <a href="https://nextjs.org">Next.js!</a>
//         </h1>

//         <p className={styles.description}>
//           Get started by editing{' '}
//           <code className={styles.code}>pages/index.js</code>
//         </p>

//         <div className={styles.grid}>
//           <a href="https://nextjs.org/docs" className={styles.card}>
//             <h2>Documentation &rarr;</h2>
//             <p>Find in-depth information about Next.js features and API.</p>
//           </a>

//           <a href="https://nextjs.org/learn" className={styles.card}>
//             <h2>Learn &rarr;</h2>
//             <p>Learn about Next.js in an interactive course with quizzes!</p>
//           </a>

//           <a
//             href="https://github.com/vercel/next.js/tree/canary/examples"
//             className={styles.card}
//           >
//             <h2>Examples &rarr;</h2>
//             <p>Discover and deploy boilerplate example Next.js projects.</p>
//           </a>

//           <a
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//             className={styles.card}
//           >
//             <h2>Deploy &rarr;</h2>
//             <p>
//               Instantly deploy your Next.js site to a public URL with Vercel.
//             </p>
//           </a>
//         </div>
//       </main>

//       <footer className={styles.footer}>
//         <a
//           href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Powered by{' '}
//           <span className={styles.logo}>
//             <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
//           </span>
//         </a>
//       </footer>
//     </div>
//   )
// }
