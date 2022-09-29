import { useSelector } from "react-redux";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import Head from 'next/head';

const Meta = () => {
  const { theme } = useSelector(state => state.theme);
  
  return (
    <HelmetProvider>
      <Helmet>
        <html className={`${theme}`} />
      </Helmet>
    </HelmetProvider>
  )
};
export default Meta;