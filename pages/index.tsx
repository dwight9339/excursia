import React, { useMemo } from 'react';
import ActivitySearchForm from '../components/ActivitySearchForm';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Box,  CircularProgress } from '@mui/material';
import WelcomeBanner from '../components/WelcomeBanner';
import styles from "../styles/Home.module.scss";

const HomePage: React.FC = () => {
  const router = useRouter();
  const { data, status } = useSession();

  const handleCreateItinerary = async (preferences: any) => {
    const date = new Date();
    const userData: any = {...data?.user};
    const searchData = {
      name: preferences.locationName,
      startingLocation: preferences.startingLocation,
      startTime: date.toUTCString(),
      interests: preferences.interests,
      searchRadius: preferences.searchRadius,
      activities: [],
      ownerId: `${userData.id}`
    }

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(searchData),
    };

    try {
      const response = await fetch('/api/save-itinerary', requestOptions);
      const data = await response.json();
  
      if (response.ok) {
        console.log(`Itinerary ID: ${data.itinerary_id}`);
        router.push(`/itinerary/${data.itinerary_id}/edit`);
      } else {
        // Handle any error messages received
        console.error('Error generating itinerary:', data.message);
      }
    } catch (error) {
      // Handle any network errors
      console.error('Error fetching itinerary:', error);
    }
  };

  const pageContent = useMemo(() => {
    if (status === "loading") {
      return (
        <div className={styles.spinnerContainer}>
          <CircularProgress />
        </div>
      )
    }
    if (status === "unauthenticated") return <WelcomeBanner />;
    if (status === "authenticated") return <ActivitySearchForm onSubmit={handleCreateItinerary} />;
    else return <div>Something went wrong...</div>;

  }, [status]);

  return (
    <div className={styles.container}>
      {pageContent}
    </div>
  );
};

export default HomePage;