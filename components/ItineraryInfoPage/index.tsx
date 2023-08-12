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
  const isOwner = userData?.id === itinerary?.ownerId;

  const ShareComponent = dynamic(() => import('./ShareItinerary').then(mod => mod), { ssr: false });

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    if (window.innerWidth < 952) {
      setDeviceType("mobile");
    }
  }, [setDeviceType]);

  const deleteItinerary = async () => {
    try {
      const res = await fetch(`/api/delete-itinerary?itineraryId=${itinerary.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();

      if (data.success) {
        router.push("/my-itineraries");
      } else {
        console.error("Error deleting itinerary:", data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fullOptions = [
    {
      name: "Share",
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
      onClick: () => {
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

  const reducedOptions = [
    {
      name: "Share",
      onClick: () => {
        openModal(
          "Share Itinerary",
          <ShareComponent itinerary={itinerary} />,
          []
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
          moreOptions={isOwner ? fullOptions : reducedOptions}
        />
      );
    }

    return (
      <Mobile
        itinerary={itinerary}
        screenWidth={screenWidth}
        moreOptions={isOwner ? fullOptions : reducedOptions}
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