import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBoards } from '@/redux/features/board/boardSlice';
import { Card, CardContent, Typography } from "@mui/material";
import BoardLayout from "@/components/layouts/BoardLayout";
import MainLayout from "@/components/layouts/MainLayout";
import Spinner from '@/components/Spinner';
import PaperUI from "@/components/UI/PaperUI";
import ButtonUI from '@/components/UI/ButtonUI';

const boardList = [
  {
    id: 1,
    title: 'First Board',
    img: '***',
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis nihil amet repellendus quisquam ipsa rerum, ratione corrupti cum iste, iusto, illo vel? Sequi ex assumenda magnam, earum dicta tempore facilis.`
  },
  {
    id: 2,
    title: 'Second Task',
    img: '***',
    description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel totam repudiandae molestiae ad commodi incidunt quia non eaque, expedita adipisci fugit quis magnam labore harum sunt aliquam sit eius ea rerum laborum quasi nobis illo quidem.`
  },
  {
    id: 3,
    title: 'My Third Task',
    img: '***',
    description: `Omnis animi mollitia nulla alias ipsum beatae optio inventore dolores, voluptatem veritatis qui magnam ad natus, sequi veniam magni quaerat facere enim, expedita vel? Quasi veritatis inventore reiciendis excepturi blanditiis sunt. Doloribus nobis veritatis placeat sed reiciendis.`
  },
  {
    id: 4,
    title: 'Fourth Project',
    img: '***',
    description: `Pariatur architecto natus quos aut, necessitatibus ipsa aperiam? Nulla nobis atque quas. Sed facere dolorem veniam eum est! Beatae consequuntur temporibus sunt quasi id quaerat. Est, minima!`
  }
];

const Boards = () => {

  
  return (
    <section className="boards">
      <div className="boards__container">
        <div className="boards__list">
          {boardList.map((item, index) => (
            <div className="boards__item-content" key={index}>
              <Card className="boards__item login__container">
                <CardContent>
                  <div className="boards__item-header">
                    <Typography className="boards__header" variant="h3" component="h3">
                      {item.title}
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
                      {item.img}
                    </Typography>
                    {/* <div className="boards__image"> */}
                      {/* <img src="" alt="" className="boards__img" /> */}
                    {/* </div> */}
                    <div className="boards__description">
                      <Typography className="boards__header" variant="body1" component="div">
                        {item.description}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
};
export default Boards;
// return <MainLayout>{Boards}</MainLayout>
Boards.getLayout = function getLayout(Boards) {
  return <BoardLayout>{Boards}</BoardLayout>
};