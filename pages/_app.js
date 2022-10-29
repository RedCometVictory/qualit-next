import MainLayout from '../components/layouts/MainLayout';
import Meta from '@/components/Meta';
import { Provider } from 'react-redux';
// import { ThemeProvider } from 'use-theme-switcher';
import { ToastContainer } from 'react-toastify';
// import store from '../redux/store'
import wrapper from '@/redux/store';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/main.scss';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || (page => page);
  // return getLayout(<Component {...pageProps}/>)
  // return (
  //   <Provider store={store} >
  //     <Meta />
  //     {/* <MainLayout> */}
  //       {getLayout(<Component {...pageProps} />)}
  //       <ToastContainer
  //         position='top-center'
  //         newestOnTop={true}
  //         autoClose={5000}
  //         closeOnClick
  //         pauseOnHover
  //       />
  //     {/* </MainLayout> */}
  //   </Provider>
  // )
  return (<>
    <Meta />
    {getLayout(<Component {...pageProps} />)}
    <ToastContainer
      position='top-center'
      newestOnTop={true}
      autoClose={5000}
      closeOnClick
      pauseOnHover
    />
  </>)
};
export default wrapper.withRedux(MyApp);

// ORIGINAL
// function MyApp({ Component, pageProps }) {
//   return (
//     <Provider store={store} >
//       <Meta />
//       <MainLayout>
//         <Component {...pageProps} />
//         <ToastContainer
//           position='top-center'
//           newestOnTop={true}
//           autoClose={5000}
//           closeOnClick
//           pauseOnHover
//         />
//       </MainLayout>
//     </Provider>
//   )
// };