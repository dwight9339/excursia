import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  itineraryId: string | null;
  itinerary: Itinerary;
}

const EditPage: React.FC<EditPageProps> = ({
  itineraryId,
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

  const [itineraryName, setItineraryName] = useState<string>(itinerary.name);
  const [startLocation, setStartLocation] = useState<google.maps.LatLngLiteral | undefined>(itinerary.startingLocation);
  const [selectedActivities, setSelectedActivities] = useState<Activity[]>(itinerary.activities);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(new Date(itinerary.startTime));
  const [directions, setDirections] = useState<google.maps.DirectionsResult | undefined>(itinerary.directions);
  const [shouldQueryDirections, setShouldQueryDirections] = useState<boolean>(false);
  const [routeOptions, setRouteOptions] = useState<any>({});
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
  })

  useEffect(() => {
    if (isLoaded) {
      setRouteOptions({
        loopToStart: false,
        travelMode: google.maps.TravelMode.DRIVING,
        avoidHighways: false,
        avoidTolls: false,
      } as RouteOptions);
    }
  }, [isLoaded]);
  

  const handleDirectionsResult = (result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (status !== google.maps.DirectionsStatus.OK) {
      console.log(`Directions failed: ${status}`);
      return;
    } else {
      console.log(`Directions updated: ${status}`);
    }
    setDirections(result || undefined);
  };

  const getDirections = async () => {
    if (!isLoaded) return;
    const startLocation = itinerary.startingLocation;
    const finalActivity = selectedActivities[selectedActivities.length - 1];
    const endLocation = routeOptions.loopToStart ? startLocation : finalActivity.place?.geometry?.location || finalActivity.location;
    const waypoints = selectedActivities.slice(0, selectedActivities.length - 1).map((activity) => ({
      location: activity.place?.geometry?.location || activity.location,
      stopover: true
    }));

    if (!startLocation || !endLocation) {
      return;
    }

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: startLocation,
        destination: endLocation,
        waypoints: waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      handleDirectionsResult
    );
  }

  // useEffect(() => {
  //   if (shouldQueryDirections && selectedActivities.length > 0) {
  //     getDirections();
  //   }
  // }, [shouldQueryDirections, selectedActivities]);

  const optimizeOrder = useCallback(async () => {
    if (!isLoaded || selectedActivities.length < 2) return;
    const startLocation = itinerary.startingLocation;
    const endLocation = routeOptions.loopToStart
      ? startLocation
      : selectedActivities[selectedActivities.length - 1].place?.geometry?.location ||
        selectedActivities[selectedActivities.length - 1].location;
  
    const waypoints = selectedActivities.map((activity) => ({
      location: activity.place?.geometry?.location || activity.location,
      stopover: true,
    }));
  
    if (!startLocation || !endLocation) {
      return;
    }

    try {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: startLocation,
          destination: endLocation,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: routeOptions.travelMode,
          avoidHighways: routeOptions.avoidHighways,
          avoidTolls: routeOptions.avoidTolls,
        },
        (result, status) => {
          if (status !== google.maps.DirectionsStatus.OK || !result) {
            console.log(`Directions failed: ${status}`);
            return;
          } else {
            console.log(`Directions updated: ${status}`);
          }
          const optimizedWaypoints = result.routes[0].waypoint_order;
          const optimizedActivities = optimizedWaypoints.map((index) => selectedActivities[index]);
          setSelectedActivities(optimizedActivities);
          setDirections(result);
        }
      );
    } catch (err) {
      console.log(`Error optimizing order: ${err}`);
    }
  }, [selectedActivities, routeOptions, startTime, isLoaded]);
  

  const handleDeleteActivity = (index: number) => {
    const newActivities = [...selectedActivities];
    newActivities.splice(index, 1);
    setSelectedActivities(newActivities);
    setShouldQueryDirections(true);
  };

  const handleAddActivity = (activity: Activity) => {
      setSelectedActivities((prev) => [...prev, activity]);
      setShouldQueryDirections(true);
  };

  const handleReorder = (startIndex: number, endIndex: number) => {
    const newActivities = [...selectedActivities];
    const removed = newActivities.splice(startIndex, 1)[0];
    newActivities.splice(endIndex, 0, removed);
    setSelectedActivities(newActivities);
    setShouldQueryDirections(true);
  };

  const handleSaveRouteOptions = (options: RouteOptions) => {
    setRouteOptions(options);
    setShouldQueryDirections(true);
    getDirections();
  };

  const handleSaveItinerary = async () => {
    if (!(status === 'authenticated')) {
      router.push('/api/auth/signin');
      return;
    }

    if (!itineraryId
      || !itineraryName
      || !startLocation) {
      return;
    }

    setIsSaving(true);
    try {
      const updatedItinerary: Itinerary = {
        id: `${itineraryId}`,
        name: itineraryName,
        startingLocation: startLocation,
        activities: selectedActivities,
        startTime: startTime?.toISOString() || '',
        directions: directions,
        interests: itinerary.interests,
        searchRadius: itinerary.searchRadius,
        suggestions: itinerary.suggestions,
        ownerId: userData.id,
        createdDate: itinerary.createdDate
      }
      const response = await fetch('/api/save-itinerary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItinerary),
      });
  
      if (response.ok) {
        const data = await response.json();
        // console.log('Itinerary saved:', JSON.stringify(data));
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
        itinerary={itinerary}
        itineraryName={itineraryName}
        setItineraryName={setItineraryName}
        startLocation={startLocation}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        handleSaveItinerary={handleSaveItinerary}
        handleAddActivity={handleAddActivity}
        handleReorder={handleReorder}
        handleDeleteActivity={handleDeleteActivity}
        windowWidth={windowWidth}
      />}
      {deviceType === "tablet" && <Tablet
        itinerary={itinerary}
        itineraryName={itineraryName}
        setItineraryName={setItineraryName}
        startLocation={startLocation}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        handleSaveItinerary={handleSaveItinerary}
        handleAddActivity={handleAddActivity}
        handleReorder={handleReorder}
        handleDeleteActivity={handleDeleteActivity}
        windowWidth={windowWidth}
      />}
      {deviceType === "phone" && <Phone
        itinerary={itinerary}
        itineraryName={itineraryName}
        setItineraryName={setItineraryName}
        startLocation={startLocation}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
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