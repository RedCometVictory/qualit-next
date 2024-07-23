import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDataSSR } from '@/utils/fetchData';
import store from '@/redux/store';
// import { rehydrate } from '@/redux/features/theme/themeSlice';
import { getAllBoards, rehydrate } from '@/redux/features/board/boardSlice';
import { Card, CardContent, Typography } from "@mui/material";
import MiniNav from '@/components/nav/MiniNav';
import BoardLayout from "@/components/layouts/BoardLayout";
import ButtonUI from '@/components/UI/ButtonUI';
import AddBoardModal from '@/components/modals/AddBoardModal';

const Boards = ({initialState, token, roleResult}) => {
  const dispatch = useDispatch();
  const { boards: allBoards } = useSelector(state => state.board);
  const [addBoardModal, setAddBoardModal] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(rehydrate(initialState.board));
  }, [dispatch, initialState]);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null;

  const openBoardModal = () => {
    setAddBoardModal(true)
  };

  return (<>
    <MiniNav setAddBoardModal={setAddBoardModal}/>
    <section className="">
      {addBoardModal ? (
        <AddBoardModal setAddBoardModal={setAddBoardModal}/>
      ) : (
        null
      )}
      <div className="boards__container">
        <div className="boards__list">
          {allBoards.length === 0 ? (
            <Typography className="boards__header" variant="h3" component="h3">
              No boards found. Please create a board.
            </Typography>
          ) : (            
            allBoards.map((item, index) => (
            <div className="boards__item-content" key={index}>
              <Card className="boards__item login__container">
                <CardContent>
                  <div className="boards__item-header">
                    <Typography className="boards__header" variant="h3" component="h3">
                      {item.name}
                    </Typography>
                  </div>
                  <div className="boards__content">
                    <div className="boards__view-btn">
                      <ButtonUI
                        href={`/my/board/${item.id}`}
                        variant='outlined'
                        size='small'
                        fontSize='small'
                      >
                        View
                      </ButtonUI>
                    </div>
                    <Typography className="boards__header" variant="body1" component="div">
                      {/* {item.img} */}
                    </Typography>
                    {/* <div className="boards__image"> */}
                      {/* <img src="" alt="" className="boards__img" /> */}
                    {/* </div> */}
                    <div className="boards__description">
                      <Typography className="boards__header" variant="body1" component="div">
                        {/* {item.description} */}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )))}
        </div>
      </div>
    </section>
  </>)
};
export default Boards;
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
      }
    };

    let validCookieAuth = context.req ? { cookie: context.req.headers.cookie } : undefined;
    let userRole = await getDataSSR(`/auth/checkAuth`, validCookieAuth);
    let roleResult = userRole?.data?.role;

    await store.dispatch(getAllBoards(validCookieAuth));

    return {
      props: {
        initialState: store.getState(),
        token,
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
Boards.getLayout = function getLayout(Boards) {
  return <BoardLayout>{Boards}</BoardLayout>
};