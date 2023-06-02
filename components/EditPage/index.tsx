import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import { useLoadScript } from "@react-google-maps/api";
import {
  CircularProgress
} from '@mui/material';
import { useSession } from 'next-auth/react';
import styles from "../../styles/EditItinerary.module.scss";
import UnauthorizedUser from '../UnauthorizedUser';
import Desktop from "./Desktop";
import Tablet from "./Tablet";
import Phone from "./Phone";

interface EditPageProps {
  itinerary: Itinerary;
}

const EditPage: React.FC<EditPageProps> = ({
  itinerary
}) => {
  const libraries = useMemo(() => ["places"], []);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY as string,
    libraries: libraries as any,
  });
  const { data, status } = useSession();
  const router = useRouter();
  const userData: any = { ...data?.user };

  const [_itinerary, updateItinerary] = useState<Itinerary>({...itinerary});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [deviceType, setDeviceType] = useState<string>("desktop");
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    const _windowWidth = window.innerWidth;
    setWindowWidth(_windowWidth);

    if (windowWidth > 952) {
      setDeviceType("desktop");
    } else if (windowWidth > 524) {
      setDeviceType("tablet");
    } else {
      setDeviceType("phone");
    }
  }, [windowWidth]);

  useEffect(() => {
    console.log(`Itinerary: ${JSON.stringify(itinerary)}`);
  }
  , [itinerary]);

  const handleDeleteActivity = (index: number) => {
    const newActivities = [..._itinerary.activities];
    newActivities.splice(index, 1);
    updateItinerary({..._itinerary, activities: newActivities});
  };

  const handleAddActivity = (activity: Activity) => {
      updateItinerary((prev) =>{
        return {...prev, activities: [...prev.activities, activity]};
      });
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    const newActivities = [..._itinerary.activities];
    const removed = newActivities.splice(startIndex, 1)[0];
    newActivities.splice(endIndex, 0, removed);
    updateItinerary({..._itinerary, activities: newActivities});
  };

  const handleSaveItinerary = async () => {
    if (!(status === 'authenticated')) {
      router.push('/api/auth/signin');
      return;
    }

    if (!itinerary.id
      || !itinerary.name
      || !itinerary.startingLocation) {
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/save-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(_itinerary),
      });
  
      if (response.ok) {
        const data = await response.json();
        router.push(`/itinerary/${data.itinerary_id}`);
      } else {
        console.error('Error saving itinerary:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving itinerary:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className={styles.container}>
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || status === "authenticated" && userData.id !== itinerary.ownerId) {
    return <UnauthorizedUser />;
  }

  return (
    <div className={styles.mainContainer}>
      {deviceType === "desktop" && <Desktop
        itinerary={_itinerary}
        updateItinerary={updateItinerary}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        handleSaveItinerary={handleSaveItinerary}
        handleAddActivity={handleAddActivity}
        handleReorder={handleReorder}
        handleDeleteActivity={handleDeleteActivity}
        windowWidth={windowWidth}
      />}
      {deviceType === "tablet" && <Tablet
        itinerary={_itinerary}
        updateItinerary={updateItinerary}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        handleSaveItinerary={handleSaveItinerary}
        handleAddActivity={handleAddActivity}
        handleReorder={handleReorder}
        handleDeleteActivity={handleDeleteActivity}
        windowWidth={windowWidth}
      />}
      {deviceType === "phone" && <Phone
        itinerary={_itinerary}
        updateItinerary={updateItinerary}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        handleSaveItinerary={handleSaveItinerary}
        handleAddActivity={handleAddActivity}
        handleReorder={handleReorder}
        handleDeleteActivity={handleDeleteActivity}
        windowWidth={windowWidth}
      />}
    </div>
  );
};

export default EditPage;