import React, { useMemo, useState, useEffect } from 'react';
import {
  CircularProgress
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useLoadScript } from '@react-google-maps/api';
import { useRouter } from "next/router";
import dynamic from 'next/dynamic';
import styles from "../../styles/ItineraryPage.module.scss";
import Desktop from './Desktop';
import Mobile from './Mobile';
import ModalContext from '../../contexts/ModalContext';

interface ItineraryPageProps {
  itinerary: Itinerary;
}

const ItineraryPage: React.FC<ItineraryPageProps> = ({ itinerary }) => {
  const router = useRouter();
  const { id: itineraryId } = router.query;
  const { data, status } = useSession();
  const userData: any = { ...data?.user };
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any
  });
  const { openModal, closeModal } = React.useContext(ModalContext);
  const [deviceType, setDeviceType] = useState<string>("desktop");
  const [screenWidth, setScreenWidth] = useState<number>(0);

  const ShareComponent = dynamic(() => import('./ShareItinerary').then(mod => mod), { ssr: false });

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    if (window.innerWidth < 952) {
      setDeviceType("mobile");
    }
  }, [setDeviceType]);

  const deleteItinerary = async () => {
    try {
      const res = await fetch(`/api/delete-itinerary?itineraryId=${itineraryId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      if (data.success) {
        router.push("/my-itineraries");
      } else {
        console.log(data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const otherOptions = [
    {
      name: "Share",
      // TODO: Implement share functionality
      onClick: () => {
        openModal(
          "Share Itinerary",
          <ShareComponent itinerary={itinerary} />,
          []
        );
      }
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
          "Delete Itinerary",
          <div className={styles.deleteItineraryModalTextContainer}>
            <h2>Are you sure you want to delete this itinerary?</h2>
          </div>,
          [
            {
              name: "Yes",
              action: () => {
                deleteItinerary();
                closeModal();
              }
            },
            {
              name: "No",
              action: () => closeModal()
            }
          ]
        );
      }
    }
  ];

  const pageContent = useMemo(() => {
    if (!isLoaded) {
      return (
        <div className={styles.container}>
          <div className={styles.spinnerContainer}>
            <CircularProgress />
          </div>
        </div>
      )
    }

    if (deviceType === "desktop") {
      return (
        <Desktop 
          itinerary={itinerary}
          screenWidth={screenWidth}
          moreOptions={otherOptions}
        />
      );
    }

    return (
      <Mobile
        itinerary={itinerary}
        screenWidth={screenWidth}
        moreOptions={otherOptions}
      />
    );
  }, [isLoaded, deviceType, screenWidth]);
  

  return (
    <div>
      {pageContent}
    </div>
  );
};

export default ItineraryPage;