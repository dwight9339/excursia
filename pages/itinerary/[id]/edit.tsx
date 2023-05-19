import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { ParsedUrlQuery } from 'querystring';
import { useRouter } from "next/router";
import { useLoadScript } from "@react-google-maps/api";
import ActivityList from '../../../components/ActivityList';
import styles from "./EditItinerary.module.css"
import TimeSelector from '../../../components/TimeSelector';
import EditableText from '../../../components/EditableText';
import ItineraryMap from '../../../components/ItineraryMap';
import { fetchItinerary } from '../../../lib/dbFetch';
import SuggestedActivities from '../../../components/SuggestedActivities';
import TripSummary from '../../../components/TripSummary';
import AddActivity from '../../../components/AddActivity';
import RouteOptions from '../../../components/RouteOptions';
import UnauthorizedUser from '../../../components/UnauthorizedUser';

interface EditItineraryProps {
  itineraryId: string | null;
  itinerary: Itinerary;
}

const EditItinerary: React.FC<EditItineraryProps> = ({ itineraryId, itinerary }) => {
  if (!itinerary) return <div></div>;
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
        ownerId: userData.id
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
      <Box>
        <div className={styles.spinner}>
          <CircularProgress />
        </div>
      </Box>
    );
  }

  if (status === 'unauthenticated' || status === "authenticated" && userData.id !== itinerary.ownerId) {
    return <UnauthorizedUser />;
  }

  return (
    <Box>
      <div className={styles.columnContainer}>
        <div className={styles.column}>
          <div className={styles.titleContainer}>
            <EditableText
              text={itineraryName}
              onEdit={(newName) => setItineraryName(newName)}
            />
          </div>
          {/* <div className={styles.dateTimeSelectContainer}>
            <TimeSelector
              onDateTimeChange={(dateTime) => setStartTime(dateTime)}
            />
          </div>
          <div className={styles.tripSummaryContainer}>
            <TripSummary
              activities={selectedActivities}
              directions={directions}
              startTime={startTime}
            />
          </div> */}
          {/* <div className={styles.routeOptionsContainer}>
            <RouteOptions
              routeOptions={routeOptions}
              onRouteOptionsChange={handleSaveRouteOptions}
            />
          </div> */}
          <div className={styles.mapContainer}>
            <ItineraryMap
              directions={directions}
              location={startLocation}
              activities={selectedActivities}
              zoomLevel={7}
              mapWidth={375}
              mapHeight={320}
            />
          </div>
          <div className={styles.saveButtonContainer}>
            <Button 
              variant="contained"
              color="primary"
              disabled={isSaving}
              onClick={handleSaveItinerary}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
        <div className={styles.column}>
          <div className={styles.selectedActivitiesContainer}>
            <h3>Selected Activities</h3>
            <ActivityList
              activities={selectedActivities}
              onReorder={handleReorder}
              onTimeUpdate={(index, newTime) => {
                const newActivities = [...selectedActivities];
                newActivities[index].allottedTime = newTime;
                setSelectedActivities(newActivities);
              }}
              onDelete={handleDeleteActivity}
            />
          </div>
          {/* <div className={styles.optimizeButtonContainer}>
            <button onClick={optimizeOrder}>Optimize</button>
          </div> */}
        </div>
        <div className={styles.column}>
          <div className={styles.SuggestedActivitiesContainer}>
            <h3>Suggested Activities</h3>
            <SuggestedActivities
              selectedActivities={selectedActivities.map((activity) => activity.place?.place_id).filter((placeId) => placeId) as string[]}
              suggestions={itinerary.suggestions}
              handleAddActivity={(suggestion: google.maps.places.PlaceResult) => {
                const activity: Activity = {
                  name: `${suggestion.name}`,
                  place: suggestion,
                  allottedTime: 60
                };
                handleAddActivity(activity);
              }} 
            />
          </div>
          <div className={styles.addActivityContainer}>
            <h3>Add Activity</h3>
            <AddActivity
              onSubmit={handleAddActivity}
            />
          </div>
        </div>
      </div>
    </Box>
  );
};

export async function getServerSideProps(context: ParsedUrlQuery) {
  try {
    const params: any = context.params;
    const { id } = params;
    const res = await fetchItinerary(id);

    if (res) {
      const {_id, ...itinerary} = res;
      console.log("Itinerary retrieved");
      return { props: {
        itineraryId: id,
        itinerary
      }};
    } else {
      console.log(`Unable to retrieve itinerary with id: ${id}`);
      return { props: {
        itineraryId: null,
        itinerary: {}
      }}; 
    }
  } catch(err) {
    console.log(`Error: ${err}`);
    return { props: { itinerary: {}}};
  }
};

export default EditItinerary;