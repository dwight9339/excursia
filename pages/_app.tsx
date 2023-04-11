import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { SessionProvider } from 'next-auth/react';
import Header from "../components/Header";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Header />
        <Component {...pageProps} />
      </LocalizationProvider>
    </SessionProvider>
  );
}

export default MyApp;