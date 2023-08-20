import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import store from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";
import { getUserAccount, rehydrate } from "@/redux/features/user/userSlice";
import { Divider, Typography } from "@mui/material";
import DetailLayout from "@/components/layouts/DetailLayout";
import ButtonUI from "@/components/UI/ButtonUI";
import PaperUI from "@/components/UI/PaperUI";

const Account = ({initialState, token}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user, loading: userLoading } = useSelector(state => state.user);
  // const { detail, tickets, projects } = user;
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
        <div className="detail__info-box right"></div>
      </div>
      <div className="detail__sub-header">
        <div className="stats-container">
          <span>{user.id}</span>
        </div>
        <span className="date">
          Joined On: {user.created_at}
        </span>
      </div>
      <div className="detail__content detail-page ticket-page">
        <section className="left">
          <div className="detail__status-container">
            <div className="status-group one">
              <UserStatsBox title={"FullName:"} value={`${user.f_name} ${user.l_name}`}/>
              <UserStatsBox title={"UserName:"} value={user.username}/>
            </div>
            <div className="status-group two">
              <UserStatsBox title={"E-mail:"} value={user.email}/>
              <UserStatsBox title={"Role:"} value={user.role}/>
            </div>
          </div>
        </section>
      </div>
    </section>
  )
};
export default Account;
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

    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    await store.dispatch(getUserAccount({cookie: validCookieAuth}));

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
Account.getLayout = function getLayout(Account) {
  return <DetailLayout>{Account}</DetailLayout>
};