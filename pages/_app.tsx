import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Head>
          <title>Excursia</title>
          <meta name="description" content="Excursia" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <Component {...pageProps} />
      </LocalizationProvider>
    </SessionProvider>
  );
}

export default MyApp;