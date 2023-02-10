import DetailLayout from "@/components/layouts/DetailLayout";

const MyTickets = () => {
  return (
    <section className="ticket detail detail-container"></section>
  )
};
export default MyTickets;
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
          destination: `/signin?session_expired=true`,
          permanent: false,
        },
        props: {},
      };
    };
    
    // TODO: may remove/use userInfo
    let userInfo = context.req.cookies.qual__user;
    let ticketID = context.params.ticketId;
    let ticketInfo;
    // TODO: validCookieAuth only ussed to dev. Remove for prod is token is all you need
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;

    // TODO: attempt to only pass token, not all cookies necessary to pass
    // ticketInfo = await store.dispatch(getTicket({ticket_id: ticketID, cookie: validCookieAuth}));

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
MyTickets.getLayout = function getLayout(MyTickets) {
  return <DetailLayout>{MyTickets}</DetailLayout>
};