import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDataSSR } from '@/utils/fetchData';
import store from '@/redux/store';
import { clearAuth, logout } from '@/redux/features/auth/authSlice';
import { getBoard, rehydrate as boardRehydrate } from '@/redux/features/board/boardSlice';
import { fetchColumns, rehydrate as columnRehydrate } from '@/redux/features/column/columnSlice';
import { fetchCards, rehydrate as cardRehydrate } from '@/redux/features/card/cardSlice';
import BoardNav from '@/components/nav/BoardNav';
import Columns from "@/components/columns/Columns";
import BoardLayout from "@/components/layouts/BoardLayout";
import Spinner from '@/components/Spinner';
// import board detail and columns belonginng to board from redux

const Board = ({ initialState }) => {
  const dispatch = useDispatch();
  const { board } = useSelector(state => state.board);
  const { cards } = useSelector(state => state.card);
  const [buttonText, setButtonText] = useState("Save");
  const [hasMounted, setHasMounted] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    console.log("this use effect is active")
    console.log("this use effect is active")
    console.log("this use effect is active")
    dispatch(boardRehydrate(initialState.board));
    dispatch(columnRehydrate(initialState.column));
    dispatch(cardRehydrate(initialState.card));
    setHasMounted(true);
  }, [dispatch, initialState]);

  
  // useEffect(() => {
  //   setHasMounted(true);
  // }, []);

  useEffect(() => {
    // if (cards) {
    if (hasMounted) {
      if (isInitialMount.current) {
        isInitialMount.current = false;
      } else {
        setButtonText('Unsaved');
      }
    }
  }, [cards, hasMounted]);

  if (!hasMounted) return null;

  return (<>
    {/* <h1> */}
      {/* Board */}
    {/* </h1> */}
    <BoardNav buttonText={buttonText} setButtonText={setButtonText} />
    <section  className="board__container">
      <Columns />
    </section>
  </>)
};
export default Board;
export const getServerSideProps = async (context) => {
  try {
    let token = context.req.cookies.qual__token || null;

    // TODO: if token auth expires, then auth.isAuthenticated needs to be changes to false so that the maain menu reverts to not logged in state, thus in gssp, call auth.clearAuth redux action for auth to reset auth state, additionally to reset the isAuthenticated value in LocalStorage - this action needs to be placed in each page gssp
    // todo: isLoggedin cooke expires value read "session" needs to be changed to expired is true or the date in which it is set to expire (not sesion)
    if (!token) {
      return {
        redirect: {
          destination: `/signin?session_expired=true`,
          permanent: false,
        },
        props: {},
      };
    };

    let boardID = context.params.id;
    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    let userRole = await getDataSSR(`/auth/checkAuth`, validCookieAuth);
    let roleResult = userRole?.data?.role;

    await store.dispatch(getBoard({boardId: boardID, cookie: validCookieAuth}));
    await store.dispatch(fetchColumns({boardId: boardID, cookie: validCookieAuth}));
    await store.dispatch(fetchCards({boardId: boardID, cookie: validCookieAuth}));

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