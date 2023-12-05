import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDataSSR } from '@/utils/fetchData';
import store from '@/redux/store';
import { clearAuth, logout } from '@/redux/features/auth/authSlice';
import { getBoard } from '@/redux/features/board/boardSlice';
import BoardLayout from "@/components/layouts/BoardLayout";
import Columns from "@/components/columns/Columns";
import Spinner from '@/components/Spinner';
// import board detail and columns belonginng to board from redux

const Board = () => {
  const dispatch = useDispatch();
  const { board } = useSelector(state => state.board);
  

  return (
    <section>
      {/* <h1> */}
        {/* Board */}
      {/* </h1> */}
      <div className="columns-section">
        <Columns />
      </div>
    </section>
  )
};
export default Board;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token;
    token ? token : null;

    // TODO: if token auth expires, then auth.isAuthenticated needs to be changes to false so that the maain menu reverts to not logged in state, thus in gssp, call auth.clearAuth redux action for auth to reset auth state, additionally to reset the isAuthenticated value in LocalStorage - this action needs to be placed in each page gssp
    // todo: isLoggedin cooke expires value read "session" needs to be changed to expired is true or the date in which it is set to expire (not sesion)
    if (!token) {
      // context.res.setHeader(
      //   "Set-Cookie", [
      //     `qual__isLoggedIn=deleted; Max-Age=0; Expires: new Date(0)`
      //     // `qual__isLoggedIn=deleted; Max-Age=0`,
      //     // `qual__isLoggedIn=deleted; Max-Age=-1`,
      //     // `qual__isLoggedIn=false; Max-Age=0`,
      //   ]
      // )
      // await store.dispatch(clearAuth());
      console.log("^^^^^^^^^^getting logged out^^^^^^^^^^")
      await store.dispatch(logout());
      console.log("^^^^^^^^^^logged out^^^^^^^^^^")
      return {
        redirect: {
          destination: `/signin?session_expired=true`,
          permanent: false,
        },
        props: {},
        // props: {
          // initialState: store.getState()
        // },
      };
    };
    let boardID = context.params.id;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    let userRole = await getDataSSR(`/auth/checkAuth`, validCookieAuth);
    let roleResult = userRole?.data?.role;

    await store.dispatch(getBoard({board_id: boardID,
    cookie: validCookieAuth}));

    return {
      props: {
        initialState: store.getState(),
        token: token,
        roleResult
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
Board.getLayout = function getLayout(Board) {
  return <BoardLayout>{Board}</BoardLayout>
};