import { useCallback, useEffect, useState, useRef } from 'react';
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

const Board = ({ initialState }) => {
  const dispatch = useDispatch();
  const { board } = useSelector(state => state.board);
  const { cards } = useSelector(state => state.card);
  const { columns } = useSelector(state => state.column);
  const [buttonText, setButtonText] = useState("Save");
  const [hasMounted, setHasMounted] = useState(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    dispatch(boardRehydrate(initialState.board));
    dispatch(columnRehydrate(initialState.column));
    dispatch(cardRehydrate(initialState.card));
    setHasMounted(true);
  }, [dispatch, initialState]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  return (<>
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