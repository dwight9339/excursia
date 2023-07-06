import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from 'next-auth/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import Header from "../components/Header";
import ModalProvider from '../providers/ModalProvider';
import Modal from '../components/Modal';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ModalProvider>
          <Head>
            <title>Excursia</title>
            <meta name="description" content="Excursia" />
            <link rel="icon" href="/favicon.png" />
          </Head>
          <Modal />
          <Header />
          <Component {...pageProps} />
        </ModalProvider>
      </LocalizationProvider>
    </SessionProvider>
  );
}

export default dynamic(() => Promise.resolve(MyApp), {
  ssr: false,
});