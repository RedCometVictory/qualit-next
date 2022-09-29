import MainNav from '../nav/MainNav';
import MiniNav from '../nav/MiniNav';

const BoardLayout = ({children}) => {
  return (
    <main className='container'>
      <MainNav />
      <div className="routes routes__container">
        <MiniNav />
        {children}
      </div>
    </main>
  );
};
export default BoardLayout;