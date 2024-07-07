import MainLayout from '../components/layouts/MainLayout';
import Meta from '@/components/Meta';
import { Provider } from 'react-redux';
import ThemeColor from '@/utils/themeColor';
import { ToastContainer } from 'react-toastify';
import store from '../redux/store'
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.scss';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);

  return (
    <Provider store={store}>
      <ThemeColor>
        <Meta />
          {getLayout(<Component {...pageProps} />)}
          <ToastContainer
            position='top-center'
            newestOnTop={true}
            autoClose={5000}
            closeOnClick
            pauseOnHover
          />
      </ThemeColor>
    </Provider>
  )
};
export default MyApp;