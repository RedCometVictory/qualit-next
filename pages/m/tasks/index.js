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
      <Columns />
    </section>
    <SideMenu />
  </>)
};
export default Tasks;
Tasks.getLayout = function getLayout(Tasks) {
  return <BoardLayout>{Tasks}</BoardLayout>
};


/*
// pages/protectedRoute.tsx
import { GetServerSideProps } from "next";
import { supabase } from "../../utils/supabase";const Protected = ({ user }: IProps) => {
  return <div>JSON.stringify(user)</div>
}export const getServerSideProps: GetServerSideProps = async ({ req }) => { // Get our logged user
 const { user } = await supabase.auth.api.getUserByCookie(req); // Check if the user is logged
 if (user === null) {
  // Redirect if no logged in
  return { props: {}, redirect: { destination: "/auth/login" } };
 }
 // If logged return the user
 return { props: { user } };
};export default Protected;
*/