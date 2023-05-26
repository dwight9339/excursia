import React, { useMemo, useState, useEffect } from 'react';
import {
  CircularProgress
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useLoadScript } from '@react-google-maps/api';
import { useRouter } from "next/router";
import styles from "../../styles/ItineraryPage.module.scss";
import Desktop from './Desktop';
import Mobile from './Mobile';
import ModalContext from '../../contexts/ModalContext';

interface ItineraryPageProps {
  itinerary: Itinerary;
}

const ItineraryPage: React.FC<ItineraryPageProps> = ({ itinerary }) => {
  if (!itinerary) return <div>Itinerary not found</div>;
  const router = useRouter();
  const { data, status } = useSession();
  const userData: any = { ...data?.user };
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any
  });
  const { openModal } = React.useContext(ModalContext);
  const [deviceType, setDeviceType] = useState<string>("desktop");
  const [screenWidth, setScreenWidth] = useState<number>(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    if (window.innerWidth < 952) {
      setDeviceType("mobile");
    }
  }, [setDeviceType]);

  useEffect(() => {
    console.log(`Device type: ${deviceType}`);
  }, [deviceType]);

  if (!isLoaded) {
    return (
      <div className={styles.container}>
        <div className={styles.spinnerContainer}>
          <CircularProgress />
        </div>
      </div>
    )
  }

  const otherOptions = [
    {
      name: "Share",
      // TODO: Implement share functionality
      onClick: () => console.log("Sharing itinerary...")
    },
    {
      name: "Edit",
      onClick: () => router.push(`/itinerary/${itinerary.id}/edit`)
    },
    {
      name: "Delete",
      // TODO: Implement delete functionality
      onClick: () => {
        console.log("Deleting itinerary...");
        openModal(
          <div>
            <h2>Are you sure you want to delete this itinerary?</h2>
            <button onClick={() => console.log("Deleting itinerary...")}>Yes</button>
            <button onClick={() => console.log("Canceling delete...")}>No</button>
          </div>
        );
      }
    }
  ];

  return (
    <div>
      {deviceType === "desktop" &&
        <Desktop 
          itinerary={itinerary}
          screenWidth={screenWidth}
          moreOptions={otherOptions}
        />
      }
      {deviceType === "mobile" &&
        <Mobile
          itinerary={itinerary}
          screenWidth={screenWidth}
          moreOptions={otherOptions}
        />
      }
    </div>
  );
};

export default ItineraryPage;