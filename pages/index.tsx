import React, { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { CircularProgress } from '@mui/material';
import WelcomeBanner from '../components/WelcomeBanner';
import styles from "../styles/Home.module.scss";
import NewItinerary from '../components/ActivitySearch/NewItinerary';

const HomePage: React.FC = () => {
  const { status } = useSession();

  

  const pageContent = useMemo(() => {
    if (status === "loading") {
      return (
        <div className={styles.spinnerContainer}>
          <CircularProgress />
        </div>
      )
    }
    if (status === "unauthenticated") return <WelcomeBanner />;
    if (status === "authenticated") return <NewItinerary />;
    else return <div>Something went wrong...</div>;

  }, [status]);

  return (
    <div className={styles.container}>
      {pageContent}
    </div>
  );
};

export default HomePage;