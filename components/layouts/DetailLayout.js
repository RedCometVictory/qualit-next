import MainNav from '../nav/MainNav';

const DetailLayout = ({children}) => {
  return (<>
    <main className='container'>
      <MainNav />
      {children}
    </main>
  </>);
};
export default DetailLayout;