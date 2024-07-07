import { useDispatch, useSelector } from 'react-redux';
import BoardLayout from '@/components/layouts/BoardLayout';
import Columns from '@/components/columns/Columns';
import SideMenu from '@/components/SideMenu';

const Tasks = () => {
  // const { backgroundImage } = useSelector(state => state.theme);
  return (<>
    <section
      className="board"
      // image={backgroundImages}
    >
      {/* <Columns /> */}
      Hello this is the tasks page!
    </section>
    <SideMenu />
  </>)
};
export default Tasks;
Tasks.getLayout = function getLayout(Tasks) {
  return <BoardLayout>{Tasks}</BoardLayout>
};