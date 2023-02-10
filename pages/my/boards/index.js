import BoardLayout from "@/components/layouts/BoardLayout";
import Spinner from '@/components/Spinner';
import { Card } from '@mui/material';

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
            <Card className="boards__item" key={item.id}>
              <div className="boards__item-header">
                <h3 className="boards__header">
                  {item.title}
                </h3>
              </div>
              <div className="boards__content">
                <div className="boards__image">
                  {item.img}
                </div>
                {/* <img src="" alt="" className="boards__img" /> */}
                <div className="boards__description">
                  {item.description}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
};
export default Boards;
Boards.getLayout = function getLayout(Boards) {
  return <BoardLayout>{Boards}</BoardLayout>
};