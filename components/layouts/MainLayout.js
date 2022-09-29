import MainNav from '../nav/MainNav';

const MainLayout = ({children}) => {
  return (<>
    <main className='container'>
      <MainNav />
      {children}
    </main>
  </>);
};
export default MainLayout;